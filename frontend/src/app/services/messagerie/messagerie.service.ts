import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class MessagerieService {
  private apiUrl = 'http://localhost:8080/api';
  private socket$: WebSocketSubject<any> | null = null;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: object) {
    if (isPlatformBrowser(this.platformId)) {
      if (typeof WebSocket !== 'undefined') {
        this.socket$ = webSocket('ws://localhost:8080/ws');
      } else {
        console.error('WebSocket non supporté dans cet environnement.');
      }
    } else {
      console.warn('WebSocket non initialisé, car le code tourne côté serveur.');
    }
  }

  // Vérifier si le WebSocket est ouvert
  isSocketOpen(): boolean {
    return this.socket$ !== null && !this.socket$.closed;
  }

  // Envoyer un message via WebSocket
  sendMessage(message: { senderId: number; recipientId: number; contenue: string }): void {
    if (this.socket$) {
      this.socket$.next(message);
      console.log('Message envoyé via WebSocket :', message);
    } else {
      console.error('Erreur : WebSocket non initialisé.');
    }
  }

  // Recevoir les messages en temps réel
  getMessages(): Observable<any> | null {
    return this.socket$;
  }

  // Fermer la connexion WebSocket
  closeConnection(): void {
    if (this.socket$) {
      this.socket$.complete();
      console.log('WebSocket fermé.');
    }
  }

  // Récupérer les messages entre deux utilisateurs
  getMessagesByUser(userId: number, contactId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/discussion?userId=${userId}&contactId=${contactId}`);
  }

  // Récupérer les messages d'un utilisateur spécifique
  getUsersMessages(currentUserId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/messages/${currentUserId}`);
  }

  // Enregistrer un message
  saveMessage(message: { senderId: number; recipientId: number; contenue: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/send-message`, message);
  }

  // Récupérer tous les utilisateurs sauf les administrateurs
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/except-admins`);
  }
}
