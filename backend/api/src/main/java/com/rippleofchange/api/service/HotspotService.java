package com.rippleofchange.api.service;

import com.rippleofchange.api.dto.HotspotRequest;
import com.rippleofchange.api.dto.MLAnalysisResponse;
import com.rippleofchange.api.model.Hotspot;
import com.rippleofchange.api.model.HotspotStatus;
import com.rippleofchange.api.model.Severity;
import com.rippleofchange.api.model.User;
import com.rippleofchange.api.repository.HotspotRepository;
import com.rippleofchange.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class HotspotService {

    @Autowired
    private HotspotRepository hotspotRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    /**
     * Creates a new hotspot.
     * @param request The hotspot data (lat, long, severity)
     * @param file The image file
     * @param userEmail The email of the logged-in user
     * @return The saved Hotspot object
     */
    public Hotspot createHotspot(HotspotRequest request, MultipartFile file, String userEmail) {

        // 1. Find the user who is reporting this
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userEmail));

        // 2. Call the Python AI Microservice to get the real severity
        Severity aiDetectedSeverity = Severity.MODERATE; // Default fallback
        try {
            RestTemplate restTemplate = new RestTemplate();
            String pythonApiUrl = "http://localhost:8000/infer";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            ByteArrayResource fileAsResource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename() != null ? file.getOriginalFilename() : "upload.jpg";
                }
            };

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", fileAsResource);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            ResponseEntity<MLAnalysisResponse> response = restTemplate.postForEntity(
                    pythonApiUrl, requestEntity, MLAnalysisResponse.class);

            if (response.getBody() != null) {
                int aiScore = response.getBody().getSeverity_score();
                // Map the 1-10 AI score to our Enum
                if (aiScore <= 3) {
                    aiDetectedSeverity = Severity.LOW;
                } else if (aiScore <= 6) {
                    aiDetectedSeverity = Severity.MODERATE;
                } else {
                    aiDetectedSeverity = Severity.HIGH;
                }
                System.out.println("AI Success! Detected classes: " + response.getBody().getDetected_classes());
                System.out.println("AI assigned score: " + aiScore + " -> Mapped to: " + aiDetectedSeverity);
            }
        } catch (Exception e) {
            System.err.println("AI Service unavailable or failed. Falling back to MODERATE. Error: " + e.getMessage());
        }

        // 3. Save the image file to the server's disk
        String filename = fileStorageService.save(file);

        // 4. Create a "web" URL for the file
        String imageUrl = "/uploads/" + filename;

        // 5. Create the new Hotspot object
        Hotspot hotspot = new Hotspot();
        hotspot.setLatitude(request.getLatitude());
        hotspot.setLongitude(request.getLongitude());
        hotspot.setSeverity(aiDetectedSeverity); // Uses AI score or fallback
        hotspot.setImageUrl(imageUrl);
        hotspot.setReporter(user);

        // 6. Award Points
        user.setPoints(user.getPoints() + 10);
        userRepository.save(user);

        // 7. Save the hotspot to the database
        return hotspotRepository.save(hotspot);
    }

    /**
     * Gets all hotspots.
     * @return A list of all Hotspot objects
     */
    public List<Hotspot> getAllHotspots() {
        return hotspotRepository.findByStatus(HotspotStatus.ACTIVE);
    }
}