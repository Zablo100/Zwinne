package com.project.project_rest_api.service;

import com.project.project_rest_api.controller.AuthController;
import com.project.project_rest_api.datasource.LogRepository;
import com.project.project_rest_api.datasource.StudentRepository;
import com.project.project_rest_api.model.Student;
import com.project.project_rest_api.model.api.LoginRequest;
import com.project.project_rest_api.model.api.SignupRequest;
import com.project.project_rest_api.utils.DbLogger;
import com.project.project_rest_api.utils.JwtUtil;
import jakarta.validation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;

@Service
public class AuthServiceImpl implements AuthService {
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final StudentRepository studentRepository;
    private final DbLogger logger;

    public AuthServiceImpl(
            JwtUtil jwtUtil,
            PasswordEncoder passwordEncoder,
            StudentRepository studentRepository,
            LogRepository logRepository)
    {
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
        this.studentRepository = studentRepository;
        this.logger = new DbLogger(AuthController.class, logRepository);
    }


    @Override
    public ResponseEntity<?> login(LoginRequest loginRequest) {
        Student student = studentRepository.findByEmail(loginRequest.getEmail());

        if (student == null) {
            logger.warn(String.format("Próba logowania na nieistniejący adres email %s", loginRequest.getEmail()));
            return createErrorResponse(HttpStatus.UNAUTHORIZED, "Użytkownik nie istnieje");
        }

        if (!passwordEncoder.matches(loginRequest.getPassword(), student.getPassword())) {
            logger.warn(String.format("Próba logowania przy użyciu błędnego hasła na konto użytkownika %s", loginRequest.getEmail()));
            return createErrorResponse(HttpStatus.UNAUTHORIZED, "Nieprawidłowe hasło");
        }

        String token = jwtUtil.generateToken(loginRequest.getEmail());
        logger.info(String.format("Pomyślnie zalogowano %s", loginRequest.getEmail()));
        return ResponseEntity.ok(Map.of(
                "token", token,
                "name", student.getImie(),
                "surname", student.getNazwisko(),
                "role", student.getRole(),
                "studentId", student.getStudentId(),
                "message", "Zalogowano pomyślnie!"
        ));
    }

    @Override
    public ResponseEntity<?> register(SignupRequest signupRequest) {

        // Sprawdź, czy email istnieje
        if (studentRepository.findByEmail(signupRequest.getEmail()) != null) {
            return createErrorResponse(HttpStatus.BAD_REQUEST, "Email jest już zajęty");
        }

        // Sprawdź, czy numer indeksu istnieje
        if (studentRepository.findByNrIndeksu(signupRequest.getIndeks()).isPresent()) {
            return createErrorResponse(HttpStatus.BAD_REQUEST, "Numer indeksu jest już zajęty");
        }

        try {
            Student student = new Student(
                    signupRequest.getName(),
                    signupRequest.getLastName(),
                    signupRequest.getIndeks(),
                    signupRequest.getEmail(),
                    false,
                    passwordEncoder.encode(signupRequest.getPassword()),
                    "user"
            );

            studentRepository.save(student);

            logger.info(String.format("Utworzono konto %s pomyślnie", signupRequest.getEmail()));
            return ResponseEntity.ok(Map.of("message", "Rejestracja zakończona sukcesem"));
        } catch (Exception e) {
            logger.warn(String.format("Błąd podczas rejestracji: %s", e.getMessage()));
            return createErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<Map<String, String>> createErrorResponse(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(Map.of("message", message));
    }
}
