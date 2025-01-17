package com.project.project_rest_api.datasource;

import com.project.project_rest_api.model.Projekt;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface ProjektRepository extends JpaRepository<Projekt, Integer> {
    Page<Projekt> findByNazwaContainingIgnoreCase(String nazwa, Pageable pageable);
    List<Projekt> findByNazwaContainingIgnoreCase(String nazwa);

    @Query("SELECT COUNT(s) > 0 " +
            "FROM Projekt p JOIN p.studenci s " +
            "WHERE p.projektId = :projektId AND s.studentId = :studentId")
    boolean isStudentAssignedToProject(@Param("projektId") Integer projektId, @Param("studentId") Integer studentId);

    Page<Projekt> findByStudenci_StudentId(Integer studentId, Pageable pageable);

    @Query("SELECT p FROM Projekt p JOIN p.studenci s WHERE s.studentId = :studentId")
    Page<Projekt> findProjektyByStudentId(@Param("studentId") Integer studentId, Pageable pageable);
}
