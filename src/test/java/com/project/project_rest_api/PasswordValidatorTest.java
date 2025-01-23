package com.project.project_rest_api;

import com.project.project_rest_api.model.api.LoginRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;


public class PasswordValidatorTest {
    private final Validator validator;

    public PasswordValidatorTest() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        this.validator = factory.getValidator();
    }

    @Test
    public void testValidPassword() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("natzab002@pbs.edu.pl");
        loginRequest.setPassword("Password#2025");

        Set<ConstraintViolation<LoginRequest>> violations = validator.validate(loginRequest);
        assertTrue(violations.isEmpty());
    }

    @Test
    public void testInvalidPassword() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("natzab002@pbs.edu.pl");
        loginRequest.setPassword("123");

        Set<ConstraintViolation<LoginRequest>> violations = validator.validate(loginRequest);
        assertFalse(violations.isEmpty());
    }

}
