package com.rippleofchange.api.services;

import com.rippleofchange.api.dto.RegisterRequest;
import com.rippleofchange.api.model.Role;
import com.rippleofchange.api.model.User;
import com.rippleofchange.api.repository.UserRepository;
import com.rippleofchange.api.service.AuthService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class) // This tells JUnit to activate Mockito
class AuthServiceTest {

    @Mock // Creates a "fake" version of UserRepository
    private UserRepository userRepository;

    @Mock // Creates a "fake" version of PasswordEncoder
    private PasswordEncoder passwordEncoder;

    @InjectMocks // Creates a real AuthService and injects the mocks into it
    private AuthService authService;

    // --- Test 1: The "Happy Path" ---
    @Test
    void whenRegisterNewUser_shouldSaveUserWithCorrectRole() {
        // 1. ARRANGE (Set up the test)

        // This is the data that will come from the controller
        RegisterRequest request = new RegisterRequest();
        request.setEmail("newuser@example.com");
        request.setFullName("Test User");
        request.setPassword("password123");

        // This is the user we expect to be "saved"
        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setEmail("newuser@example.com");
        savedUser.setFullName("Test User");
        savedUser.setPassword("hashed_password_abc"); // The fake hashed password
        savedUser.setRole(Role.ROLE_USER);

        // --- Teach our mocks what to do ---

        // 1. Tell the user repository to "find nothing" when it checks for the email
        when(userRepository.findByEmail("newuser@example.com")).thenReturn(Optional.empty());

        // 2. Tell the password encoder to return a fake hash
        when(passwordEncoder.encode("password123")).thenReturn("hashed_password_abc");

        // 3. Tell the user repository to return our "savedUser" when "save" is called
        when(userRepository.save(any(User.class))).thenReturn(savedUser);


        // 2. ACT (Run the method we are testing)
        User result = authService.register(request);


        // 3. ASSERT (Check if the result is correct)
        assertNotNull(result);
        assertEquals("newuser@example.com", result.getEmail());
        assertEquals(Role.ROLE_USER, result.getRole());
        assertEquals("hashed_password_abc", result.getPassword());

        // Verify that our mocks were called correctly
        verify(userRepository).findByEmail("newuser@example.com"); // Was findByEmail called?
        verify(passwordEncoder).encode("password123"); // Was encode called?
        verify(userRepository).save(any(User.class)); // Was save called?
    }

    // --- Test 2: The "Negative Path" ---
    @Test
    void whenRegisterUserWithExistingEmail_shouldThrowException() {
        // 1. ARRANGE

        // Create a request with an email that already exists
        RegisterRequest request = new RegisterRequest();
        request.setEmail("existing@example.com");
        request.setPassword("password123");

        // Create a fake "existing" user to be "found"
        User existingUser = new User();
        existingUser.setId(1L);
        existingUser.setEmail("existing@example.com");

        // Teach the mock repository to "find" this user
        when(userRepository.findByEmail("existing@example.com")).thenReturn(Optional.of(existingUser));

        // 2. ACT & 3. ASSERT

        // Assert that the code inside the lambda () -> ... throws a RuntimeException
        Exception exception = assertThrows(RuntimeException.class, () -> {
            authService.register(request);
        });

        // Optional: Check if the error message is correct
        assertEquals("Error: Email is already taken!", exception.getMessage());

        // Crucially, verify that these methods were NEVER called
        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository, never()).save(any(User.class));
    }
}