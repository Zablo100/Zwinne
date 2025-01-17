package com.project.project_rest_api.controller;

import com.project.project_rest_api.datasource.LogRepository;
import com.project.project_rest_api.model.CreateTaskRequest;
import com.project.project_rest_api.model.Projekt;
import com.project.project_rest_api.model.Zadanie;
import com.project.project_rest_api.service.ProjektService;
import com.project.project_rest_api.service.ZadanieService;
import com.project.project_rest_api.utils.DbLogger;
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
import java.util.logging.Logger;


@RestController
@RequestMapping("/api")
@CrossOrigin
public class ZadanieController {

    private final ZadanieService zadanieService;
    private final ProjektService projektService;
    private final LogRepository logRepository;
    private final DbLogger dbLogger;

    @Autowired
    public ZadanieController(ZadanieService zadanieService, ProjektService projektService, LogRepository logRepository) {
        this.zadanieService = zadanieService;
        this.projektService = projektService;
        this.logRepository = logRepository;
        dbLogger = new DbLogger(ZadanieController.class, logRepository);
    }

    @GetMapping(value = "/zadania", params = "status")
    public Page<Zadanie> getZadaniaByStatus(@RequestParam(name = "status") String status, Pageable pageable) {
        return zadanieService.getZadaniaByStatus(status, pageable);
    }



    @PostMapping("/zadania")
    public ResponseEntity<Void> createZadanie(@Valid @RequestBody CreateTaskRequest zadanieRequest) {

        if(!zadanieService.canCreateTask(zadanieRequest.getStudentId(), zadanieRequest.getProjektId())){
            dbLogger.debug(String.format("Student o id: %s nie może tworzyć zadani w projekcie: %s", zadanieRequest.getStudentId(), zadanieRequest.getProjektId()));
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }


        Projekt projekt = projektService.getProjekt(zadanieRequest.getProjektId()).orElse(null);

        if(projekt == null){
            dbLogger.debug(String.format("Dodawanie nowego zadania nie powiodło się, błędne Id projektu (%s)", zadanieRequest.getProjektId()));
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        zadanieRequest.getZadanie().setProjekt(projekt);
        Zadanie createdZadanie = zadanieService.setZadanie(zadanieRequest.getZadanie());

        zadanieRequest.getZadanie().setStatus("backlog");
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

