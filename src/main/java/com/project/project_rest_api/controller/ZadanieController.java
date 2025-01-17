package com.project.project_rest_api.controller;

import com.project.project_rest_api.model.Zadanie;
import com.project.project_rest_api.service.ZadanieService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import java.net.URI;
import java.util.List;


@RestController
@RequestMapping("/api")
@CrossOrigin
public class ZadanieController {

    private final ZadanieService zadanieService;

    @Autowired
    public ZadanieController(ZadanieService zadanieService) {
        this.zadanieService = zadanieService;
    }

    @GetMapping(value = "/zadania", params = "status")
    public Page<Zadanie> getZadaniaByStatus(@RequestParam(name = "status") String status, Pageable pageable) {
        return zadanieService.getZadaniaByStatus(status, pageable);
    }



    @PostMapping("/zadania")
    public ResponseEntity<Void> createZadanie(@Valid @RequestBody Zadanie zadanie) {
        Zadanie createdZadanie = zadanieService.setZadanie(zadanie);
        zadanie.setStatus("backlog");
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{zadanieId}").buildAndExpand(createdZadanie.getZadanieId()).toUri();

        return ResponseEntity.created(location).build();
    }

    @PutMapping("/zadania/{zadanieId}")
    public ResponseEntity<Void> updateZadanie(@PathVariable Integer zadanieId, @Valid @RequestBody Zadanie zadanie) {
        return zadanieService.getZadanie(zadanieId)
                .map(existingZadanie -> {
                    zadanie.setZadanieId(zadanieId); // Ustawienie ID zadania przed zapisem
                    if (zadanie.getStatus() == null) {
                        zadanie.setStatus(existingZadanie.getStatus());
                    }
                    zadanieService.setZadanie(zadanie);
                    return new ResponseEntity<Void>(HttpStatus.OK); // 200
                }).orElse(ResponseEntity.notFound().build()); // 404
    }


    @DeleteMapping("/zadania/{zadanieId}")
    public ResponseEntity<Void> deleteZadanie(@PathVariable Integer zadanieId) {
        return zadanieService.getZadanie(zadanieId)
                .map(existingZadanie -> {
                    zadanieService.deletZadanie(zadanieId);
                    return new ResponseEntity<Void>(HttpStatus.OK);
                }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/zadania/{zadanieId}/status")
    public ResponseEntity<Void> updateStatus(@PathVariable Integer zadanieId, @RequestBody String newStatus) {
        return zadanieService.getZadanie(zadanieId)
                .map(existingZadanie -> {
                    existingZadanie.setStatus(newStatus);
                    zadanieService.setZadanie(existingZadanie);
                    return new ResponseEntity<Void>(HttpStatus.OK);
                }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/zadania")
    public ResponseEntity<List<Zadanie>> getAllZadania() {
        List<Zadanie> zadania = zadanieService.getAllZadania();
        return ResponseEntity.ok(zadania);
    }



//    @GetMapping(value = "/zadania", params = "nazwa")
//    public Page<Zadanie> getZadaniaByNazwa(@RequestParam(name = "nazwa") String nazwa, Pageable pageable) {
//        return zadanieService.searchByNazwa(nazwa, pageable);
//    }
}

