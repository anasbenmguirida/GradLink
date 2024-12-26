import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DemandeMentoratService } from '../../services/demandeMentorat/demande-mentorat.service';
import { MessagerieService } from '../../services/messagerie/messagerie.service';


export interface Message {
  id: number; // ID du message
  content: string; // Contenu du message
  senderId: number; // ID de l'expéditeur
  receiverId: number; // ID du destinataire
  timestamp?: string; // Facultatif : Horodatage du message
}
@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent {
  query :string=''; 
  invitations:any=[];
  usersMessage :any=[];
  filteredUsers: any[] = []; 
demandesMentorat: any[] = []; 

me:any;
constructor(private demandeService: DemandeMentoratService, private messagerieService:MessagerieService) { }
private router =inject(Router);




    ngOnInit(): void {
      this.me = JSON.parse(localStorage.getItem('user') || '{}');
// /this.me={id:1,image:'profile.png',firstname:"soumaia",lastname:"Kerouan Salah",role:"laureat"};
   


      this.demandeService.getDemandes().subscribe((data) => {
        this.demandesMentorat = data;
      });


      this.loadAllUsers();
    }



    loadAllUsers() {
      this.messagerieService.getAllUsers().subscribe(
        data => {
          this.usersAll = data; 
        },
        error => {
          console.error('Erreur lors du chargement des utilisateurs:', error);
        }
      );
    }

  onSelectDemande(id: number): void {
    console.log(id);
    this.router.navigate(['/demandesMentorat'], { state: { id} });
  }


  isMobileMenuOpen = false;

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  isMessagerie = false;



  

  isNotif = false;

  toggleNotif() {
    this.isNotif = !this.isNotif;
  }
   

  
  isInvit= false;

  toggleInvit() {
    this.isInvit = !this.isInvit;
  }

  acceptedemande(id: number): void {
    this.demandeService.accepterDemande(id).subscribe(response => {
      console.log('Demande acceptée:', response);
    });
  }

  refusedemande(id: number): void {
    this.demandeService.refuserDemande(id).subscribe(response => {
      console.log('Demande refusée:', response);
    });
  }
   

  isMenu = true;
  toggleMenu(){
    this.isMenu=! this.isMenu;
  }

  navigateToProfile(user: any): void {
    if (user.id === this.me.id) {
      
      this.router.navigate(['/myProfile']);
    } else {

      this.router.navigate(['/rechercheProfile', user.id]);
    }
  }

  selectedUser: any = null; 
  selectedMessages:any[] = [];
  newMessage = '';

  onSelectUser(user: any) {
    this.isMessagerie=false;
    this.selectedUser = user;
    this.messagerieService.getMessagesByUser(this.me.id,user.id).subscribe(
      (messages: Message[]) => {
        this.selectedMessages = messages;
        console.log('Messages récupérés:', messages);
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des messages:', error);
      }
    );
  }

  closeChat() {
    this.selectedUser = null;
    this.selectedMessages = [];
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedUser) {
      console.warn('Le message est vide ou aucun utilisateur n’est sélectionné.');
      return;
    }

    const senderId = this.me.id;
    const receiverId = this.selectedUser.id;
    const content = this.newMessage.trim();

    this.messagerieService.sendMessage(senderId, receiverId, content).subscribe(
      response => {
        console.log('Message envoyé avec succès:', response);

        // Ajouter le message localement pour mise à jour instantanée de l'interface
        const message = {
          content,
          isOutgoing: true,
          time: new Date().toLocaleTimeString() // Optionnel : formatage de l'heure
        };
        this.selectedUser.messages.push(message);

        // Réinitialiser le champ de saisie
        this.newMessage = '';
      },
      error => {
        console.error('Erreur lors de l’envoi du message:', error);
      }
    );
  }


  toggleMessagerie() {
    this.isMessagerie = !this.isMessagerie;

    // Charger les messages si la boîte est ouverte et les données sont vides
    if (this.isMessagerie ) {
      this.loadUsersMessages();
    }
  }


    loadUsersMessages() {

    this.messagerieService.getUsersMessages(this.me.id).subscribe(
      data => {
        this.usersMessage = data;
      },
      error => {
        console.error('Erreur lors du chargement des messages:', error);
    
      }
    );
  }


    usersAll: any[] = [
    {id:1, firstname: 'Soumaia ', lastname: 'Kerouan salah', image: 'profile.png',messages:['hi','ana maja'],specialite:'develop' },
    { id:2,firstname: 'safae ', lastname: 'Kerouan salah', image: 'profile.png',messages:['hi','ana maja'] ,specialite:'full stac'},
    {id:3, firstname: 'malak ', lastname: 'Kerouan salah', image: 'groupeIcon.png',messages:['hi','ana maja'] ,filiere:'ginf'},
  ];
 
  search(): void {
    console.log('Valeur de query :', this.query);
  
    const queryLower = this.query.toLowerCase().trim();
  
    console.log('Recherche pour :', queryLower);
  
    this.filteredUsers = this.usersAll.filter((user) =>
      user.firstname.toLowerCase().startsWith(queryLower) || 
    user.lastname.toLowerArCase().startsWith(queryLower)||
      user.specialisation?.toLowerCase().startsWith(queryLower) 
    );
  
    console.log('Utilisateurs filtrés:', this.filteredUsers);
  }
  





//  this.userAuth={id:1,image:'profile.png',firstname:"soumaia",lastname:"Kerouan Salah",role:"laureat"}
   

//  this.usersMessage = [
//   { firstname: 'Soumaia ', lastname: 'Kerouan salah', image:'profile.png',messages: [
//     { content: 'Salut, comment ça va ?', isOutgoing: false, time: '10:00' },
//     { content: 'Ça va bien et toi ?', isOutgoing: true, time: '10:02' }
//   ]},
//   { firstname: 'Soumaia ', lastname: 'Kerouan salah', image:'profile.png',messages: [
//     { content: 'Salut, comment ça va ?', isOutgoing: false, time: '10:00' },
//     { content: 'Ça va bien et toi ?', isOutgoing: true, time: '10:02' },
//     { content: 'Salut, comment ça va ?', isOutgoing: false, time: '10:00' },
//     { content: 'Salut, comment ça va ?', isOutgoing: false, time: '10:00' },
//     { content: 'Ça va bien et toi ?', isOutgoing: true, time: '10:02' },
//     { content: 'Ça va bien et toi ?', isOutgoing: true, time: '10:02' },

//   ] },
//   { firstname: 'Soumaia ', lastname: 'Kerouan salah', image:'profile.png',messages: [
//     { content: 'Salut, comment ça va ?', isOutgoing: false, time: '10:00' },
//     { content: 'Ça va bien et toi ?', isOutgoing: true, time: '10:02' }
//   ]},
//   { firstname: 'Soumaia ', lastname: 'Kerouan salah', image:'profile.png',messages: [
//     { content: 'Salut, comment ça va ?', isOutgoing: false, time: '10:00' },
//     { content: 'Ça va bien et toi ?', isOutgoing: true, time: '10:02' }
//   ]},
//   { firstname: 'Soumaia ', lastname: 'Kerouan salah', image:'profile.png',messages: [
//     { content: 'Salut, comment ça va ?', isOutgoing: false, time: '10:00' },
//     { content: 'Ça va bien et toi ?', isOutgoing: true, time: '10:02' }
//   ]},
// ];

// this.demandesMentor= [
//   { id: 1, image: 'profile.png', content: 'a vous envoyé une demande de mentorat', time: '6j', firstname: 'Aya', lastname: 'Sal' },
//   { id: 2, image: 'profile.png', content: 'a vous envoyé une demande de mentorat', time: '6j', firstname: 'Ali', lastname: 'Khan' },
//   { id: 3, image: 'profile.png', content: 'a vous envoyé une demande de mentorat', time: '6j', firstname: 'Sara', lastname: 'Ahmed' }
// ];
//   }
//   usersAll: any[] = [
//     {id:1, firstname: 'Soumaia ', lastname: 'Kerouan salah', image: 'profile.png',messages:['hi','ana maja'],specialite:'develop' },
//     { id:2,firstname: 'safae ', lastname: 'Kerouan salah', image: 'profile.png',messages:['hi','ana maja'] ,specialite:'full stac'},
//     {id:3, firstname: 'malak ', lastname: 'Kerouan salah', image: 'groupeIcon.png',messages:['hi','ana maja'] ,filiere:'ginf'},
//   ];
 
//   search(): void {
//     console.log('Valeur de query :', this.query);
  
//     const queryLower = this.query.toLowerCase().trim();
  
//     console.log('Recherche pour :', queryLower);
  
//     this.filteredUsers = this.usersAll.filter((user) =>
//       user.firstname.toLowerCase().startsWith(queryLower) || 
//     user.lastname.toLowerArCase().startsWith(queryLower)||
//       user.specialisation?.toLowerCase().startsWith(queryLower) 
//     );
  
//     console.log('Utilisateurs filtrés:', this.filteredUsers);
//   }
  

//   isMobileMenuOpen = false;

//   toggleMobileMenu() {
//     this.isMobileMenuOpen = !this.isMobileMenuOpen;
//   }

//   isMessagerie = false;

//   toggleMessagerie() {
//     this.isMessagerie = !this.isMessagerie;
//   }
  

//   isNotif = false;

//   toggleNotif() {
//     this.isNotif = !this.isNotif;
//   }
   

  
//   isInvit= false;

//   toggleInvit() {
//     this.isInvit = !this.isInvit;
//   }
   
//   private router =inject(Router);






//   isMenu = true;
//   toggleMenu(){
//     this.isMenu=! this.isMenu;
//   }
  
  
//  // selectedUser: any = null;
//   //selectedMessages: any[] = [];


 

//   selectedUser: any = null; 
//   selectedMessages:any[] = [];
//   newMessage = '';

//   onSelectUser(user: any) {
//     this.isMessagerie=false;
//     this.selectedUser = user;
//     this.selectedMessages = user.messages;
//   }

//   closeChat() {
//     this.selectedUser = null;
//     this.selectedMessages = [];
//   }

  

//   sendMessage() {
//     if (this.newMessage.trim()) {
//       this.selectedMessages.push({
//         content: this.newMessage,
//         isOutgoing: true,
//         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//       });
//       this.newMessage = '';
//     }
//   }



//   //demande 

//   onSelectDemande(id: number): void {
//     console.log(id);
//     this.router.navigate(['/demandesMentorat'], { state: { id} });
//   }


//   NavigateToMyprofile(){
//     this.router.navigate(['/myProfile'])
//   } 


//   navigateToProfile(user: any): void {
//     if (user.id === this.userAuth.id) {
      
//       this.router.navigate(['/myProfile']);
//     } else {

//       this.router.navigate(['/rechercheProfile', user.id]);
//     }
//   }

}
