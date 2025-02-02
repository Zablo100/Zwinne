package com.project.project_rest_api.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;


@Entity
@Table(name="zadanie")
public class Zadanie {
    @Id
    @GeneratedValue
    @Column(name="zadanie_id")
    private Integer zadanieId;
    @Column(nullable=false)
    private String nazwa;
    @Column
    private int kolejnosc;
    @Column(length=100)
    private String opis;
    @Column(name = "status", nullable = false)
    private String status = "backlog";


    @Column(nullable=false, name = "dataczas_oddania")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", shape = JsonFormat.Shape.STRING)
    private LocalDateTime dataCzasOddania;

    @ManyToOne
    @JoinColumn(name="projekt_id")
    @JsonIgnore
    private Projekt projekt;

    public Zadanie() {
    }

    public Zadanie(String opis, String nazwa) {
        this.opis = opis;
        this.nazwa = nazwa;
    }

    public Integer getZadanieId() {
        return zadanieId;
    }

    public void setZadanieId(Integer zadanieId) {
        this.zadanieId = zadanieId;
    }

    public String getNazwa() {
        return nazwa;
    }

    public void setNazwa(String nazwa) {
        this.nazwa = nazwa;
    }

    public int getKolejnosc() {
        return kolejnosc;
    }

    public void setKolejnosc(int kolejnosc) {
        this.kolejnosc = kolejnosc;
    }

    public String getOpis() {
        return opis;
    }

    public void setOpis(String opis) {
        this.opis = opis;
    }

    public LocalDateTime getDataCzasOddania() {
        return dataCzasOddania;
    }

    public void setDataCzasOddania(LocalDateTime dataCzasOddania) {
        this.dataCzasOddania = dataCzasOddania;
    }

    public Projekt getProjekt() {
        return projekt;
    }

    public void setProjekt(Projekt projekt) {
        this.projekt = projekt;
    }
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

}
