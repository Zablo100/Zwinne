package com.project.project_rest_api.service;

import com.project.project_rest_api.model.api.LoginRequest;
import com.project.project_rest_api.model.api.SignupRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;

public interface AuthService {
    ResponseEntity<?> login(LoginRequest loginRequest);
    ResponseEntity<?> register(SignupRequest signupRequest);
    ResponseEntity<Map<String, String>> createErrorResponse(HttpStatus status, String message);
}
