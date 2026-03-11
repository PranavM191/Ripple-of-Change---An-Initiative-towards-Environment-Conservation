package com.rippleofchange.api.controller;

import com.rippleofchange.api.dto.DriveRequest;
import com.rippleofchange.api.model.Drive;
import com.rippleofchange.api.service.DriveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // <-- NEW IMPORT
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/drives")
public class DriveController {

    @Autowired
    private DriveService driveService;

    // --- UPDATED: ONLY NGOs CAN CREATE DRIVES ---
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_NGO')") // <-- THE MAGIC LINE
    public ResponseEntity<Drive> createDrive(@RequestBody DriveRequest driveRequest, @AuthenticationPrincipal UserDetails userDetails) {
        String userEmail = userDetails.getUsername();
        Drive newDrive = driveService.createDrive(driveRequest, userEmail);
        return ResponseEntity.ok(newDrive);
    }

    // Anyone (User or NGO) can view drives, so no @PreAuthorize needed (just basic authentication)
    @GetMapping
    public ResponseEntity<List<Drive>> getAllDrives() {
        List<Drive> drives = driveService.getAllDrives();
        return ResponseEntity.ok(drives);
    }

    // Anyone can join (logic handled in service)
    @PostMapping("/{driveId}/join")
    public ResponseEntity<Drive> joinDrive(@PathVariable Long driveId, @AuthenticationPrincipal UserDetails userDetails) {
        String userEmail = userDetails.getUsername();
        Drive updatedDrive = driveService.joinDrive(driveId, userEmail);
        return ResponseEntity.ok(updatedDrive);
    }

    // Anyone can leave
    @DeleteMapping("/{driveId}/leave")
    public ResponseEntity<Drive> leaveDrive(@PathVariable Long driveId, @AuthenticationPrincipal UserDetails userDetails) {
        String userEmail = userDetails.getUsername();
        Drive updatedDrive = driveService.leaveDrive(driveId, userEmail);
        return ResponseEntity.ok(updatedDrive);
    }

    @PostMapping(value = "/{driveId}/complete", consumes = "multipart/form-data")
    public ResponseEntity<Drive> completeDrive(
            @PathVariable Long driveId,
            @RequestParam("wasteCollected") Double wasteCollected,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userEmail = userDetails.getUsername();

        Drive completedDrive = driveService.completeDrive(driveId, wasteCollected, file, userEmail);

        return ResponseEntity.ok(completedDrive);
    }
}