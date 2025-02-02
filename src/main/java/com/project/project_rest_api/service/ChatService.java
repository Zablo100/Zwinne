package com.project.project_rest_api.service;

import com.project.project_rest_api.datasource.ChatMessageRepository;
import com.project.project_rest_api.datasource.ProjektRepository;
import com.project.project_rest_api.datasource.StudentRepository;
import com.project.project_rest_api.model.ChatMessage;
import com.project.project_rest_api.model.Projekt;
import com.project.project_rest_api.model.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

@Service
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final ProjektRepository projektRepository;
    private final StudentRepository studentRepository;

    @Autowired
    public ChatService(ChatMessageRepository chatMessageRepository,
                       ProjektRepository projektRepository,
                       StudentRepository studentRepository) {
        this.chatMessageRepository = chatMessageRepository;
        this.projektRepository = projektRepository;
        this.studentRepository = studentRepository;
    }

    private String filterContent(String content) {
        // Przykładowa statyczna lista słów zakazanych – możesz ją oczywiście rozbudować lub ładować z konfiguracji
        List<String> bannedWords = Arrays.asList("PBS", "politechnika");
        String filteredContent = content;
        for (String banned : bannedWords) {
            // Dopasowujemy słowo, ignorując wielkość liter
            String regex = "(?i)\\b" + Pattern.quote(banned) + "\\b";
            // Zamieniamy zakazane słowo na ciąg gwiazdek o tej samej długości
            String replacement = "*".repeat(banned.length());
            filteredContent = filteredContent.replaceAll(regex, replacement);
        }
        return filteredContent;
    }


    public ChatMessage saveMessage(ChatMessage message, Integer projektId, Integer studentId) {
        // Pobranie encji projektu
        Projekt projekt = projektRepository.findById(projektId)
                .orElseThrow(() -> new RuntimeException("Projekt not found: " + projektId));
        // Pobranie encji studenta
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found: " + studentId));
        message.setProjekt(projekt);
        message.setStudent(student);
        message.setTimestamp(LocalDateTime.now());
        message.setContent(filterContent(message.getContent()));
        return chatMessageRepository.save(message);
    }

    public List<ChatMessage> getChatHistory(Integer projektId) {
        return chatMessageRepository.findChatHistoryByProjektId(projektId);
    }


}
