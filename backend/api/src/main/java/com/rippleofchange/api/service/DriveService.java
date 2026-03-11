package com.rippleofchange.api.service;

import com.rippleofchange.api.dto.DriveRequest;
import com.rippleofchange.api.model.Drive;
import com.rippleofchange.api.model.User;
import com.rippleofchange.api.repository.DriveRepository;
import com.rippleofchange.api.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException; // Add this import
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.rippleofchange.api.model.DriveStatus; // Add this
import org.springframework.web.multipart.MultipartFile; // Add this
import org.springframework.security.access.AccessDeniedException;
import java.util.List;
import com.rippleofchange.api.model.Hotspot; // Import
import com.rippleofchange.api.model.HotspotStatus; // Import
import com.rippleofchange.api.repository.HotspotRepository; // Import

@Service
public class DriveService {

    @Autowired
    private HotspotRepository hotspotRepository;

    @Autowired
    private DriveRepository driveRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public Drive createDrive(DriveRequest driveRequest, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        Drive drive = new Drive();
        drive.setTitle(driveRequest.getTitle());
        drive.setDescription(driveRequest.getDescription());
        drive.setLocationName(driveRequest.getLocationName());
        drive.setLatitude(driveRequest.getLatitude());
        drive.setLongitude(driveRequest.getLongitude());
        drive.setEventDate(driveRequest.getEventDate());
        drive.setOrganizer(user);

        return driveRepository.save(drive);
    }

    public List<Drive> getAllDrives() {
        return driveRepository.findAll();
    }

    // --- NEW METHOD TO JOIN A DRIVE ---
    public Drive joinDrive(Long driveId, String userEmail) {
        // 1. Find the drive
        Drive drive = driveRepository.findById(driveId)
                .orElseThrow(() -> new EntityNotFoundException("Drive not found with id: " + driveId));

        // 2. Find the user
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        // Prevent duplicate points if they join again (optional check, but good practice)
        if (!drive.getParticipants().contains(user)) {
            drive.getParticipants().add(user);

            // --- NEW: AWARD POINTS ---
            user.setPoints(user.getPoints() + 50);
            userRepository.save(user);
            // -------------------------
        }

        // 4. Save the drive (this updates the join table)
        return driveRepository.save(drive);
    }

    // --- NEW METHOD TO LEAVE A DRIVE ---
    public Drive leaveDrive(Long driveId, String userEmail) {
        // 1. Find the drive
        Drive drive = driveRepository.findById(driveId)
                .orElseThrow(() -> new EntityNotFoundException("Drive not found with id: " + driveId));

        // 2. Find the user
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        // 3. Remove the user from the drive's participant set
        drive.getParticipants().remove(user);

        // 4. Save the drive
        return driveRepository.save(drive);
    }

//    public Drive completeDrive(Long driveId, Double wasteCollected, MultipartFile file, String userEmail) {
//        // 1. Find the drive
//        Drive drive = driveRepository.findById(driveId)
//                .orElseThrow(() -> new EntityNotFoundException("Drive not found"));
//
//        // --- ADD THESE DEBUG LINES ---
//        System.out.println(">>> DEBUG CHECK <<<");
//        System.out.println("Drive ID: " + driveId);
//        System.out.println("Organizer Email (Database): " + drive.getOrganizer().getEmail());
//        System.out.println("Your Token Email (Postman): " + userEmail);
//        System.out.println(">>> END DEBUG <<<");
//        // -----------------------------
//
//        // 2. SECURITY CHECK: Is the logged-in user the organizer?
//        if (!drive.getOrganizer().getEmail().equals(userEmail)) {
//            throw new AccessDeniedException("Only the organizer can complete this drive.");
//        }
//
//        // 3. Save the "After" photo
//        String filename = fileStorageService.save(file);
//        String fileUrl = "/uploads/" + filename;
//
//        // 4. Update Drive details
//        drive.setWasteCollected(wasteCollected);
//        drive.setAfterPhotoUrl(fileUrl);
//        drive.setStatus(DriveStatus.COMPLETED);
//
//        // 5. Save
//        return driveRepository.save(drive);
//    }

    public Drive completeDrive(Long driveId, Double wasteCollected, MultipartFile file, String userEmail) {
        Drive drive = driveRepository.findById(driveId)
                .orElseThrow(() -> new EntityNotFoundException("Drive not found"));

        // Security Check
        if (!drive.getOrganizer().getEmail().equals(userEmail)) {
            throw new AccessDeniedException("Only the organizer can complete this drive.");
        }

        // Save Photo
        String filename = fileStorageService.save(file);
        String fileUrl = "/uploads/" + filename;

        // Update Drive
        drive.setWasteCollected(wasteCollected);
        drive.setAfterPhotoUrl(fileUrl);
        drive.setStatus(DriveStatus.COMPLETED);

        // --- NEW LOGIC: AUTO-CLEAN NEARBY HOTSPOTS ---
        List<Hotspot> activeHotspots = hotspotRepository.findByStatus(HotspotStatus.ACTIVE);

        for (Hotspot h : activeHotspots) {
            // Calculate distance (approximate)
            double latDiff = h.getLatitude() - drive.getLatitude();
            double lngDiff = h.getLongitude() - drive.getLongitude();
            double distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);

            // 0.002 degrees is roughly 200 meters
            if (distance < 0.002) {
                h.setStatus(HotspotStatus.CLEANED);
                hotspotRepository.save(h);
                System.out.println(">>> Auto-Cleaned Hotspot ID: " + h.getId());
            }
        }
        // ---------------------------------------------

        return driveRepository.save(drive);
    }
}