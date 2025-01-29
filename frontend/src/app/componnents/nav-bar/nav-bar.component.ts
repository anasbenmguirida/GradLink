import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DemandeMentoratService } from '../../services/demandeMentorat/demande-mentorat.service';
import { MessagerieService } from '../../services/messagerie/messagerie.service';
import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';




@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})

@Injectable ({
  providedIn:'root',
})
export class NavBarComponent {
  query :string=''; 
  invitations:any=[];
  usersMessage :any=[];
  filteredUsers: any[] = []; 
demandesMentorat: any[] = []; 
isFocused: boolean = false;

me:any;
constructor(private demandeService: DemandeMentoratService, private messagerieService:MessagerieService
  ,@Inject(PLATFORM_ID) private platformId: Object
) { }
private router =inject(Router);




    ngOnInit(): void {
 if (isPlatformBrowser(this.platformId)) {
           console.log('hiiiiii123')
 
           this.me = JSON.parse(localStorage.getItem('user') || '{}');
           console.log(this.me)
   } else {
           console.log('Code exécuté côté serveur, pas d\'accès à l\'historique.');
         }
 
// /this.me={id:1,image:'profile.png',firstname:"soumaia",lastname:"Kerouan Salah",role:"laureat"};
   
this.messagerieService.getMessages().subscribe((message) => {
  this.selectedMessages.push(message); // Ajouter le message reçu à la liste
});


this.demandeService.getDemandes(this.me.id).subscribe((data) => {
  this.demandesMentorat = data;
});

      this.loadAllUsers();
    }



    loadAllUsers() {
      this.messagerieService.getAllUsers().subscribe(
        data => {
          this.usersAll = data; 
          console.log("userAll",this.usersAll)
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
   

  isMenu = false;
  toggleMenu(){
    this.isMenu=! this.isMenu;
  }

  navigateToProfile(user: any): void {
    console.log("userID",user.id)
    console.log("meID",this.me.id)
    if (user.id === this.me.id) {
      console.log(user.id)
      console.log(this.me.id)
      this.router.navigate(['/myProfile']);
    } else {
      this.router.navigate([`/rechercheProfile/${user.id}`]);
    }
  }

  selectedUser: any = null; 
  selectedMessages:any[] = [];
  newMessage = '';

  onSelectUser(user: any) {
    this.isMessagerie = false;
    this.selectedUser = user;
    console.log("ba9i maconsoma");
  
    // Récupérer les messages existants entre l'utilisateur actuel et l'utilisateur sélectionné
    this.messagerieService.getMessagesByUser(this.me.id, user.id).subscribe(
      (messages: any[]) => {
        console.log("wsal n onSelectUser");
        this.selectedMessages = messages;
        console.log('Messages récupérés:', messages);
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des messages:', error);
      }
    );
  
    // Écouter les nouveaux messages via WebSocket
    this.messagerieService.getMessages().subscribe(
      (newMessage: any) => {
        // Si le message est destiné à l'utilisateur sélectionné, l'ajouter à la liste des messages
        if (newMessage.senderId === user.id || newMessage. recipientId === user.id) {
          this.selectedMessages.push(newMessage);
          console.log('Nouveau message reçu:', newMessage);
        }
      },
      (error: any) => {
        console.error('Erreur lors de la réception des messages:', error);
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
  
    const message = {
      senderId: this.me.id,
      recipientId: this.selectedUser.id,
      contenue: this.newMessage.trim(),
    };
  
    try {
      // Vérifier si le WebSocket est encore ouvert
      if (!this.messagerieService.isSocketOpen()) {
        console.error('La connexion WebSocket est fermée.');
        return;
      }
  
      // Envoyer le message via WebSocket
      this.messagerieService.sendMessage(message);
  
      console.log('Message envoyé via WebSocket:', message);
  
      // Enregistrer le message dans la base de données
      // this.messagerieService.saveMessage(message).subscribe(
      //   (response) => {
      //     console.log('Message enregistré dans la base de données:', response);
      //   },
      //   (error) => {
      //     console.error('Erreur lors de l\'enregistrement du message dans la base de données:', error);
      //   }
      // );
  
      // Ajouter le message localement pour mise à jour instantanée de l'interface
      const outgoingMessage = {
        senderId: message.senderId,
        recipientId: message.recipientId,
        contenue: message.contenue,
        time: new Date().toLocaleTimeString(),
      };
  
      // Ajouter le message envoyé à la liste des messages de la conversation
      this.selectedMessages.push(outgoingMessage);
  
      // Réinitialiser le champ de saisie
      this.newMessage = '';
    } catch (error) {
      console.error('Erreur lors de l’envoi du message via WebSocket:', error);
    }
  }
  

  toggleMessagerie() {
    this.isMessagerie = !this.isMessagerie;

    // Charger les messages si la boîte est ouverte et les données sont vides
    if (this.isMessagerie ) {
      console.log("wsal n toggle msj")
      this.loadUsersMessages();
    }
  }


    loadUsersMessages() {

    this.messagerieService.getUsersMessages(this.me.id).subscribe(
      data => {
        this.usersMessage = data;
        console.log("listeUserMessage",this.usersMessage)
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
 
  onSearch(): void {
    console.log('Valeur de query :', this.query);
  
    const queryLower = this.query.toLowerCase().trim();
  
    console.log('Recherche pour :', queryLower);
  
    this.filteredUsers = this.usersAll.filter((user) =>
      user.firstName.toLowerCase().startsWith(queryLower) ||
      user.lastName.toLowerCase().startsWith(queryLower) || // Correction ici
      user.specialite?.toLowerCase().startsWith(queryLower)
    );
  
    console.log('Utilisateurs filtrés:', this.filteredUsers);
  }
  
  getFileUrl(file: any): string {
    // Si fileType est incorrect, déduire le type à partir de l'extension
    const mimeType = this.getMimeType(file.fileName);
  
    return `data:${mimeType};base64,${file.data}`;
  }
  
  getMimeType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
        case 'jfif':
          return 'image/jfif';
          case 'jpe':
            return 'image/jpe';
      case 'pdf':
        return 'application/pdf';
      default:
        return 'application/octet-stream';
    }
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
