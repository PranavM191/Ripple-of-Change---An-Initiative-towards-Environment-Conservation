package com.rippleofchange.api.service;

import com.rippleofchange.api.dto.AuthResponse;
import com.rippleofchange.api.dto.LoginRequest;
import com.rippleofchange.api.dto.NgoRegisterRequest;
import com.rippleofchange.api.dto.RegisterRequest;
import com.rippleofchange.api.model.Role;
import com.rippleofchange.api.model.User;
import com.rippleofchange.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class AuthService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;

    public User register(RegisterRequest registerRequest) {
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new RuntimeException("Error: Email is already taken!");
        }
        User user = new User();
        user.setFullName(registerRequest.getFullName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(Role.ROLE_USER);
        user.setPoints(0); // Default points
        return userRepository.save(user);
    }

    public User registerNgo(NgoRegisterRequest registerRequest) {
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new RuntimeException("Error: Email is already taken!");
        }
        User user = new User();
        user.setFullName(registerRequest.getFullName());
        user.setOrganizationName(registerRequest.getOrganizationName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(Role.ROLE_NGO);
        user.setPoints(0); // Default points
        return userRepository.save(user);
    }

    // --- UPDATED LOGIN METHOD ---
    public AuthResponse login(LoginRequest loginRequest, AuthenticationManager authManager) {
        // 1. Authenticate
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        // 2. Generate Token
        String token = jwtUtil.generateToken(userDetails);

        // 3. Fetch the actual User object to get the Full Name
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // 4. Return Token + Email + Name
        return new AuthResponse(token, user.getEmail(), user.getFullName());
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(user.getRole().name());

        System.out.println(">>> DEBUG: User " + email + " has role: " + user.getRole().name());

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(authority)
        );
    }
}