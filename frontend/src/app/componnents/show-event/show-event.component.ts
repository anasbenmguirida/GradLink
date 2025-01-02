import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject, PLATFORM_ID } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
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
  imports: [FullCalendarModule, CommonModule, NavBarComponent, AddEventDialogComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ShowEventComponent {
  events = [];
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    events: [],
    eventClick: this.onEventClick.bind(this),
  };
  isAddEventDialogOpen = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe(
      (data) => {
        this.events = data.map((event: any) => ({
          id: event.id,
          title: event.designation,
          start: event.dateEvenement,
          extendedProps: {
            designation: event.designation,
            capaciteMaximal: event.capaciteMaximal,
            placeRestant: event.placeRestant,

            description: event.description,
          },
        }));
        this.calendarOptions = {
          ...this.calendarOptions,
          events: this.events,
        };
        console.log('Événements chargés :', this.events);
      },
      (error) => {
        console.error('Erreur lors de la récupération des événements :', error);
      }
    );
  }

  onEventClick(info: any): void {
    const event = info.event;

    const serializableEvent = {
      id: event.id,
      designation: event.extendedProps?.designation || 'Nom non spécifié',
      dateEvenement: event.start ? event.start.toISOString().slice(0, 10) : 'Date non spécifiée',
      capaciteMaximal: event.extendedProps?.capaciteMaximal || 'Capacité non spécifiée',
      placeRestant: event.extendedProps?.placeRestant || 'non spécifiée',

      description: event.extendedProps?.description || 'Aucune description',
    };

    console.log('Événement sérialisé :', serializableEvent);
    this.router.navigate(['/eventDetails'], { state: { event: serializableEvent } });
  }

  openDialog(): void {
    this.isAddEventDialogOpen = true;
    console.log(this.isAddEventDialogOpen);
  }

  closeAddEventDialog(): void {
    this.isAddEventDialogOpen = false;
  }

  reloadEvents(newEvent: any): void {
    console.log('Événement ajouté :', newEvent);
    this.loadEvents();
  }
}
