package com.rippleofchange.api.dto;

import lombok.Data;

@Data
public class AuthResponse {
    private String token;
    private String email;
    private String fullName; // <-- New Field

    public AuthResponse(String token, String email, String fullName) {
        this.token = token;
        this.email = email;
        this.fullName = fullName;
    }
}