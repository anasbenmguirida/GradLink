import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { DemandeMentoratService } from '../../services/demandeMentorat/demande-mentorat.service';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { ProfileService } from './../../services/profile/profile.service';

@Component({
  selector: 'app-demande-mentorat',
  standalone: true,
  imports: [RouterLink, CommonModule,NavBarComponent],
  templateUrl: './demande-mentorat.component.html',
  styleUrls: ['./demande-mentorat.component.css']
})
export class DemandeMentoratComponent implements OnInit {

  demandesFiltre: any[] = []; 



constructor(private router: Router, private ProfileService :ProfileService , private location: Location,private demandeService: DemandeMentoratService,@Inject(PLATFORM_ID) private platformId: Object) {}

demandesMentorat: any[] = []; 
me:any;
ngOnInit(): void {

   if (isPlatformBrowser(this.platformId)) {
          console.log('hiiiiii123')

          this.me = JSON.parse(localStorage.getItem('user') || '{}');
          console.log(this.me)
  } else {
          console.log('Code exécuté côté serveur, pas d\'accès à l\'historique.');
        }


  const state = this.location.getState() as { id: number };
  const selectedId = state?.id || null;
  console.log(selectedId);
  console.log("hii");


  this.demandeService.getDemandes(this.me.id).subscribe((data) => {
    this.demandesMentorat = data;
    console.log('hii soso',this.demandesMentorat);
  });


  if (selectedId !== null) {
    const selectedDemande = this.demandesMentorat.find(d => d.demande.id === selectedId);
    console.log(selectedDemande);
  
    if (selectedDemande) {
      this.demandesFiltre = [
        selectedDemande,
        ...this.demandesMentorat.filter(d => d.demande.id !== selectedId)
      ];
    }
  } else {

    this.demandesFiltre = [...this.demandesMentorat];
  }
  
  }

  statusDemande: { [key: number]: string } = {}; // Utilisation d'un objet simple pour stocker l'état

  cancelInvitation(etudiantId: number): void {
    console.log(etudiantId);
    this.ProfileService.cancelInvitation(etudiantId, this.me.id).subscribe({
      next: (response) => {
        console.log('Invitation refusée:', response);
        this.statusDemande[etudiantId] = 'refused'; // Mettre à jour l'affichage
      },
      error: (error) => {
        console.error('Erreur lors du refus de l\'invitation:', error);
      }
    });
  }
  
  acceptInvitation(etudiantId: number): void {
    this.ProfileService.acceptInvitation(etudiantId, this.me.id).subscribe({
      next: (response) => {
        console.log('Invitation acceptée:', response);
        this.statusDemande[etudiantId] = 'accepted'; // Mettre à jour l'affichage
      },
      error: (error) => {
        console.error('Erreur lors de l\'acceptation de l\'invitation:', error);
      }
    });
  }
  



  goToProfile(userId: number) {
    this.router.navigate(['/rechercheProfile', userId]);
  }

  acceptedemande(id: number): void {
    this.demandeService.accepterDemande(id).subscribe(response => {
      console.log('Demande acceptée:', response);
    });
  }

  // Méthode pour refuser la demande
  refusedemande(id: number): void {
    this.demandeService.refuserDemande(id).subscribe(response => {
      console.log('Demande refusée:', response);
    });
  }

}