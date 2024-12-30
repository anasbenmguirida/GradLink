import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject, PLATFORM_ID } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'; // Vue Week avec horaires
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions } from '@fullcalendar/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { EventService } from '../../services/event/event.service';
import { AddEventDialogComponent } from '../add-event-dialog/add-event-dialog.component';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
  standalone: true,
  selector: 'app-show-event',
  templateUrl: './show-event.component.html',
  styleUrls: ['./show-event.component.css'],
  imports: [FullCalendarModule, CommonModule, NavBarComponent,AddEventDialogComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class ShowEventComponent {

  events = [];
  calendarOptions: CalendarOptions | undefined = undefined;
  isAddEventDialogOpen:boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private eventService: EventService 
  ) {}

  ngOnInit() {
    this.eventService.getEvents().subscribe(
      (data) => {
        console.log('Données des événements:', data);
        // Transformation des événements pour correspondre au format attendu par FullCalendar
        this.events = data.map((event:any) => ({
          title: event.designation,   // Utiliser la désignation comme titre
          date: event.dateEvenement,  // Utiliser la date de l'événement
        }));
    
        console.log('Événements après transformation:', this.events);
    
        this.calendarOptions = {
          initialView: 'dayGridMonth',
          plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
          events: this.events,
          eventClick: this.onEventClick.bind(this),
        };
      },
      (error) => {
        console.error('Erreur lors de la récupération des événements:', error);
      }
    );
    
    
  }

  onEventClick(info: any): void {
    const event = info.event;
    const serializableEvent = {
      id: event.id,
      designation: event.designation,
      dateEvenement: event.dateEvenement.toISOString().slice(0, 10),
      capaciteMaximal: event.extendedProps?.capaciteMaximal,  
      //place_rest: event.extendedProps?.place_restant, 
      description: event.extendedProps?.description || 'Aucune description',
    };
    console.log(serializableEvent)
    this.router.navigate(['/eventDetails'], { state: { event: serializableEvent } });
  }
  
  openDialog(): void {
    this.isAddEventDialogOpen = true;
  console.log(this.isAddEventDialogOpen)
  }

  closeAddEventDialog(): void {
    this.isAddEventDialogOpen = false;
  }

  reloadEvents(newEvent: any): void {
    console.log('Événement ajouté :', newEvent);
    this.eventService.getEvents().subscribe({
      next: (events) => {
        this.events = events; 
        console.log(this.events 
        )
      },
      error: (err) => {
        console.error('Erreur lors du rechargement des événements :', err);
        alert('Une erreur est survenue lors du rechargement des événements.');
      },
    });
    }

 
}
