import { CommonModule } from '@angular/common';
import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { UserService } from '../../services/authservice/user.service';
import { EventService } from '../../services/event/event.service';
import { EditEventDialogComponent } from '../edit-event-dialog/edit-event-dialog.component';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule,EditEventDialogComponent,NavBarComponent],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css'
})
export class EventDetailsComponent implements OnInit {
  event: any;
  isAdmin: boolean = false; 
  menuOpen: boolean = false; // État du menu contextuel
  isReserved: boolean=false;
  user: any;

  constructor(
    private router: Router,

    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
    private userService: UserService ,
    private eventService: EventService
  ) {}

  eventId: number | null = null;  
  isLoading: boolean = false; 


  isLiked = false;

  toggleLike() {
    this.isLiked = !this.isLiked;
  }


  

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const navigation = history.state;
      this.event = navigation ? navigation.event : null;
  
      console.log("voir:", this.event);
      const userRole = this.userService.getUserRole();
      this.isAdmin = userRole === 'ADMIN';
      console.log(userRole);
  
      if (this.event) {
        this.eventId = this.event.id;
        console.log('ID de l\'événement récupéré depuis l\'URL :', this.eventId);
      }
    } else {
      console.log('Code exécuté côté serveur, pas d\'accès à l\'historique.');
    }
    this.checkReservationStatus();

    //this.loadEventDetails();
  }
  


  loadEventDetails() {
    this.eventService.getEventDetails(this.eventId!).subscribe((event) => {
      this.event = event;
      this.checkReservationStatus();
    });
  }



  checkReservationStatus(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
console.log('ha anaaaaaaaaaaa',this.event.id)
      this.eventService.getReservationStatus(this.event.id, this.user.id).subscribe(
        (response) => {
          this.isReserved = response; 
        },
        (error) => {
          console.error('Erreur lors de la vérification de la réservation', error);
        }
      );
    
  }


  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    console.log('Menu ouvert :', this.menuOpen);
  }


  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const isMenuButton = target.closest('.menu-button'); // Vérifie si le clic est sur le bouton du menu
    const isMenu = target.closest('.menu-dropdown'); // Vérifie si le clic est dans le menu

    if (!isMenuButton && !isMenu) {
      this.menuOpen = false; 
    }
  }



  deleteEvent(): void { 
    if (!this.eventId) {
      alert('Impossible de supprimer : l\'ID de l\'événement est invalide.');
      return;
    }
  
    const confirmation = confirm(`Êtes-vous sûr de vouloir supprimer l'événement avec l'ID : ${this.eventId} ?`);
    if (confirmation) {
      this.eventService.deleteEvent(this.eventId).subscribe(
        (response) => {
          this.router.navigate(['/Events']).then(() => {
            location.reload();
          });        },
        (error) => {
          console.error('Erreur lors de la suppression', error);
          alert('Une erreur est survenue lors de la suppression de l\'événement.');
        }
      );
    }
  }
  
  


  // editEvent() {
  //   const dialogRef = this.dialog.open(EditEventDialogComponent, {
  //     width: '400px',
  //     data: this.event, // Passez l'événement actuel comme données
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       // Mettez à jour les données si l'utilisateur a modifié
  //       this.event = result;
  //       console.log('Événement mis à jour :', result);

  //       // Faites appel au backend pour sauvegarder les modifications
  //       // Exemple :
  //       // this.eventService.updateEvent(this.eventId, result).subscribe(() => {
  //       //   alert('Événement modifié avec succès.');
  //       // });
  //     }
  //   });
  // }
  

              //testing
              // reserver(): void {
              //   this.isLoading = true; // Active le chargement

              //   this.eventService.reserver(this.eventId).subscribe(
              //     (response) => {
              //       this.isReserved=true;
              //       this.isLoading = false; // Désactive le chargement
              //       alert('Votre réservation a été prise en compte !');
              //       console.log(response)
              //     },
              //     (error) => {
              //       this.isLoading = false; // Désactive le chargement
              //       console.error('Erreur lors de la réservation', error);

              //       alert('Une erreur est survenue. Veuillez réessayer.');
              //     }
              //   );
              // }




  reserver() {
  this.eventService.reserverEvent(this.eventId!).subscribe(
  (response) => {
    this.isReserved = true; // Mettre à jour l'état de la réservation
  },
  (error) => {
    alert('Une erreur est survenue, veuillez réessayer.');
  }
  );
  }

  cancelReservation() {
  this.eventService.cancelReservation(this.eventId!).subscribe(
  (response) => {
    this.isReserved = false;
  },
  (error) => {
    alert('Une erreur est survenue, veuillez réessayer.');
  }
  );
  }

  goBack(): void {
    history.back(); 
  }
  
  isEditDialogOpen = false;
  openEditDialog() {
    this.isEditDialogOpen = true;
  }

  closeEditDialog() {
    this.isEditDialogOpen = false;
  }

  handleEditSave(updatedEvent: any): void {
    if (this.eventId) {
      this.eventService.updateEvent(this.eventId, updatedEvent).subscribe(
        (response) => {
          console.log('Événement mis à jour :', response);
          this.event = { ...this.event, ...updatedEvent }; 
          this.closeEditDialog(); 
        },
        (error) => {
          console.error('Erreur lors de la mise à jour de l\'événement', error);
          alert('Une erreur est survenue lors de la mise à jour.');
        }
      );
    }
  }
  }

