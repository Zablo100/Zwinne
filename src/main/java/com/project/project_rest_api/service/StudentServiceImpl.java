package com.project.project_rest_api.service;

import com.project.project_rest_api.datasource.StudentRepository;
import com.project.project_rest_api.model.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public StudentServiceImpl(StudentRepository studentRepository, PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Optional<Student> getStudent(Integer studentId) {
        return studentRepository.findById(studentId);
    }

    @Override
    public Student setStudent(Student student) {
        return studentRepository.save(student);
    }

    @Override
    public void deleteStudent(Integer studentId) {
        studentRepository.deleteById(studentId);
    }

    @Override
    public Page<Student> getStudents(Pageable pageable) {
        return studentRepository.findAll(pageable);
    }

    @Override
    public Page<Student> searchByNazwisko(String nazwisko, Pageable pageable) {
        return studentRepository.findByNazwiskoStartsWithIgnoreCase(nazwisko, pageable);
    }
    public boolean changePassword(Integer studentId, String newPassword) {
        // Znajdź studenta na podstawie ID
        return studentRepository.findById(studentId)
                .map(student -> {
                    // Kodowanie nowego hasła
                    String encodedPassword = passwordEncoder.encode(newPassword);
                    student.setPassword(encodedPassword);
                    // Zapisz zaktualizowanego studenta
                    studentRepository.save(student);
                    return true; // Zwróć true, jeśli hasło zostało pomyślnie zmienione
                }).orElse(false); // Zwróć false, jeśli student o danym ID nie został znaleziony
    }
}
