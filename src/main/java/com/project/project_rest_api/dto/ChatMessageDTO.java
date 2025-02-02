package com.project.project_rest_api.dto;

import java.time.LocalDateTime;
import com.project.project_rest_api.model.Student;

public class ChatMessageDTO {
    private Long messageId;
    private String content;
    private LocalDateTime timestamp;
    private Integer studentId; // Identyfikator studenta przesyłany w żądaniu
    private Student student;   // Pełne dane studenta, do wyświetlenia
    private String role;

    // Konstruktor domyślny
    public ChatMessageDTO() {
    }

    // Gettery i settery
    public Long getMessageId() { return messageId; }
    public void setMessageId(Long messageId) { this.messageId = messageId; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    public Integer getStudentId() { return studentId; }
    public void setStudentId(Integer studentId) { this.studentId = studentId; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }
}
