package com.project.project_rest_api.controller;

import com.project.project_rest_api.model.Student;
import com.project.project_rest_api.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api")
public class StudentController {

    private final StudentService studentService;

    @Autowired
    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping("/students/{studentId}")
    public ResponseEntity<Student> getStudent(@PathVariable Integer studentId) {
        return ResponseEntity.of(studentService.getStudent(studentId));
    }

    @PostMapping("/students")
    public ResponseEntity<Void> createStudent(@Valid @RequestBody Student student) {
        Student createdStudent = studentService.setStudent(student);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{studentId}").buildAndExpand(createdStudent.getStudentId()).toUri();

        return ResponseEntity.created(location).build();
    }

    @PutMapping("/students/{studentId}")
    public ResponseEntity<Void> updateStudent(@PathVariable Integer studentId, @Valid @RequestBody Student student) {
        return studentService.getStudent(studentId)
                .map(existingStudent -> {
                    student.setStudentId(studentId);
                    studentService.setStudent(student);
                    return new ResponseEntity<Void>(HttpStatus.OK); // 200
                }).orElse(ResponseEntity.notFound().build()); // 404
    }

    @DeleteMapping("/students/{studentId}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Integer studentId) {
        return studentService.getStudent(studentId)
                .map(existingStudent -> {
                    studentService.deleteStudent(studentId);
                    return new ResponseEntity<Void>(HttpStatus.OK); // 200
                }).orElse(ResponseEntity.notFound().build()); // 404
    }

    @GetMapping(value = "/students")
    public Page<Student> getStudents(Pageable pageable) {
        return studentService.getStudents(pageable);
    }

//    @GetMapping(value = "/students", params = "imie")
//    public Page<Student> getStudentsByImie(@RequestParam(name = "nazwisko") String nazwisko, Pageable pageable) {
//        return studentService.searchByNazwisko(nazwisko, pageable);
//    }
}
