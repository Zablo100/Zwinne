package com.project.project_rest_api.service;

import com.project.project_rest_api.model.Zadanie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface ZadanieService {
    Optional<Zadanie> getZadanie(Integer zadanieId);
    Zadanie setZadanie(Zadanie zadanie);
    void deletZadanie(Integer zadanieId);
    Page<Zadanie> getZadania(Pageable pageable);
    Page<Zadanie> searchByNazwa(String nazwa, Pageable pageable);
    Page<Zadanie> getZadaniaByProjektId(Integer projektId, Pageable pageable);
    Page<Zadanie> getZadaniaByStatus(String statusZadanie, Pageable pageable);
    List<Zadanie> getAllZadania();
    boolean canCreateTask(Integer studentId, Integer projektId);

}
