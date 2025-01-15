package com.project.project_rest_api.controller;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.nio.file.Files;

import com.project.project_rest_api.datasource.ProjektRepository;
import com.project.project_rest_api.model.FileProject;
import com.project.project_rest_api.model.ProjektWithTasks;
import com.project.project_rest_api.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import com.project.project_rest_api.model.Projekt;
import com.project.project_rest_api.service.ProjektService;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class ProjektController {
    private final ProjektService projektService;
    private final StudentService studentService;
    private final ProjektRepository projektRepository;

    @Autowired
    public ProjektController(ProjektService projektService, StudentService studentService, ProjektRepository projektRepository) {
        this.projektService = projektService;
        this.studentService = studentService;
        this.projektRepository = projektRepository;
    }

    @GetMapping("/projekty/{projektId}")
    public ResponseEntity<ProjektWithTasks> getProjekt(@PathVariable Integer projektId) {
        Optional<ProjektWithTasks> projektWithTasks = projektService.getProjektWithTasks(projektId);
        return projektWithTasks
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/projekty")
    public ResponseEntity<Void> createProjekt(@Valid @RequestBody Projekt projekt) {
        Projekt newProject = projektService.setProjekt(projekt);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{projektId}").buildAndExpand(newProject.getProjektId()).toUri();

        return ResponseEntity.created(location).build();
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


}
