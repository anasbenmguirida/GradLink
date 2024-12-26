import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { DemandeMentoratService } from '../../services/demandeMentorat/demande-mentorat.service';
@Component({
  selector: 'app-demande-mentorat',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './demande-mentorat.component.html',
  styleUrls: ['./demande-mentorat.component.css']
})
export class DemandeMentoratComponent implements OnInit {

  demandesFiltre: any[] = []; 



constructor(private router: Router, private location: Location,private demandeService: DemandeMentoratService) {}

demandesMentorat: any[] = []; 

ngOnInit(): void {
  const state = this.location.getState() as { id: number };
  const selectedId = state?.id || null;
  console.log(selectedId);
  console.log("hii");


        this.demandeService.getDemandes().subscribe((data) => {
           this.demandesMentorat = data;
         });
      

    if (selectedId !== null) {
      const selectedDemande = this.demandesMentorat.find(d => d.id === selectedId);
      console.log(selectedDemande);
      if (selectedDemande) {
        this.demandesFiltre = [
          selectedDemande,
          ...this.demandesMentorat.filter(d => d.id !== selectedId)
        ];
      }
    } else {
      this.demandesFiltre = this.demandesMentorat; 
    }
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