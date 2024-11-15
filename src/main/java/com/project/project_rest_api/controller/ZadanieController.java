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

@RestController
@RequestMapping("/api")
public class ZadanieController {

    private final ZadanieService zadanieService;

    @Autowired
    public ZadanieController(ZadanieService zadanieService) {
        this.zadanieService = zadanieService;
    }

    @GetMapping("/zadania/{zadanieId}")
    public ResponseEntity<Zadanie> getZadanie(@PathVariable Integer zadanieId) {
        return ResponseEntity.of(zadanieService.getZadanie(zadanieId));
    }

    @PostMapping("/zadania")
    public ResponseEntity<Void> createZadanie(@Valid @RequestBody Zadanie zadanie) {
        Zadanie createdZadanie = zadanieService.setZadanie(zadanie);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{zadanieId}").buildAndExpand(createdZadanie.getZadanieId()).toUri();

        return ResponseEntity.created(location).build();
    }

    @PutMapping("/zadania/{zadanieId}")
    public ResponseEntity<Void> updateZadanie(@PathVariable Integer zadanieId, @Valid @RequestBody Zadanie zadanie) {
        return zadanieService.getZadanie(zadanieId)
                .map(existingZadanie -> {
                    zadanie.setZadanieId(zadanieId); // Ustawienie ID zadania przed zapisem
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

    @GetMapping(value = "/zadania")
    public Page<Zadanie> getZadania(Pageable pageable) {
        return zadanieService.getZadania(pageable);
    }

//    @GetMapping(value = "/zadania", params = "nazwa")
//    public Page<Zadanie> getZadaniaByNazwa(@RequestParam(name = "nazwa") String nazwa, Pageable pageable) {
//        return zadanieService.searchByNazwa(nazwa, pageable);
//    }
}

