import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  // getReservationStatus(eventId: number): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/reservation.json`);
  // }
  // // Méthode pour réserver une place (simulée)
  // reserverEvent(eventId: number): Observable<any> {
  //   return new Observable((observer) => {
  //     setTimeout(() => {
  //       observer.next({ status: 'Réservé' });
  //       observer.complete();
  //     }, 1000); // Simuler un délai pour la réservation
  //   });
  // }
  // // Méthode pour annuler une réservation (simulée)
  // cancelReservation(eventId: number): Observable<any> {
  //   return new Observable((observer) => {
  //     setTimeout(() => {
  //       observer.next({ status: 'Annulé' });
  //       observer.complete();
  //     }, 1000); // Simuler un délai pour l'annulation
  //   });
  // }
  //  // Méthode pour obtenir l'état de la réservation d'un événement
  addEvent(event: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, event);
  }
  private apiUrl = 'jsonTest/events.json';

  constructor(private http: HttpClient) {}

  // Fonction pour récupérer les événements
  getEvents(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }


          //testing
                // reserver(eventId: string) {
                
                // }
                // // Méthode pour récupérer les détails de l'événement
                // getEventDetails(eventId: number){
                //   return this.http.get(`${this.apiUrl}/events.json`);
                // }

                // // Méthode pour vérifier le statut de la réservation
                // getReservationStatus(eventId: number): Observable<any> {
                //   return this.http.get(`${this.apiUrl}/reservation.json`);
                // }

                // // Méthode pour réserver une place (simulée)
                // reserverEvent(eventId: number): Observable<any> {
                //   return new Observable((observer) => {
                //     setTimeout(() => {
                //       observer.next({ status: 'Réservé' });
                //       observer.complete();
                //     }, 1000); // Simuler un délai pour la réservation
                //   });
                // }

                // // Méthode pour annuler une réservation (simulée)
                // cancelReservation(eventId: number): Observable<any> {
                //   return new Observable((observer) => {
                //     setTimeout(() => {
                //       observer.next({ status: 'Annulé' });
                //       observer.complete();
                //     }, 1000); // Simuler un délai pour l'annulation
                //   });
                // }


//  // Méthode pour obtenir l'état de la réservation d'un événement
 getReservationStatus(eventId: number): Observable<any> {
  const token = localStorage.getItem('authToken'); // Récupérer le token JWT
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); 

  return this.http.get(`${this.apiUrl}/${eventId}/reservation-status`, { headers });
}
// Récupérer les détails d'un événement par son ID
getEventDetails(eventId: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/${eventId}`);
}
//Méthode pour réserver un événement
reserverEvent(eventId: number): Observable<any> {
  const token = localStorage.getItem('authToken'); 
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); 
  return this.http.post(`${this.apiUrl}/${eventId}/reserve`, {}, { headers });
}

// Méthode pour annuler une réservation
cancelReservation(eventId: number): Observable<any> {
  const token = localStorage.getItem('authToken'); 
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); 

  return this.http.delete(`${this.apiUrl}/${eventId}/cancel`, { headers });
}

deleteEvent(eventId: number): Observable<any> {
  const token = localStorage.getItem('authToken'); 
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.delete(`${this.apiUrl}/${eventId}`, { headers });
}


updateEvent(eventId: number, updatedEvent: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/${eventId}`, updatedEvent);
}
}
