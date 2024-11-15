package com.project.project_rest_api.service;

import com.project.project_rest_api.model.Projekt;
import com.project.project_rest_api.model.ProjektWithTasks;
import org.springframework.data.domain.Page;


import org.springframework.data.domain.Pageable;
import java.util.Optional;

public interface ProjektService {
    Optional<Projekt> getProjekt(Integer projektId);
    Projekt setProjekt(Projekt projekt);
    void deleteProjekt(Integer projektId);
    Page<Projekt> getProjekty(Pageable pageable);
    Page<Projekt> searchByNazwa(String nazwa, Pageable pageable);
    Projekt addStudentToProjekt(Integer projektId, Integer studentId);
    Optional<ProjektWithTasks> getProjektWithTasks(Integer projektId);
}
