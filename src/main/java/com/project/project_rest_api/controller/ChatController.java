package com.project.project_rest_api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.project_rest_api.model.ChatMessage;
import com.project.project_rest_api.dto.ChatMessageDTO;
import com.project.project_rest_api.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;

import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Controller
public class ChatController {

    private final ChatService chatService;
    private final ObjectMapper objectMapper;

    @Autowired
    public ChatController(ChatService chatService, ObjectMapper objectMapper) {
        this.chatService = chatService;
        this.objectMapper = objectMapper;
    }

    // Metoda obsługująca wysyłanie nowych wiadomości
    @MessageMapping("/chat/{projektId}")
    @SendTo("/topic/chat/{projektId}")
    public ChatMessageDTO sendMessage(@DestinationVariable Integer projektId, String payload) throws Exception {
        // Konwersja odebranego JSON do DTO
        ChatMessageDTO chatDTO = objectMapper.readValue(payload, ChatMessageDTO.class);

        // Utwórz encję ChatMessage, ustaw treść oraz znacznik czasu
        ChatMessage message = new ChatMessage();
        message.setContent(chatDTO.getContent());
        message.setTimestamp(LocalDateTime.now());

        // Zapisz wiadomość w bazie – metoda saveMessage powinna ustawiać powiązania (projekt i student)
        ChatMessage savedMessage = chatService.saveMessage(message, projektId, chatDTO.getStudentId());

        // Konwersja zapisanego obiektu do DTO
        ChatMessageDTO responseDTO = new ChatMessageDTO();
        responseDTO.setMessageId(savedMessage.getMessageId());
        responseDTO.setContent(savedMessage.getContent());
        responseDTO.setTimestamp(savedMessage.getTimestamp());
        responseDTO.setStudent(savedMessage.getStudent());
        responseDTO.setStudentId(savedMessage.getStudent().getStudentId());
        return responseDTO;
    }

    // Metoda wysyłająca całą historię czatu przy subskrypcji
    @SubscribeMapping("/chat/{projektId}")
    public List<ChatMessageDTO> sendChatHistory(@DestinationVariable Integer projektId) {
        System.out.println("Wysyłam historię czatu dla projektu: " + projektId);
        List<ChatMessage> messages = chatService.getChatHistory(projektId);
        System.out.println("Liczba pobranych wiadomości: " + messages.size());
        return messages.stream()
                .map(message -> {
                    ChatMessageDTO dto = new ChatMessageDTO();
                    dto.setMessageId(message.getMessageId());
                    dto.setContent(message.getContent());
                    dto.setTimestamp(message.getTimestamp());
                    dto.setStudent(message.getStudent());
                    dto.setRole(message.getStudent().getRole());
                    dto.setStudentId(message.getStudent().getStudentId());
                    return dto;
                })
                .collect(Collectors.toList());
    }

}
