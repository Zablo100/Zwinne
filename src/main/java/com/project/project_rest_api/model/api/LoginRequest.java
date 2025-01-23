package com.project.project_rest_api.model.api;


import com.project.project_rest_api.validators.ValidPassword;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

@Getter
@Setter
public class LoginRequest {

    @NotBlank(message = "Pole Email nie może być pusty")
    @Email(message = "Niepoprawny format adresu email")
    private String email;

    @ValidPassword
    private String password;
}
