package com.project.project_rest_api.service;

import com.project.project_rest_api.datasource.ProjektRepository;
import com.project.project_rest_api.datasource.StudentRepository;
import com.project.project_rest_api.datasource.ZadanieRepository;
import com.project.project_rest_api.model.Projekt;
import com.project.project_rest_api.model.ProjektWithTasks;
import com.project.project_rest_api.model.Student;
import com.project.project_rest_api.model.Zadanie;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;


import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjektServiceImpl implements ProjektService {
    private final StudentRepository studentRepository;
    private ProjektRepository projektRepository;
    private ZadanieRepository zadanieRepository;

    @Autowired
    public ProjektServiceImpl(ProjektRepository projektRepository, ZadanieRepository zadanieRepository, StudentRepository studentRepository) {
        this.projektRepository = projektRepository;
        this.zadanieRepository = zadanieRepository;
        this.studentRepository = studentRepository;
    }


    @Override
    public Optional<Projekt> getProjekt(Integer projektId) {
        return projektRepository.findById(projektId);
    }

    @Override
    public Projekt setProjekt(Projekt projekt) {
        projektRepository.save(projekt);
        return projekt;
    }

    @Override
    @Transactional
    public void deleteProjekt(Integer projektId) {
        for (Zadanie zadanie : zadanieRepository.findZadaniaProjektu(projektId)) {
            zadanieRepository.delete(zadanie);
        }
        projektRepository.deleteById(projektId);
    }

    @Override
    public Page<Projekt> getProjekty(Pageable pageable) {
        return projektRepository.findAll(pageable);
    }

    @Override
    public Page<Projekt> searchByNazwa(String nazwa, Pageable pageable) {
        return projektRepository.findByNazwaContainingIgnoreCase(nazwa, pageable);
    }

    @Override
    public Projekt addStudentToProjekt(Integer projektId, Integer studentId) {
        Projekt projekt = projektRepository.findById(projektId).orElseThrow();
        Student student = studentRepository.findById(studentId).orElseThrow();

        projekt.setStudenci(student);
        student.setProjekty(projekt);

        projektRepository.save(projekt);

        return projekt;
    }

    @Override
    public Optional<ProjektWithTasks> getProjektWithTasks(Integer projektId) {
        return projektRepository.findById(projektId)
                .map(projekt -> {
                    List<Zadanie> zadania = zadanieRepository.findZadaniaProjektu(projektId);
                    return new ProjektWithTasks(projekt, zadania);
                });
    }
}
