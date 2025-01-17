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
                "role", student.getRole(),
                "studentId", student.getStudentId(),
                "message", "Zalogowano pomyślnie!"
        ));
    }
    @PostMapping("/signup")
    public ResponseEntity<?> addStudent(@RequestBody Map<String, String> studentData) {
        String email = studentData.get("email");
        String indeks = studentData.get("indeks");

        // Sprawdź, czy email istnieje
        if (studentRepository.findByEmail(email) != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Email jest już zajęty"));
        }

        // Sprawdź, czy numer indeksu istnieje
        if (studentRepository.findByNrIndeksu(indeks).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Numer indeksu jest już zajęty"));
        }

        // Walidacja hasła
        String password = studentData.get("password");
        if (!isValidPassword(password)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Hasło musi zawierać co najmniej 8 znaków, jedną dużą literę, jedną małą literę i cyfrę"));
        }

        try {
            Student student = new Student();
            student.setImie(studentData.get("name"));
            student.setNazwisko(studentData.get("lastName"));
            student.setPassword(passwordEncoder.encode(password));
            student.setEmail(email);
            student.setNrIndeksu(indeks);
            student.setRole("user");
            studentRepository.save(student);

            logger.info(String.format("Utworzono konto %s pomyślnie", email));
            return ResponseEntity.ok(Map.of("message", "Rejestracja zakończona sukcesem"));
        } catch (Exception e) {
            logger.error(String.format("Błąd podczas rejestracji: %s", e.getMessage()));
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Błąd podczas rejestracji"));
        }
    }

    private boolean isValidPassword(String password) {
        String passwordPattern = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$";
        return password.matches(passwordPattern);
    }
    @PostMapping("/signout")
    public ResponseEntity<Map<String, String>> signout() {
        return ResponseEntity.ok(Map.of(
                "message", "Logged out"
        ));
    }

}
