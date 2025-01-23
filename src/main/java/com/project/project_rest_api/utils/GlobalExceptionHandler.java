package com.project.project_rest_api.utils;

import com.project.project_rest_api.datasource.LogRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    private final DbLogger dbLogger;

    public GlobalExceptionHandler(LogRepository logRepository) {
        this.dbLogger = new DbLogger(GlobalExceptionHandler.class, logRepository);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        dbLogger.error(String.format("W aplikacji pojawił się nieobsłużony  wyjątek: %s", e.getMessage()));
        return new ResponseEntity<>("W aplikacje wystąpił problem", HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
