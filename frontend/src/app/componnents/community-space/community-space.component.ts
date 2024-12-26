import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommunityService } from '../../services/community/community.service';
import { UserService } from '../../services/authservice/user.service';

@Component({
  selector: 'app-community-space',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './community-space.component.html',
  styleUrls: ['./community-space.component.css']  // Correction ici : styleUrls au pluriel
})
export class CommunitySpaceComponent implements OnInit{
  menuOpen: boolean=false;
  selectedMessage: any = null;
  userId: any;

  toggleMenu(message: any): void {
    if (this.selectedMessage === message) {
      this.menuOpen = !this.menuOpen; // Si le même message est cliqué, alterner l'état du menu
    } else {
      this.selectedMessage = message; // Sélectionner un nouveau message
      this.menuOpen = true; // Ouvrir le menu pour ce message
    }
  }
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const menuElement = document.getElementById('menu');
    const messageElement = document.getElementById('message');
    
    // Vérifiez si le clic n'a pas eu lieu sur le menu ou sur un message
    if (menuElement && !menuElement.contains(event.target as Node) && messageElement && !messageElement.contains(event.target as Node)) {
      
      this.menuOpen = false; // Ferme le menu
    }
  }
canEditOrDeleteMessage(_t27: { user: string; firstName: string; lastName: string; description: string; text: string; photo: string; image: string; }|{ user: string; firstName: string; lastName: string; description: string; text: string; photo: string; image?: undefined; }): any {
throw new Error('Method not implemented.');
}
deleteMessage(arg0: any) {
throw new Error('Method not implemented.');
}
editMessage(_t27: { user: string; firstName: string; lastName: string; description: string; text: string; photo: string; image: string; }|{ user: string; firstName: string; lastName: string; description: string; text: string; photo: string; image?: undefined; }) {
throw new Error('Method not implemented.');
}
  communities = [
    {
      id: 1,
      name: 'Stages',
      description: "C'est votre opportunité pour trouver votre stage de rêve.",
      messages: [
        { 
          id:2,
          user: 'Admin', 
          firstName: 'Safae',
          lastName: 'Labjakh',
          description: 'Responsable des stages',
          text: 'Poste disponible pour un stage en IA.', 
          photo: 'safae.jpeg',
          image: 'networking.png'
        },
        { 
          id:1,
          user: 'Lauréat', 
          firstName: 'Soumaia',
          lastName: 'Benali',
          description: 'Étudiante en développement web',
          text: 'Rejoignez-nous pour un stage en développement web !',
          photo: 'soumaia.jpg',
          image: 'event.webp'
        }
      ]
    },
    {
      id: 2,
      name: 'Carrière',
      description: 'Discussion autour des opportunités de carrière.',
      messages: [
        { 
          id:3,
          user: 'Admin',
          firstName: 'Ali',
          lastName: 'Hassan',
          description: 'Recruteur IT',
          text: 'Nouveau poste de développeur backend ouvert !',
          photo: 'soumaia.jpg',
          image: 'hand.avif'
        },
        { 
          id:4,
          user: 'Lauréat', 
          firstName: 'Fatima',
          lastName: 'Zahra',
          description: 'Développeuse fintech',
          text: 'Une excellente opportunité dans la fintech !',
          photo: 'safae.jpeg',
        }
      ]
    }
  ];
  isAdmin: boolean=false;
  constructor(private communityService: CommunityService,
    @Inject(PLATFORM_ID) private platformId: Object,
        private userService: UserService 
  ) {}

  newMessageText: string = '';
  selectedImage: File | null = null;
  selectedCommunityId: number | null = null;
  communityListVisible: boolean = true;  // Contrôle l'affichage de la liste des communautés (mobile uniquement)

      ngOnInit(){
        if (isPlatformBrowser(this.platformId)) {
          const user = JSON.parse(localStorage.getItem('user') || '{}');

          this.isAdmin = user.role === 'admin'; 
          this.userId=user.id

          
        } else {
          console.log('Code exécuté côté serveur, pas d\'accès à l\'historique.');
        }
      }


  deleteCommunity(communityId: number): void {
    const confirmed = confirm('Êtes-vous sûr de vouloir supprimer cette communauté ?');
    if (confirmed) {
      this.communityService.deleteCommunity(communityId).subscribe(
        () => {
          this.communities = this.communities.filter((community) => community.id !== communityId);
        },
        (error) => {
          console.error('Erreur lors de la suppression de la communauté', error);
        }
      );
    }
  }
  // deleteCommunity(communityId: number) {
  //   const confirmed = confirm("Êtes-vous sûr de vouloir supprimer cette communauté ?");
  //   if (confirmed) {
  //     this.communities = this.communities.filter(c => c.id !== communityId);
  //   }
  // }
  

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }
  }
  postMessage() {
    if (!this.newMessageText.trim()) {
      return; 
    }
  
    const newMessage = {
      id:this.userId,
      user: 'User',  
      firstName: 'User', 
      lastName: 'Name',  
      description: 'User description',
      text: this.newMessageText,
      photo: 'safae.jpeg',
      image: this.selectedImage ? URL.createObjectURL(this.selectedImage) : undefined,
    };
  
    if (this.selectedCommunityId !== null) {
      const community = this.communities.find(c => c.id === this.selectedCommunityId);
      if (community) {
        community.messages.push(newMessage);
      }
    }
  
    this.newMessageText = '';
    this.selectedImage = null;
  }
  
  
  selectCommunity(communityId: number) {
    this.selectedCommunityId = communityId;
  }

  toggleCommunityList() {
    this.communityListVisible = !this.communityListVisible;
  }

  goBackToCommunities() {
    this.selectedCommunityId = null; 
    this.communityListVisible = true;  
  }
}
