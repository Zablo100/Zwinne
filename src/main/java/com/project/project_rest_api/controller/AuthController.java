package com.project.project_rest_api.controller;

import com.project.project_rest_api.datasource.StudentRepository;
import com.project.project_rest_api.model.Student;
import com.project.project_rest_api.utils.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController { private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final StudentRepository studentRepository;

    public AuthController(JwtUtil jwtUtil, PasswordEncoder passwordEncoder, StudentRepository studentRepository) {
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
        this.studentRepository = studentRepository;
    }

    @PostMapping("/signin")
    public ResponseEntity<String> login(@RequestParam String username, @RequestParam String password) {
        if ("admin".equals(username) && "password".equals(password)) {
            String token = jwtUtil.generateToken(username);
            return ResponseEntity.ok(token);
        }
        return ResponseEntity.status(401).body("Nieprawidłowe dane logowania");
    }
    @PostMapping("/signup")
    public ResponseEntity<String> addStudent(
            @RequestParam("name") String name,
            @RequestParam("lastName") String lastName,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("indeks") String indeks


    ) {
        try {
            Student student = new Student();
            student.setImie(name);
            student.setPassword(passwordEncoder.encode(password));
            student.setEmail(email);
            student.setNrIndeksu(indeks);
            studentRepository.save(student);
            return ResponseEntity.ok("Student uploaded successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body("Failed to upload student!");
        }
    }


}
