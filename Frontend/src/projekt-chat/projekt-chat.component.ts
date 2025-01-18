import { Component, OnInit } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {FormsModule} from "@angular/forms";
import { CommonModule } from '@angular/common';
import { StorageService } from '../app/Services/storage.service';
@Component({
  selector: 'app-projekt-chat',
  templateUrl: './projekt-chat.component.html',
  styleUrls: ['./projekt-chat.component.css'],
  imports: [
    FormsModule,
    CommonModule
  ],
  standalone: true
})
export class ProjektChatComponent implements OnInit {
  private stompClient: Client | null = null;
  messages: { sender: string; content: string }[] = [];
  messageInput: string = '';
  username: string = '';

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    const user = this.storageService.getUser();
    if (user) {
      this.username = `${user.name} ${user.surname} `;
    } else {
      console.error('Nie udało się pobrać danych użytkownika.');
      this.username = 'Nieznany użytkownik';
    }

    this.connectToWebSocket();
  }

  connectToWebSocket(): void {
    const socket = new SockJS('http://localhost:8080/ws');
    this.stompClient = new Client({
      webSocketFactory: () => socket as any,
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
    });

    this.stompClient.onConnect = () => {
      console.log('Połączono z WebSocket!');
      this.subscribeToChat();
    };

    this.stompClient.onStompError = (frame) => {
      console.error('Błąd STOMP:', frame.headers['message']);
    };

    this.stompClient.onWebSocketClose = () => {
      console.warn('Połączenie WebSocket zostało zamknięte. Próba ponownego połączenia...');
    };

    this.stompClient.activate();
  }

  subscribeToChat(): void {
    if (!this.stompClient) {
      console.error('StompClient nie jest zainicjalizowany.');
      return;
    }

    this.stompClient.subscribe('/topic/messages', (message: Message) => {
      if (message.body) {
        const chatMessage = JSON.parse(message.body);
        this.messages.push(chatMessage);
      }
    });
  }

  sendMessage(): void {
    if (!this.messageInput.trim() || !this.stompClient || !this.stompClient.connected) {
      console.warn('Nie można wysłać pustej wiadomości lub WebSocket jest rozłączony.');
      return;
    }

    const chatMessage = {
      sender: this.username,
      content: this.messageInput,
    };

    this.stompClient.publish({
      destination: '/app/chat',
      body: JSON.stringify(chatMessage),
    });

    this.messageInput = '';
  }
}
