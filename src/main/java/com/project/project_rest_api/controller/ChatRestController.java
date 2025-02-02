package com.project.project_rest_api.controller;

import com.project.project_rest_api.dto.ChatMessageDTO;
import com.project.project_rest_api.model.ChatMessage;
import com.project.project_rest_api.model.Student;
import com.project.project_rest_api.service.ChatService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


@RestController
@RequestMapping("/api/chat")
public class ChatRestController {

    private final ChatService chatService;


    @Autowired
    public ChatRestController(ChatService chatService) {
        this.chatService = chatService;

    }

    @GetMapping("/{projektId}")
    public List<ChatMessageDTO> getChatHistory(@PathVariable Integer projektId) {
        List<ChatMessage> messages = chatService.getChatHistory(projektId);
        return messages.stream().map(message -> {
            ChatMessageDTO dto = new ChatMessageDTO();
            dto.setMessageId(message.getMessageId());
            dto.setContent(message.getContent());
            dto.setTimestamp(message.getTimestamp());
            dto.setStudent(message.getStudent());
            dto.setStudentId(message.getStudent().getStudentId());
            return dto;
        }).collect(Collectors.toList());
    }

}