package com.project.project_rest_api.controller;

import com.project.project_rest_api.datasource.FilesRepository;
import com.project.project_rest_api.datasource.ProjektRepository;
import com.project.project_rest_api.model.FileProject;
import com.project.project_rest_api.model.Projekt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/file")
@CrossOrigin
public class FileController {

    private final FilesRepository filesRepository;
    private final ProjektRepository projektRepository;

    @Autowired
    public FileController(FilesRepository filesRepository, ProjektRepository projektRepository) {
        this.filesRepository = filesRepository;
        this.projektRepository = projektRepository;
    }

    private final String UPLOAD_DIR = "uploads/"; // Ścieżka do katalogu z plikami na serwerze

    @GetMapping("/api/files/{fileName}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
        try {
            System.out.println(fileName);
            // Tworzenie pełnej ścieżki do pliku
            Path filePath = Paths.get(UPLOAD_DIR).resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                System.out.println("Pobieram plik: " + filePath);
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                System.out.println("Plik nie znaleziony: " + filePath);
                return ResponseEntity.notFound().build();
            }

        } catch (Exception e) {
            System.err.println("Błąd podczas pobierania pliku: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/addFile")
    public ResponseEntity<FileProject> saveFile(@RequestParam Integer projektId, @RequestParam MultipartFile file) throws IOException {
        // Znajdź projekt
        Projekt projekt = projektRepository.findById(projektId)
                .orElseThrow(() -> new RuntimeException("Projekt o podanym ID nie istnieje"));

        // Upewnij się, że katalog istnieje
        Path root = Paths.get(UPLOAD_DIR);
        if (!Files.exists(root)) {
            Files.createDirectories(root);
        }

        // Pobierz nazwę pliku
        String fileName = file.getOriginalFilename();
        if (fileName == null || fileName.isEmpty()) {
            throw new RuntimeException("Nazwa pliku jest pusta");
        }

        // Utwórz pełną ścieżkę do zapisu pliku
        Path filePath = root.resolve(fileName).normalize();
        Files.copy(file.getInputStream(), filePath);

        // Zapisz tylko nazwę pliku w bazie danych
        FileProject fileEntity = new FileProject();
        fileEntity.setSciezka(fileName); // Tylko nazwa pliku, bez pełnej ścieżki
        fileEntity.setProjekt(projekt);

        FileProject savedFile = filesRepository.save(fileEntity);
        projekt.getPliki().add(savedFile);
        projektRepository.save(projekt);

        return ResponseEntity.ok(savedFile);
    }
}
