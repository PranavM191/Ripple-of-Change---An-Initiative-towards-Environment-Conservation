package com.rippleofchange.api.repository;

import com.rippleofchange.api.model.Hotspot;
import com.rippleofchange.api.model.HotspotStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotspotRepository extends JpaRepository<Hotspot, Long> {
    // Find only the active pollution
    List<Hotspot> findByStatus(HotspotStatus status);
}