package com.rippleofchange.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "hotspots")
public class Hotspot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Severity severity;

    // --- NEW FIELD ---
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private HotspotStatus status = HotspotStatus.ACTIVE; // Default is ACTIVE
    // ----------------

    @Column(nullable = false)
    private String imageUrl;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "reporter_id", nullable = false)
    private User reporter;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}