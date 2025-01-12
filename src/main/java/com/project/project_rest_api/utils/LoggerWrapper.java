package com.project.project_rest_api.utils;

public interface LoggerWrapper {
    void info(String message);
    void warn(String message);
    void error(String message);
    void debug(String message);
}
