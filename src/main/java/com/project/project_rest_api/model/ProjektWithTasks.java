package com.project.project_rest_api.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Set;

public class ProjektWithTasks{
    @JsonProperty(access = JsonProperty.Access.READ_WRITE)
    private Integer projektId;
    @JsonProperty(access = JsonProperty.Access.READ_WRITE)
    private String nazwa;
    @JsonProperty(access = JsonProperty.Access.READ_WRITE)
    private String opis;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", shape = JsonFormat.Shape.STRING)
    private LocalDateTime dataczasUtworzenia;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", shape = JsonFormat.Shape.STRING)
    private Date dataOddania;
    @JsonProperty(access = JsonProperty.Access.READ_WRITE)
    private Set<Student> studenci;
    @JsonProperty(access = JsonProperty.Access.READ_WRITE)
    private List<Zadanie> zadania;
    @JsonProperty(access = JsonProperty.Access.READ_WRITE)
    private List<FileProject> files;

    public ProjektWithTasks(Projekt projekt, List<Zadanie> zadania, List<FileProject> files) {
        this.projektId = projekt.getProjektId();
        this.nazwa = projekt.getNazwa();
        this.opis = projekt.getOpis();
        this.zadania = zadania;
        this.dataczasUtworzenia = projekt.getdataczasUtworzenia();
        this.dataOddania = projekt.getDataOddania();
        this.studenci = projekt.getStudenci();
        this.files = files;

    }
}
