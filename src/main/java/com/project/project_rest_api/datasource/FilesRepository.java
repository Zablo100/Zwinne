package com.project.project_rest_api.datasource;

import com.project.project_rest_api.model.FileProject;
import com.project.project_rest_api.model.Zadanie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FilesRepository extends JpaRepository<FileProject, Integer> {

    @Query("SELECT z FROM FileProject z WHERE z.projekt.projektId = :projektId")
    List<FileProject> findPlikiProjektu(@Param("projektId") Integer projektId);


}
