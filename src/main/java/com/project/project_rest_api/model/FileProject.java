package com.project.project_rest_api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "pliki",
        indexes = {
                @Index(name = "idx_sciezka", columnList = "sciezka", unique = false)}
)
public class FileProject {
    @Id
    @GeneratedValue
    @Column(name = "file_id") //tylko jeżeli nazwa kolumny w bazie danych ma być inna od nazwy zmiennej
    private Integer fileId;

    @NotBlank(message = "Pole ścieżka nie może być puste!")
    @Size(min = 3, max = 50, message = "Ścieżka musi zawierać od {min} do {max} znaków")
    @Column(nullable = false, length = 50)
    private String sciezka;

    @ManyToOne
    @JoinColumn(name = "projekt_id", nullable = false)
    private Projekt projekt;

    // Gettery i settery
    public Integer getFileId() {
        return fileId;
    }

    public void setFileId(Integer fileId) {
        this.fileId = fileId;
    }

    public String getSciezka() {
        return sciezka;
    }

    public void setSciezka(String sciezka) {
        this.sciezka = sciezka;
    }

    public Projekt getProjekt() {
        return projekt;
    }

    public void setProjekt(Projekt projekt) {
        this.projekt = projekt;
    }

    // Konstruktor bezargumentowy
    public FileProject() {
    }

    // Konstruktor z argumentami
    public FileProject(String sciezka, Projekt projekt) {
        this.sciezka = sciezka;
        this.projekt = projekt;
    }
}
