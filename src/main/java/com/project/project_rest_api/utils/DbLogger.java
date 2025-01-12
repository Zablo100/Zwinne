package com.project.project_rest_api.utils;

import com.project.project_rest_api.datasource.LogRepository;
import com.project.project_rest_api.model.Log;
import com.project.project_rest_api.model.LogLevel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DbLogger implements LoggerWrapper{
    private final Logger logger;
    private final LogRepository logRepository;

    public DbLogger(Class<?> logerClass, LogRepository logRepository) {
        this.logger = LoggerFactory.getLogger(logerClass);
        this.logRepository = logRepository;
    }

    @Override
    public void info(String message) {
        logger.info(message);
        addLogToDB(LogLevel.INFO, message);
    }

    @Override
    public void warn(String message) {
        logger.info(message);
        addLogToDB(LogLevel.WARN, message);
    }

    @Override
    public void error(String message) {
        logger.info(message);
        addLogToDB(LogLevel.ERROR, message);
    }

    @Override
    public void debug(String message) {
        logger.info(message);
        addLogToDB(LogLevel.DEBUG, message);
    }

    private void addLogToDB(LogLevel level, String msg){
        Log log = new Log();
        log.setLevel(level.name());
        log.setMessage(msg);
        log.setTimestamp(System.currentTimeMillis());
        logger.info(msg);
        logRepository.save(log);
    }

}
