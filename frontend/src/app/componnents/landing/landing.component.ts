import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule,ScrollRevealDirective,RouterLink],
    templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  isMenuVisible: boolean = false;


  // Méthode pour basculer la visibilité du menu
  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }

 
  
  

  stat1: number = 1000;
  stat2: number = 1000;
  stat3: number = 1000;



  ngOnInit(): void {
    // Lancer l'animation pour chaque statistique
    this.animateStat('stat1', 1200, 500); // 1200 utilisateurs en 2 secondes
    this.animateStat('stat2', 98, 500);   // 98% en 2 secondes
    this.animateStat('stat3', 450, 500);  // 450 projets en 2 secondes

  }

  animateStat(stat: 'stat1' | 'stat2' | 'stat3', target: number, duration: number): void {
    let start = 0;
    let step = target / duration;
    let interval = setInterval(() => {
      start += step;

      if (start >= target) {
        this[stat ] = target; 
        clearInterval(interval);
      } else {
        this[stat] = Math.floor(start); // Met à jour la valeur de la statistique
      }
    }, 1);
  }



// team members
  teamMembers = [
    { id: 0, name: 'Safae LABJAKH', role: ' Frontend Developer', image: 'safae.jpeg' },
    { id: 1, name: 'Soumaia KEROUAN SALAH', role: ' Frontend Developer', image: 'soumaia.jpg' },
    { id: 2, name: 'Malika Tajidi', role: 'Backend Developer', image: 'malika.jpg' },
    { id: 3, name: 'Anas BENMGUIRIDA', role: 'Backend Developer', image: 'anas.png' },

  ];

  activeMemberId: number | null = null;

  selectMember(id: number) {
    this.activeMemberId = id;
  }

}
