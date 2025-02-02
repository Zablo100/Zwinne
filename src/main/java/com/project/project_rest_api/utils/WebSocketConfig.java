package com.project.project_rest_api.utils;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Klienci będą subskrybowali /topic i /queue (dla odpowiedzi bezpośrednich)
        config.enableSimpleBroker("/topic", "/queue");
        // Klienci wysyłają wiadomości do endpointów zaczynających się od /app
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Endpoint, z którego korzysta SockJS
        registry.addEndpoint("/ws").setAllowedOriginPatterns("*").withSockJS();
    }
}