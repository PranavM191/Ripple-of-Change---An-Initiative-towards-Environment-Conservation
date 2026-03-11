package com.rippleofchange.api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "users")
@EqualsAndHashCode(exclude = {"joinedDrives", "reportedHotspots"})
@ToString(exclude = {"joinedDrives", "reportedHotspots"})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName; // For a user, their name. For an NGO, the contact person's name.

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    @JsonIgnore
    private String password;

    // --- NEW FIELDS ---
    @Enumerated(EnumType.STRING) // Store the role as a string ("ROLE_USER", "ROLE_NGO")
    @Column(nullable = false)
    private Role role;

    @Column // This can be null, so no "nullable = false"
    private String organizationName; // The name of the NGO (e.g., "Clean Ganga Foundation")

    // --- NEW FIELD: POINTS ---
    @Column(nullable = false)
    private Integer points = 0; // Default to 0

    // --- EXISTING RELATIONSHIPS ---
    @ManyToMany(mappedBy = "participants")
    @JsonIgnore
    private Set<Drive> joinedDrives = new HashSet<>();

    @OneToMany(mappedBy = "reporter")
    @JsonIgnore
    private Set<Hotspot> reportedHotspots = new HashSet<>();
}