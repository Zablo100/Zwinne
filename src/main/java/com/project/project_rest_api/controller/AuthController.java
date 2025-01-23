package com.project.project_rest_api.controller;

import com.project.project_rest_api.model.api.LoginRequest;
import com.project.project_rest_api.model.api.SignupRequest;
import com.project.project_rest_api.service.AuthService;
import jakarta.validation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;
    public AuthController(AuthService authService)
    {
        this.authService = authService;
    }

    @PostMapping("/signin")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        return authService.login(loginRequest);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> addStudent(@Valid @RequestBody SignupRequest signupRequest) {
        return authService.register(signupRequest);
    }

    @PostMapping("/signout")
    public ResponseEntity<Map<String, String>> signout() {
        return ResponseEntity.ok(Map.of(
                "message", "Logged out"
        ));
    }

}
