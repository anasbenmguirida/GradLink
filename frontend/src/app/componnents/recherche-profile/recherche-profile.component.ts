import { ProfileService } from './../../services/profile/profile.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post/post.service';
import { NavBarComponent } from '../nav-bar/nav-bar.component';



interface Post {
  id: string;
  description: string;
  fichiers: string[]; // Tableau de chaînes (si ce sont des URL de fichiers)
  isLiked?: boolean; // Ajout de isLiked, qui peut être géré côté frontend
}



 
@Component({
  selector: 'app-recherche-profile',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    NavBarComponent
  ],
  standalone:true,
  templateUrl: './recherche-profile.component.html',
  styleUrls: ['./recherche-profile.component.css']
})
export class RechercheProfileComponent implements OnInit {


  constructor(private route: ActivatedRoute,private ProfileService :ProfileService,private postService :PostService) {}

   me:any;
   selectedId: number | null = null;
   searchUser:any;
   relationStatus: string | null = null;
   posts:any=[];
   classifiedPosts: any[] = [];
  ngOnInit(): void {
  
  this.me = JSON.parse(localStorage.getItem('user') || '{}');
  this.selectedId = +this.route.snapshot.paramMap.get('id')! || null;


  if (this.selectedId) {
    this.ProfileService.getUserById(this.selectedId).subscribe(
      (data) => {
        this.searchUser = data;  
      },
      (error) => {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      }
    );
  }


  this.postService.getUserPosts(this.selectedId).subscribe((data) => {
    this.posts = data;
    this.fetchPosts();

  });


  

  this.loadRelation();

  }


  loadRelation() {
    this.ProfileService
      .getRelation(this.me.id, this.selectedId)
      .subscribe((response: any) => {
        if (!response) {
          this.relationStatus = 'none';
        } else if (response.statusMentorat === 0) {
          this.relationStatus =
            response.id_emitter === this.me.id ? 'pending-sent' : 'pending-received';
        } else if (response.statusMentorat === 1) {
          this.relationStatus = 'friends';
        }
      });
  }


  fetchPosts(): void {
    this.classifiedPosts = this.posts.map((post: Post) => ({
      ...post,
      images: post.fichiers.filter((url: string) => this.isImage(url)),
      pdfs: post.fichiers.filter((url: string) => this.isPdf(url))
    }));
  }


  
  isImage(url: string): boolean {
    return /\.(jpg|jpeg|png|gif)$/i.test(url);
  }

  isPdf(url: string): boolean {
    return /\.pdf$/i.test(url);
  }

  sendInvitation() {
    this.ProfileService
      .sendInvitation(this.me.id, this.selectedId)
      .subscribe(
        () => {
          // Mettez à jour l'état local
          this.relationStatus = 'pending-sent';
        },
        (error) => {
          console.error('Erreur lors de l\'envoi de l\'invitation:', error);
        }
      );
  }
  
  cancelInvitation() {
    this.ProfileService
      .cancelInvitation(this.me.id, this.selectedId)
      .subscribe(
        () => {
          // Mettez à jour l'état local
          this.relationStatus = 'none';
        },
        (error) => {
          console.error('Erreur lors de l\'annulation de l\'invitation:', error);
        }
      );
  }
  
  acceptInvitation() {
    this.ProfileService
      .acceptInvitation(this.me.id, this.selectedId)
      .subscribe(
        () => {
          // Mettez à jour l'état local
          this.relationStatus = 'friends';
        },
        (error) => {
          console.error('Erreur lors de l\'acceptation de l\'invitation:', error);
        }
      );
  }
  
showReasonInput: boolean = false; // Contrôle l'affichage de l'input
  reason: string = ''; // Stocke la raison saisie par l'utilisateur
 // userId: string = '1'; // Exemple : ID de l'utilisateur actuel
 // searchedUserId: string = '2'; // Exemple : ID de l'utilisateur recherché

 toggleReasonInput(): void {
  this.showReasonInput = !this.showReasonInput; // Alterne l'affichage de l'input
}






showCancelButton: boolean = false; // Contrôle l'affichage du bouton Annuler

toggleCancelButton(): void {
  this.showCancelButton = !this.showCancelButton; // Basculer entre afficher et masquer
}
  

 selectedImage: string | null = null;


  openModalimage(image: string) {
    this.selectedImage = image;
  }

  closeModalimage() {
    this.selectedImage = null;
  }



  selectedImages: string[] = []; // Images sélectionnées pour la galerie

  isGalleryOpen: boolean = false; // Initialement fermé
openGallery(images: string[]): void {
  this.selectedImages = images; // Stocke les images restantes
  console.log('Opening gallery with images:', images);
  // Ajoutez ici la logique pour ouvrir un modal ou une galerie
  this.isGalleryOpen = true; // Exemple : activer un état pour afficher un modal
}

closeGallery(): void {
  this.isGalleryOpen = false;
}



toggleLike(post: any): void {
   
  const isLiked = !post.isLiked;

    this.postService.toggleLike(post.id, isLiked).subscribe(
    (response) => {
      if (response.success) {
   
        post.isLiked = isLiked;
        console.log(`Action "isLiked=${isLiked}" réussie pour le post :`, post);
      } else {
        console.error('Erreur lors de la mise à jour du like.');
      }
    },
    (error) => {
      console.error('Erreur de communication avec le backend :', error);
    }
  );


}



isModalOpen = false;
modalImage: string | null = null;

openModal(imageSrc: string): void {
  this.modalImage = imageSrc;
  this.isModalOpen = true;
}

closeModal(): void {
  this.isModalOpen = false;
  this.modalImage = null;
}


  

}

//   ngOnInit(): void {
    
//     this.selectedId = +this.route.snapshot.paramMap.get('id')! || null;
//     console.log("selectedId");

//     console.log(this.selectedId); 



//     this.searchUser = {
//       id: '1',
//       firstname: 'Soumaia',
//       lastname: 'Kerouan Salah',
//       promotion: '2025',
//       specialite: 'developpeur full stack',
//       entreprise: 'KINOV',
//       role: 'laureat',
//     };

//             // this.searchUser={id:'1',firstname:'soumaia',lastname:'kerouan',filiere:"ginf",role:"etudiant"};

    
//   }

















//   isEmmit=false;

//   relation={
//     state:0
//    };

  
//       sendRequest():void{
//         this.relation.state=1;
//       }
//       posts = [
//         {
//           profileImage: 'profile.png',
//           username: 'Mouad Ajmani',
//           role: '1337 student',
//           daysAgo: 4,
//           description: "🌟 Excited to Share My Portfolio! 🌟 I'm thrilled to unveil the first version of my personal portfolio website! 🎉",
//           images: ['profile.png','profile.png','profile.png','profile.png','profile.png','profile.png','profile.png','profile.png'],
//           likes: 891,
//           likeIcon: 'like.png',
//           pdfs: [''],
//           isLiked: false
//         },
//         {
//           profileImage: 'profile.png',
//           username: 'Mouad Ajmani',
//           role: '1337 student',
//           daysAgo: 4,
//           description: "🌟 Excited to Share My Portfolio! 🌟 I'm thrilled to unveil the first version of my personal portfolio website! 🎉",
//           images: ['windows-design.jpg'],
//           likes: 891,
//           likeIcon: 'like.png',
//           pdfs: [''],
//           isLiked: false
//         },
//         {
//           profileImage: 'profile.png',
//           username: 'Mouad Ajmani',
//           role: '1337 student',
//           daysAgo: 4,
//           description: "🌟 Excited to Share My Portfolio! 🌟 I'm thrilled to unveil the first version of my personal portfolio website! 🎉",
//           images: ['profile.png','profile.png','profile.png'],
//           likes: 891,
//           likeIcon: 'like.png',
//           pdfs: [''],
//           isLiked: false
//         }

//       ];

//   isLiked: boolean = false; 
  
  


  
    

 
//   toggleLike(post: any): void {
//     post.isLiked = !post.isLiked;

 
//   }

 


  

//  selectedImage: string | null = null;


//   openModalimage(image: string) {
//     this.selectedImage = image;
//   }

//   closeModalimage() {
//     this.selectedImage = null;
//   }


//   selectedImages: string[] = []; 



  

// isGalleryOpen: boolean = false; 
// openGallery(images: string[]): void {
//   this.selectedImages = images; 
//   console.log('Opening gallery with images:', images);
 
//   this.isGalleryOpen = true; 
// }

// closeGallery(): void {
//   this.isGalleryOpen = false;
// }






// user={role:"laureat"};
//   userId = 'user1'; // Utilisateur authentifié
//   searchedUserId = 'user2'; // Utilisateur recherché
//   //searchUser={id:'1',firstname:'soumaia',lastname:'kerouan',filiere:"ginf",role:"etudiant"}
//   searchUser:any;
//     relationStatus: string | null= "none";


// //inpu de reason de demande

// showReasonInput: boolean = false; // Contrôle l'affichage de l'input
//   reason: string = ''; // Stocke la raison saisie par l'utilisateur
//  // userId: string = '1'; // Exemple : ID de l'utilisateur actuel
//  // searchedUserId: string = '2'; // Exemple : ID de l'utilisateur recherché

//  toggleReasonInput(): void {
//   this.showReasonInput = !this.showReasonInput; // Alterne l'affichage de l'input
// }



// sendInvitation(): void {
//   if (!this.reason.trim()) {
//     alert('Veuillez entrer une raison pour votre demande.');
//     return;
//   }

// //   this.relationService.sendInvitation(this.userId, this.searchedUserId, this.reason).subscribe(
// //     (response) => {
// //       console.log('Invitation envoyée avec succès :', response);
// //       this.showReasonInput = false; 
// //       this.reason = ''; 
// //     },
// //     (error) => {
// //       console.error('Erreur lors de l\'envoi de l\'invitation :', error);
// //     }
// //   );
// // }

  
// }



// //like


// isModalOpen = false;
// modalImage: string | null = null;

// openModal(imageSrc: string): void {
//   this.modalImage = imageSrc;
//   this.isModalOpen = true;
// }

// closeModal(): void {
//   this.isModalOpen = false;
//   this.modalImage = null;
// }



