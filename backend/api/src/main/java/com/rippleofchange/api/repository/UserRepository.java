package com.rippleofchange.api.repository;

import com.rippleofchange.api.model.Role; // Import Role
import com.rippleofchange.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    // --- NEW METHOD ---
    List<User> findByRole(Role role);
}