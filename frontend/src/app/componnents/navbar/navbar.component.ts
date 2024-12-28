import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  query :string=''; 
  invitations:any=[];
  usersMessage :any=[];
  filteredUsers: any[] = []; 
demandesMentor: any[] = []; 

userAuth:any;
  ngOnInit(): void {
 this.userAuth={id:1,image:'profile.jpg',firstname:"soumaia",lastname:"Kerouan Salah",role:"laureat"}
   

 this.usersMessage = [
  { firstname: 'Soumaia ', lastname: 'Kerouan salah', image:'profile.jpg',messages: [
    { content: 'Salut, comment ça va ?', isOutgoing: false, time: '10:00' },
    { content: 'Ça va bien et toi ?', isOutgoing: true, time: '10:02' }
  ]},
  { firstname: 'Soumaia ', lastname: 'Kerouan salah', image:'profile.jpg',messages: [
    { content: 'Salut, comment ça va ?', isOutgoing: false, time: '10:00' },
    { content: 'Ça va bien et toi ?', isOutgoing: true, time: '10:02' },
    { content: 'Salut, comment ça va ?', isOutgoing: false, time: '10:00' },
    { content: 'Salut, comment ça va ?', isOutgoing: false, time: '10:00' },
    { content: 'Ça va bien et toi ?', isOutgoing: true, time: '10:02' },
    { content: 'Ça va bien et toi ?', isOutgoing: true, time: '10:02' },

  ]},
  { firstname: 'Soumaia ', lastname: 'Kerouan salah', image:'profile.png',messages: [
    { content: 'Salut, comment ça va ?', isOutgoing: false, time: '10:00' },
    { content: 'Ça va bien et toi ?', isOutgoing: true, time: '10:02' }
  ]},
];

this.demandesMentor= [
  { id: 1, image: 'profile.jpg', content: 'a vous envoyé une demande de mentorat', time: '6j', firstname: 'Aya', lastname: 'Sal' },
  { id: 2, image: 'profile.jpg', content: 'a vous envoyé une demande de mentorat', time: '6j', firstname: 'Ali', lastname: 'Khan' },
  { id: 3, image: 'profile.jpg', content: 'a vous envoyé une demande de mentorat', time: '6j', firstname: 'Sara', lastname: 'Ahmed' }
];
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
  

  isMobileMenuOpen = false;

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  isMessagerie = false;

  toggleMessagerie() {
    this.isMessagerie = !this.isMessagerie;
  }
  

  isNotif = false;

  toggleNotif() {
    this.isNotif = !this.isNotif;
  }
   

  
  isInvit= false;

  toggleInvit() {
    this.isInvit = !this.isInvit;
  }
   
  private router =inject(Router);






  isMenu = true;
  toggleMenu(){
    this.isMenu=! this.isMenu;
  }
  
  
 // selectedUser: any = null;
  //selectedMessages: any[] = [];


 

  selectedUser: any = null; 
  selectedMessages:any[] = [];
  newMessage = '';

  onSelectUser(user: any) {
    this.isMessagerie=false;
    this.selectedUser = user;
    this.selectedMessages = user.messages;
  }

  closeChat() {
    this.selectedUser = null;
    this.selectedMessages = [];
  }

  

  sendMessage() {
    if (this.newMessage.trim()) {
      this.selectedMessages.push({
        content: this.newMessage,
        isOutgoing: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      this.newMessage = '';
    }
  }



  //demande 

  onSelectDemande(id: number): void {
    console.log(id);
    this.router.navigate(['/demandesMentorat'], { state: { id} });
  }


  NavigateToMyprofile(){
    this.router.navigate(['/myProfile'])
  } 


  navigateToProfile(user: any): void {
    if (user.id === this.userAuth.id) {
      
      this.router.navigate(['/myProfile']);
    } else {

      this.router.navigate(['/rechercheProfile', user.id]);
    }
  }

}

