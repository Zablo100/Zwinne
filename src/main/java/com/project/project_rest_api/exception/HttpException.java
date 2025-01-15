package com.project.project_rest_api.exception;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;

public class HttpException extends RuntimeException {
    public static final long serialVersionUID = 1L;

    public HttpException(HttpStatusCode httpStatusCode, HttpHeaders httpHeaders) {
        super(String.format("Error: statusCode -%s, headers - %s", httpStatusCode, httpHeaders));
    }

    public HttpException(String errorMessage) {
        super(errorMessage);
    }

    public HttpException(String errorMessage, Throwable cause) {
        super(errorMessage, cause);
    }
}
