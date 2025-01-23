package com.project.project_rest_api.model.api;

import com.project.project_rest_api.validators.ValidPassword;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class SignupRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String lastName;

    @ValidPassword
    private String password;

    @Email
    private String email;

    @NotBlank
    private String indeks;
}
