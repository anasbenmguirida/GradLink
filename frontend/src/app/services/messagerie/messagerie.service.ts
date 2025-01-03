import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class MessagerieService {
  private apiUrl = 'http://localhost:8080/api'; // Remplacez par l'URL de votre backend
  private socket$: WebSocketSubject<any>;

  constructor(private http: HttpClient) {
    this.socket$ = webSocket('ws://localhost:8080/ws'); // Remplacez par l'URL de votre serveur WebSocket
  }

  // Récupérer les messages entre deux utilisateurs
  getMessagesByUser(userId: number, contactId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `http://localhost:8080/discussion?userId=${userId}&contactId=${contactId}`
    );
  }

  // Récupérer les messages d'un utilisateur spécifique
  getUsersMessages(currentUserId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `http://localhost:8080/messages/${currentUserId}`
    );
  }

  
  saveMessage(message: { senderId: number; receiverId: number; content: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/messages`, message);
  }



  // Récupérer tous les utilisateurs sauf les administrateurs
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/except-admins`);
  }



  isSocketOpen(): boolean {
    return this.socket$ && !this.socket$.closed;
  }

  // Envoyer un message via WebSocket
  sendMessage(message: { senderId: number; recipientId: number; content: string }): void {
    try {
      this.socket$.next(message);
      console.log('Message envoyé via WebSocket:', message);
    } catch (error) {
      console.error('Erreur lors de l’envoi du message via WebSocket:', error);
    }
  }

  // Méthode pour recevoir des messages en temps réel
  getMessages(): Observable<any> {
    return this.socket$; // Observable pour recevoir les messages
  }

  // Fermer la connexion WebSocket
  closeConnection(): void {
    this.socket$.complete();
  }
}
