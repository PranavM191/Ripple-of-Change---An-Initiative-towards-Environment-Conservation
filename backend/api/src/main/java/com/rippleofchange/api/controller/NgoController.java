package com.rippleofchange.api.controller;

import com.rippleofchange.api.model.Role;
import com.rippleofchange.api.model.User;
import com.rippleofchange.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/ngos")
public class NgoController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<User>> getAllNgos() {
        // Fetch all users who have the role 'ROLE_NGO'
        List<User> ngos = userRepository.findByRole(Role.ROLE_NGO);
        return ResponseEntity.ok(ngos);
    }
}