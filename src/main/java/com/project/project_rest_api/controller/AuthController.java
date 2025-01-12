package com.project.project_rest_api.controller;

import com.project.project_rest_api.datasource.LogRepository;
import com.project.project_rest_api.datasource.StudentRepository;
import com.project.project_rest_api.model.Student;
import com.project.project_rest_api.utils.DbLogger;
import com.project.project_rest_api.utils.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    private final DbLogger logger;

    public AuthController(
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

    @PostMapping("/signin")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");

        Student student = studentRepository.findByEmail(email);
        if (student == null) {
            logger.warn(String.format("Próba logowania na nieistniejący adres email %s", email));
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Użytkownik nie istnieje"));
        }


        if (!passwordEncoder.matches(password, student.getPassword())) {
            logger.warn(String.format("Próba logowania przy użyciu błednego hasła na konta użytkownika %s", email));
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Nieprawidłowe hasło"));
        }


        String token = jwtUtil.generateToken(email);

        logger.info(String.format("Pomyślnie zalogowano %s", email));
        return ResponseEntity.ok(Map.of(
                "token", token,
                "name", student.getImie(),
                "surname", student.getNazwisko(),
                "message", "Zalogowano pomyślnie!"
        ));
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
            logger.info(String.format("Utworzono konto %s pomyślnie", student.getEmail()));
            return ResponseEntity.ok("Student uploaded successfully!");

        } catch (Exception e) {
            logger.error(String.format("Przy rejestracji konta wystąpił problem: %s",e.getMessage()));
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body("Failed to upload  student!");
        }
    }

    @PostMapping("/signout")
    public ResponseEntity<Map<String, String>> signout() {
        return ResponseEntity.ok(Map.of(
                "message", "Logged out"
        ));
    }

}
