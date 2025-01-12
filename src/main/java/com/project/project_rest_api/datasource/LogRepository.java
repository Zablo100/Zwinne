package com.project.project_rest_api.datasource;

import com.project.project_rest_api.model.Log;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LogRepository extends JpaRepository<Log, Long> {
}
