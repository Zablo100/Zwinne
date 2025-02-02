package com.project.project_rest_api.service;

import com.project.project_rest_api.datasource.ProjektRepository;
import com.project.project_rest_api.datasource.ZadanieRepository;
import com.project.project_rest_api.model.Zadanie;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class ZadanieServiceImpl implements ZadanieService {

    private final ZadanieRepository zadanieRepository;
    private final ProjektRepository projektRepository;

    @Autowired
    public ZadanieServiceImpl(ZadanieRepository zadanieRepository, ProjektRepository projektRepository) {
        this.zadanieRepository = zadanieRepository;
        this.projektRepository = projektRepository;
    }

    @Override
    public Optional<Zadanie> getZadanie(Integer zadanieId) {
        return zadanieRepository.findById(zadanieId);
    }

    @Override
    @Transactional
    public Zadanie setZadanie(Zadanie zadanie) {
        System.out.println("Aktualizuję zadanie: " + zadanie.getZadanieId() + " nowy status: " + zadanie.getStatus());
        Zadanie updated = zadanieRepository.save(zadanie);
        System.out.println("Zaktualizowano zadanie: " + updated.getZadanieId() + " status: " + updated.getStatus());
        return updated;
    }

    @Override
    public void deletZadanie(Integer zadanieId) {
        zadanieRepository.deleteById(zadanieId);
    }

    @Override
    public Page<Zadanie> getZadania(Pageable pageable) {
        return zadanieRepository.findAll(pageable);
    }

    @Override
    public Page<Zadanie> searchByNazwa(String nazwa, Pageable pageable) {
        return zadanieRepository.findByNazwaContainingIgnoreCase(nazwa, pageable);
    }

    @Override
    public Page<Zadanie> getZadaniaByProjektId(Integer projektId, Pageable pageable) {
        return zadanieRepository.findZadaniaProjektu(projektId, pageable);
    }
    @Override
    public Page<Zadanie> getZadaniaByStatus(String statusZadanie, Pageable pageable) {
        return zadanieRepository.findByStatus(statusZadanie, pageable);
    }

    @Override
    public List<Zadanie> getAllZadania() {
        return zadanieRepository.findAll();
    }

    @Override
    public boolean canCreateTask(Integer studentId, Integer projektId) {
        return projektRepository.isStudentAssignedToProject(studentId, projektId);
    }


}

