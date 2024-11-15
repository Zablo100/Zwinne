package com.project.project_rest_api.service;

import com.project.project_rest_api.model.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;

public interface StudentService {
    Optional<Student> getStudent(Integer studentId);
    Student setStudent(Student student);
    void deleteStudent(Integer studentId);
    Page<Student> getStudents(Pageable pageable);
    Page<Student> searchByNazwisko(String nazwisko, Pageable pageable);
}

