import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { EventService } from '../../services/event/event.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';


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

  constructor(private fb: FormBuilder, private eventService: EventService) {
    console.log('AddEventDialogComponent initialisé');

    this.eventForm = this.fb.group({
      name: ['', [Validators.required]],
      date: ['', [Validators.required]],
      type: ['', [Validators.required]],
      capacity: ['', [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required]]
    });
  }

  closeDialog(): void {
    this.onClose.emit(); // Fermeture du dialogue
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      const eventData = this.eventForm.value;
      this.eventService.addEvent(eventData).subscribe(
        (response:any) => {
          this.onSave.emit(response);
          this.closeDialog();
          alert('Événement créé avec succès!');
        },
        (error) => {
          console.error('Erreur lors de la création de l\'événement:', error);
          alert('Une erreur est survenue. Veuillez réessayer.');
        }
      );
    }
  }
}
