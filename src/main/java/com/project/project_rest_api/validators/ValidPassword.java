package com.project.project_rest_api.validators;


import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = PasswordValidator.class)
@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidPassword {
    String message() default "Hasło musi zawierać co najmniej 8 znaków, jedną dużą literę, jedną małą literę i cyfrę";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
