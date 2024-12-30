import { Component, EventEmitter, Output, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { EventService } from '../../services/event/event.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-add-event-dialog',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './add-event-dialog.component.html',
  styleUrl: './add-event-dialog.component.css'
})
export class AddEventDialogComponent  {
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<any>();

  eventForm: FormGroup;
  userId?: number;

  constructor(private fb: FormBuilder, private eventService: EventService,
     @Inject(PLATFORM_ID) private platformId: Object,
    ) {
    console.log('AddEventDialogComponent initialisé');

    this.eventForm = this.fb.group({
      designation: ['', [Validators.required]],
      dateEvenement: ['', [Validators.required]],
      //type: ['', [Validators.required]],
      capaciteMaximal: ['', [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
       if (isPlatformBrowser(this.platformId)) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
this.userId=user.id
console.log(this.userId)
       } else {
        console.log('Code exécuté côté serveur, pas d\'accès à l\'historique.');
      }
    
  }
  closeDialog(): void {
    this.onClose.emit(); // Fermeture du dialogue
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      // Récupérer les données du formulaire
      const eventData = this.eventForm.value;
  
      
      if (!this.userId) {
        alert('Erreur : Impossible de récupérer l\'identifiant de l\'administrateur.');
        return;
      }
  console.log(eventData,this.userId)
      // Envoyer les données au backend avec le paramètre adminId
      this.eventService.addEvent(eventData,this.userId).subscribe(
        (response: any) => {
          this.onSave.emit(response); // Émettre l'événement de sauvegarde
          this.closeDialog(); // Fermer le dialogue
          alert('Événement créé avec succès!');
        },
        (error) => {
          console.error('Erreur lors de la création de l\'événement:', error);
          alert('Une erreur est survenue. Veuillez réessayer.');
        }
      );
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      this.eventForm.markAllAsTouched();
    }
  }
  
}
