package com.project.project_rest_api.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;
import jakarta.validation.constraints.NotBlank;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "projekt",
        indexes = {
                @Index(name = "idx_nazwa", columnList = "nazwa", unique = false)}
)
public class Projekt {
    @Id
    @GeneratedValue
    @Column(name="projekt_id") //tylko jeżeli nazwa kolumny w bazie danych ma być inna od nazwy zmiennej
    private Integer projektId;

    @NotBlank(message = "Pole nazwa nie może być puste!")
    @Size(min = 3, max = 50, message = "Nazwa musi zawierać od {min} do {max} znaków")
    @Column(nullable = false, length = 50)
    private String nazwa;


    @Column(length = 1000)
    private String opis;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", shape = JsonFormat.Shape.STRING)
    @Column(name="dataczas_utworzenia", nullable = false)
    @CreationTimestamp
    private LocalDateTime dataczasUtworzenia;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", shape = JsonFormat.Shape.STRING)
    @Column(name="data_oddania")
    private Date dataOddania;

    @OneToMany(mappedBy = "projekt")
    //@JsonIgnoreProperties({"projekt"})
    private List<Zadanie> zadania;


    @ManyToMany
    @JoinTable(name = "projekt_student",
            joinColumns = {@JoinColumn(name="projekt_id")},
            inverseJoinColumns = {@JoinColumn(name="student_id")})
    private Set<Student> studenci;

    public Integer getProjektId() {
        return projektId;
    }

    public void setProjektId(Integer projektId) {
        this.projektId = projektId;
    }

    public String getNazwa() {
        return nazwa;
    }

    public void setNazwa(String nazwa) {
        this.nazwa = nazwa;
    }

    public LocalDateTime getdataczasUtworzenia() {
        return dataczasUtworzenia;
    }

    public void setdataczasUtworzenia(LocalDateTime dataczas_utworzenia) {
        this.dataczasUtworzenia = dataczas_utworzenia;
    }

    public String getOpis() {
        return opis;
    }

    public void setOpis(String opis) {
        this.opis = opis;
    }

    public Date getDataOddania() {
        return dataOddania;
    }

    public void setDataOddania(Date data_oddania) {
        this.dataOddania = data_oddania;
    }

    public void setStudenci(Student student){
        this.studenci.add(student);
    }

    public Set<Student> getStudenci(){
        return studenci;
    }

    public Projekt() {

    }

    public Projekt(String nazwa, String opis) {
        this.nazwa = nazwa;
        this.opis = opis;
    }


}