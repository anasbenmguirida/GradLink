import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class MessagerieService {
  private socket$!: WebSocketSubject<any>;
  private messagesSubject = new Subject<any>();
  private apiUrl = 'http://localhost:8080/api';
  private isConnected = false;
  private reconnectTimeout: any;

  constructor(private http: HttpClient) {
    // Vérifie si l'environnement est bien un navigateur avant d'initialiser la connexion WebSocket
    if (typeof window !== 'undefined') {
      this.socket$ = webSocket('ws://localhost:8080/ws');
      this.connect();
    }
  }

  // Connexion WebSocket
  private connect(): void {
    if (!this.isConnected) {
      this.socket$.subscribe(
        (message) => {
          console.log('Message reçu via WebSocket:', message);
          this.messagesSubject.next(message);
        },
        (error) => {
          console.error('Erreur WebSocket:', error);
          this.reconnect();  // Tentative de reconnexion en cas d'erreur
        },
        () => {
          console.warn('Connexion WebSocket fermée');
          this.reconnect();  // Tentative de reconnexion quand la connexion est fermée
        }
      );
      this.isConnected = true;  // Marque la connexion comme ouverte
    }
  }

  // Tentative de reconnexion après un délai
  private reconnect(): void {
    console.log('Tentative de reconnexion WebSocket...');
    clearTimeout(this.reconnectTimeout);  // Annule toute reconnexion précédente
    this.reconnectTimeout = setTimeout(() => this.connect(), 5000);  // Tente de se reconnecter après 5 secondes
  }

  // Récupère les messages d'un utilisateur spécifique
  getMessagesByUser(userId: number, contactId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/discussion?userId=${userId}&contactId=${contactId}`);
  }

  // Récupère les messages d'un utilisateur
  getUsersMessages(currentUserId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/messages/${currentUserId}`);
  }

  // Sauvegarde un message
  saveMessage(message: { senderId: number; recipientId: number; contenue: string }): Observable<any> {
    return this.http.post<any>(`http://localhost:8080/send-message`, message);
  }

  // Récupère tous les utilisateurs
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/except-admins`);
  }

  // Vérifie si la connexion WebSocket est ouverte
  isSocketOpen(): boolean {
    return this.socket$ && !this.socket$.closed;
  }

  // Envoie un message via WebSocket
  sendMessage(message: { senderId: number; recipientId: number; contenue: string }): void {
    try {
      if (this.isSocketOpen()) {
        this.socket$.next(message);  // Envoie le message via WebSocket
        console.log('Message envoyé via WebSocket:', message);
      } else {
        console.error('WebSocket est fermé. Impossible d\'envoyer le message.');
      }
    } catch (error) {
      console.error('Erreur lors de l’envoi du message via WebSocket:', error);
    }
  }

  // Expose l'observable des messages reçus
  getMessages(): Observable<any> {
    return this.messagesSubject.asObservable();
  }

  // Ferme la connexion WebSocket proprement
  closeConnection(): void {
    if (this.socket$ && !this.socket$.closed) {
      this.socket$.complete();  // Termine l'observable
      console.log('Connexion WebSocket fermée');
      this.isConnected = false;  // Marque la connexion comme fermée
    }
  }
}
