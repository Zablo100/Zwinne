import { Component, OnInit, Input } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StorageService } from '../app/Services/storage.service';
import { ChatService, ChatMessage } from '../app/Services/chat.service';

import { HttpClient,HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-projekt-chat',
  templateUrl: './projekt-chat.component.html',
  styleUrls: ['./projekt-chat.component.css'],
  imports: [FormsModule, CommonModule],
  standalone: true,
})
export class ProjektChatComponent implements OnInit {
  @Input() projektId!: number; // ID projektu przekazywane z komponentu nadrzędnego

  private stompClient: Client | null = null;
  messages: ChatMessage[] = [];
  messageInput: string = '';
  username: string = '';
  studentId: number = 0;

  constructor(
    private storageService: StorageService,
    private chatService: ChatService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Pobierz dane użytkownika
    const user = this.storageService.getUser();
    if (user) {
      this.username = `${user.name} ${user.surname}`;
    } else {
      console.error('Nie udało się pobrać danych użytkownika.');
      this.username = 'Nieznany użytkownik';
    }
    // Pobierz studentId osobno
    const storedStudentId = this.storageService.getStudentId();
    if (storedStudentId !== null) {
      this.studentId = storedStudentId;
    } else {
      console.error('Student ID nie został znaleziony w StorageService.');
      this.studentId = 0;
    }

    // Pobierz historię czatu przez REST, używając nagłówka autoryzacji
    this.http.get<ChatMessage[]>(`http://localhost:8080/api/chat/${this.projektId}`, { headers: this.getAuthHeaders() })
      .subscribe(history => {
        console.log("REST - Otrzymana historia czatu:", history);
        this.messages = history;
      }, error => {
        console.error("Błąd podczas pobierania historii czatu:", error);
      });

    // Nawiąż połączenie WebSocket dla nowych wiadomości
    this.connectToWebSocket();
  }

  // Metoda zwracająca nagłówki autoryzacyjne
  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': 'Basic ' + btoa('admin:admin')
    });
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
      // Subskrybuj historię czatu – jednorazowa odpowiedź
      this.subscribeToChatHistory();
      // Subskrybuj nowe wiadomości w czasie rzeczywistym
      this.subscribeToNewMessages();
    };

    this.stompClient.onStompError = (frame) => {
      console.error('Błąd STOMP:', frame.headers['message']);
    };

    this.stompClient.onWebSocketClose = () => {
      console.warn('Połączenie WebSocket zostało zamknięte. Próba ponownego połączenia...');
    };

    this.stompClient.activate();
  }

  subscribeToChatHistory(): void {
    if (!this.stompClient) {
      console.error('StompClient nie jest zainicjalizowany.');
      return;
    }
    console.log("Subskrybuję historię czatu dla projektu:", this.projektId);
    // Subskrypcja do endpointu, który obsługuje @SubscribeMapping w backendzie
    this.stompClient.subscribe(`/chat/${this.projektId}`, (message: Message) => {
      if (message.body) {
        const history: ChatMessage[] = JSON.parse(message.body);
        console.log("Otrzymana historia czatu:", history);
        this.messages = history;
      }
    });
  }

  subscribeToNewMessages(): void {
    if (!this.stompClient) {
      console.error('StompClient nie jest zainicjalizowany.');
      return;
    }
    // Subskrypcja na temat, na który trafiają nowe wiadomości
    this.stompClient.subscribe(`/topic/chat/${this.projektId}`, (message: Message) => {
      if (message.body) {
        const newMsg: ChatMessage = JSON.parse(message.body);
        console.log("Nowa wiadomość:", newMsg);

        this.messages.unshift(newMsg);
      }
    });
  }




  sendMessage(): void {
    if (!this.messageInput.trim() || !this.stompClient || !this.stompClient.connected) {
      console.warn('Nie można wysłać pustej wiadomości lub WebSocket jest rozłączony.');
      return;
    }
    const chatMessagePayload = {
      sender: this.username,
      content: this.messageInput,
      studentId: this.studentId
    };
    this.stompClient.publish({
      destination: `/app/chat/${this.projektId}`,
      body: JSON.stringify(chatMessagePayload),
    });
    this.messageInput = '';
  }




}
