import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DemandeMentoratService } from '../../services/demandeMentorat/demande-mentorat.service';
import { MessagerieService } from '../../services/messagerie/messagerie.service';
import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { ProfileService } from './../../services/profile/profile.service';
import { Subscription } from 'rxjs';




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
export class NavBarComponent implements OnInit , OnDestroy,AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  query :string=''; 
  invitations:any=[];
  usersMessage :any=[];
  filteredUsers: any[] = []; 
demandesMentorat: any[] = []; 
isFocused: boolean = false;
private refreshInterval: any;
me:any;
constructor(private demandeService: DemandeMentoratService,private ProfileService :ProfileService,   private messagerieService:MessagerieService,private cdr: ChangeDetectorRef
  ,@Inject(PLATFORM_ID) private platformId: Object
) { }
private router =inject(Router);




    ngOnInit(): void {

 

 if (isPlatformBrowser(this.platformId)) {
           console.log('hiiiiii123')
 
           this.me = JSON.parse(localStorage.getItem('user') || '{}');
           console.log("aaaaaaaaa")

           console.log(this.me)
   } else {
           console.log('Code exécuté côté serveur, pas d\'accès à l\'historique.');
         }


 
// /this.me={id:1,image:'profile.png',firstname:"soumaia",lastname:"Kerouan Salah",role:"laureat"};
   
this.setupWebSocketListener();  // Vérifiez que cette fonction est bien appelée
console.log("setupWebSocketListener appelé");

//this.startRefreshingMessages();
this.demandeService.getDemandes(this.me.id).subscribe((data) => {
  this.demandesMentorat = data;
});
      this.loadAllUsers();
 }



//  startRefreshingMessages(): void {
//   // Rafraîchissement des messages toutes les 30 secondes
//   this.refreshInterval = setInterval(() => {
//     this.refreshMessages();
//   }, 30000); // Rafraîchissement toutes les 30 secondes

//   // En plus, on écoute en temps réel via WebSocket
//   this.listenForNewMessages();
// }

// // Rafraîchit les messages à partir du service Messagerie
// refreshMessages(): void {
//   if (this.selectedUser) {
//     this.messagerieService.getMessagesByUser(this.selectedUser.id, this.selectedUser.id)
//       .subscribe(messages => {
//         this.selectedMessages = messages;
//       });
//   }
// }


listenForNewMessages(): void {
  this.messagerieService.getMessages().subscribe((newMessage: any) => {
    console.log("Message reçu via WebSocket:", newMessage);
    // Si le message appartient à l'utilisateur sélectionné, on l'ajoute
    if (
      this.selectedUser &&
      (newMessage.senderId === this.selectedUser.id || newMessage.recipientId === this.selectedUser.id)
    ) {
      this.selectedMessages.push(newMessage);
    }
  });
}
 messageSubscription: Subscription | null = null;

 setupWebSocketListener() {
  console.log("WebSocket ouvert:", this.messagerieService.isSocketOpen());
  this.messageSubscription = this.messagerieService.getMessages().subscribe(
    (newMessage: any) => {
      console.log("Message reçu via WebSocket:", newMessage);
      if (
        this.selectedUser &&
        (newMessage.senderId === this.selectedUser.id || newMessage.recipientId === this.selectedUser.id)
      ) {
        this.selectedMessages.push(newMessage);
        this.cdr.detectChanges(); // Mettre à jour la vue
        this.scrollToBottom(); // Faire défiler vers le bas après avoir ajouté le message
      }
    },
    (error: any) => {
      console.error("Erreur lors de la réception des messages:", error);
    }
  );
}




 ngOnDestroy() {
  // Se désabonner lors de la destruction du composant
  if (this.messageSubscription) {
    this.messageSubscription.unsubscribe();
  }
  this.messagerieService.closeConnection();  // Fermer la connexion WebSocket
} 
    selectedUser: any = null; 
    selectedMessages:any[] = [];
    newMessage = '';
  
    onSelectUser(user: any) {
      this.isMessagerie = false;
      this.selectedUser = user;
      this.selectedMessages = []; // Nettoyer les anciens messages
    
      console.log("Chargement des messages...");
     
      // Récupérer l'historique des messages
      this.messagerieService.getMessagesByUser(this.me.id, user.id).subscribe(
        (messages: any[]) => {
          this.selectedMessages = messages;
          console.log("Messages récupérés:", messages);
        },
        (error: any) => {
          console.error("Erreur lors de la récupération des messages:", error);
        }
      );
    }
    
  
    closeChat() {
      this.selectedUser = null;
      this.selectedMessages = [];
    }
  
    ngAfterViewChecked() {
      // Faire défiler vers le bas après chaque mise à jour de la vue
      this.scrollToBottom();
    }
  
    private scrollToBottom(): void {
      try {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      } catch (err) {
        console.error("Erreur lors du défilement", err);
      }
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
        this.scrollToBottom();
      } catch (error) {
        console.error('Erreur lors de l’envoi du message via WebSocket:', error);
      }
    }
    
  

    
    ngOnChanges() {
      this.scrollToBottom();
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
    console.log('id demande choisi',id);
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
    if (this.isInvit ) {
      console.log("wsal n toggle demandes")
      this.loadUsersDemandes();
    }
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

  
  // cancelInvitation(etudiantId:any) {
    
  //   this.ProfileService
  //     .cancelInvitation( etudiantId,this.me.id)
  //     .subscribe(
  //       (response) => {
  //  console.log(response);
        
  //       },
  //       (error) => {
  //         console.error('Erreur lors de l\'annulation de l\'invitation:', error);
  //       }
  //     );
  // }

  // show: boolean = false;
  // acceptInvitation(etudiantId:any) {
  //   this.ProfileService
  //     .acceptInvitation(etudiantId,this.me.id)
  //     .subscribe(
  //       (response) => {
  //         console.log(response);
  //         this.show=false;
      
  //       },
  //       (error) => {
  //         console.error('Erreur lors de l\'acceptation de l\'invitation:', error);
  //       }
  //     );
  // }



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


  

  loadUsersDemandes() {

   
this.demandeService.getDemandes(this.me.id).subscribe((data) => {
    
        this.demandesMentorat = data;
        console.log("listeDemandeMentorat",this.demandesMentorat)
      },
      error => {
        console.error('Erreur lors du chargement des demandes:', error);
    
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
  






}