package com.project.project_rest_api.controller;

import java.net.URI;
import java.util.Optional;

import com.project.project_rest_api.model.ProjektWithTasks;
import com.project.project_rest_api.model.Student;
import com.project.project_rest_api.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import com.project.project_rest_api.model.Projekt;
import com.project.project_rest_api.service.ProjektService;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class ProjektController {
    private final ProjektService projektService;
    private final StudentService studentService;

    @Autowired
    public ProjektController(ProjektService projektService, StudentService studentService) {
        this.projektService = projektService;
        this.studentService = studentService;

    }

    @GetMapping("/projekty/{projektId}")
    public ResponseEntity<ProjektWithTasks> getProjekt(@PathVariable Integer projektId) {
        Optional<ProjektWithTasks> projektWithTasks = projektService.getProjektWithTasks(projektId);
        return projektWithTasks
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/projekty")
    public ResponseEntity<?> createProjekt(@Valid @RequestBody Projekt projekt) {
        try {
            Projekt newProject = projektService.setProjekt(projekt);

            URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                    .path("/{projektId}").buildAndExpand(newProject.getProjektId()).toUri();

            return ResponseEntity.created(location).build();
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Projekt o podanej nazwie już istnieje.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Wystąpił błąd podczas dodawania projektu.");
        }
    }


    @PutMapping("/projekty/{projektId}")
    public ResponseEntity<Void> updateProjekt(@PathVariable Integer projektId, @Valid @RequestBody Projekt projekt) {
        return projektService.getProjekt(projektId)
                .map(p -> {
                    projektService.setProjekt(p);
                    return new ResponseEntity<Void>(HttpStatus.OK); // 200
                }).orElse(ResponseEntity.notFound().build()); //404
    }

    @DeleteMapping("/projekty/{projektId}")
    public ResponseEntity<Void> deleteProjekt(@PathVariable Integer projektId) {
        return projektService.getProjekt(projektId)
                .map(p -> {
                    projektService.deleteProjekt(projektId);
                    return new ResponseEntity<Void>(HttpStatus.OK); // 200
                }).orElse(ResponseEntity.notFound().build()); //404
    }

    @GetMapping(value = "/projekty")
    Page<Projekt> getProjekty(Pageable pageable) {
        return projektService.getProjekty(pageable);
    }

    @GetMapping(value = "/projekty", params = "name")
    public Page<Projekt> getFilteredProjects(@RequestParam(name = "name") String name, Pageable pageable) {
        return projektService.searchByNazwa(name, pageable);
    }


    @PostMapping("projekt/{projektId}/studenci/{studentId}")
    public ResponseEntity<Void> assigneStudent(@PathVariable Integer projektId, @PathVariable Integer studentId) {
        Projekt updatedProjekt = projektService.addStudentToProjekt(projektId, studentId);
        return new ResponseEntity<Void>(HttpStatus.OK);
    }

    @DeleteMapping("/projekt/{projektId}/studenci/{studentId}")
    public ResponseEntity<Void> removeStudentFromProjekt(@PathVariable Integer projektId, @PathVariable Integer studentId) {
        Optional<Projekt> projektOptional = projektService.getProjekt(projektId);
        if (projektOptional.isPresent()) {
            projektService.removeStudentFromProjekt(projektId, studentId);
            return new ResponseEntity<>(HttpStatus.OK); // 200 OK
        }
        return ResponseEntity.notFound().build(); // 404 Not Found
    }

    @GetMapping("/projekty/{projektId}/isAssigned")
    public ResponseEntity<Boolean> isStudentAssignedToProject(
            @PathVariable Integer projektId,
            @RequestParam(value = "studentId", required = true) Integer studentId) {
        if (studentId == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(false); // Zwraca 400, jeśli brak studentId
        }

        boolean isAssigned = projektService.isStudentAssignedToProject(projektId, studentId);
        return ResponseEntity.ok(isAssigned);
    }

    @GetMapping("/projekty/student/{studentId}")
    public ResponseEntity<Page<Projekt>> getProjektyForStudent(
            @PathVariable Integer studentId,
            Pageable pageable) {
        Page<Projekt> projekty = projektService.getProjektyForStudent(studentId, pageable);
        if (projekty.isEmpty()) {
            return ResponseEntity.noContent().build(); // 204 No Content
        }
        return ResponseEntity.ok(projekty); // 200 OK z listą projektów
    }



}
