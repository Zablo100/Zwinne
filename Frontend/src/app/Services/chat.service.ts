import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {StudentModel} from "../Models/Student";

export interface ChatMessage {
  student: StudentModel;
  content: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private baseUrl = 'http://localhost:8080/api/chat';

  constructor(private http: HttpClient) {}

  getChatHistory(projektId: number): Observable<ChatMessage[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa('admin:admin')  // Dodaj autoryzację
    });
    return this.http.get<ChatMessage[]>(`${this.baseUrl}/${projektId}`, { headers });
  }
}
