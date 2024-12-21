package com.project.project_rest_api.controller;

import com.project.project_rest_api.datasource.StudentRepository;
import com.project.project_rest_api.model.Student;
import com.project.project_rest_api.utils.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

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
    public ResponseEntity<String> addStudent(@RequestBody Map<String, String> studentData) {



        try {
            Student student = new Student();
            student.setImie(studentData.get("name"));
            student.setNazwisko(studentData.get("lastName"));
            student.setPassword(passwordEncoder.encode(studentData.get("password")));
            student.setEmail(studentData.get("email"));
            student.setNrIndeksu(studentData.get("indeks"));
            System.out.println("Received data: " + student.getEmail());
            studentRepository.save(student);
            return ResponseEntity.ok("Student uploaded successfully!");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body("Failed to upload student!");
        }
    }



}
