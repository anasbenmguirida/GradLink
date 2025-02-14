import { ProfileService } from './../../services/profile/profile.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post/post.service';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { forkJoin, tap } from 'rxjs';

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


  constructor(private route: ActivatedRoute,@Inject(PLATFORM_ID) private platformId: Object,private ProfileService :ProfileService,private postService :PostService) {}

   me:any;
   selectedId: number | null = null;
   searchUser:any;
   relationStatus: string | null = null;
   posts:any=[];
   classifiedPosts: any[] = [];
  ngOnInit(): void {

        
    if (isPlatformBrowser(this.platformId)) {
              console.log('hiiiiii123')
    
              this.me = JSON.parse(localStorage.getItem('user') || '{}');
              console.log(this.me)
    

      } else {
              console.log('Code exécuté côté serveur, pas d\'accès à l\'historique.');
           }

 
  this.selectedId = +this.route.snapshot.paramMap.get('id')! ;
console.log(this.selectedId)

  if (this.selectedId) {
    this.ProfileService.getUserById(this.selectedId).subscribe(
      (data) => {
        this.searchUser = data;  
       console.log("user cherchét",this.searchUser)
      },
      (error) => {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      }
    );
  }
  console.log("seaaaarch",this.searchUser);
  this.loadRelation();
  this.postService.getUserPosts(this.selectedId).subscribe((data) => {
    this.posts = data;
    console.log("lesPostRecherch",this.posts)
    this.fetchPosts();

  });


  }
  // platformId(platformId: any) {
  //   throw new Error('Method not implemented.');
  // }

//fin ngoninit


fetchPosts(): void {
    if (!this.posts || this.posts.length === 0) {
      console.warn("Aucun post à classer.");
      return;
    }
    
    this.classifiedPosts = this.posts.map((post: any) => ({
      ...post,
      isLiked: false,
    }));
    
    const userId = this.me?.id;
    if (!userId) {
      console.error("Utilisateur non authentifié.");
      return;
    }
    
    forkJoin(
      this.classifiedPosts.map((post) => 
        this.postService.isLiked(post.poste.id, userId).pipe(
          tap((isLiked: any) => (post.isLiked = isLiked))
        )
      )
    ).subscribe({
      next: () => console.log("Likes mis à jour :", this.classifiedPosts),
      error: (err) => console.error("Erreur lors de la mise à jour des likes :", err),
    });
  }
  
  
  loadRelation() {
    const [laureatId, etudiantId] = this.me.role === "ETUDIANT" 
      ? [this.selectedId, this.me.id]
      :  [this.me.id, this.selectedId] ;
     console.log(laureatId,etudiantId)
    this.ProfileService
      .getRelation(laureatId, etudiantId)
      .subscribe(
        (response: any) => {
          console.log('Response from getRelation:', response);
  
          if (response === 2) {
            this.relationStatus = 'none';
          } else if (response === 0) {
            this.relationStatus = 
              this.me && this.me.role === "ETUDIANT" ? 'pending-sent' : 'pending-received';
          } else if (response === 1){
            this.relationStatus = 'friends';
          }
  
          console.log('Relation status:', this.relationStatus);
        },
        (error) => {
          console.error('Erreur lors de la récupération de la relation:', error);
        }
      );
  }
  
  


  isImage(fileType: string | null | undefined, fileName: string): boolean {
    if (!fileType || !fileName) {
      return false;
    }
  
    // Liste des extensions d'image supportées
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.jfif'];
  
    // Vérifier si le nom du fichier se termine par une extension d'image
    return imageExtensions.some(extension => fileName.toLowerCase().endsWith(extension));
  }
  
  
  isPdf(fileType: string): boolean {
    return fileType === 'application/pdf';  // Vérifie si le type de fichier est un PDF
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
  
  sendInvitation() {
    console.log(this.reason);
    this.ProfileService
      .sendInvitation(this.me.id, this.selectedId,this.reason)
      .subscribe(
        (response) => {
          console.log(response);
          this.relationStatus = 'pending-sent';
        },
        (error) => {
          console.error('Erreur lors de l\'envoi de l\'invitation:', error);
        }
      );
  }
  
  cancelInvitation() {
    this.ProfileService
      .cancelInvitation( this.selectedId,this.me.id)
      .subscribe(
        (response) => {
   console.log(response);
          this.relationStatus = 'none';
        },
        (error) => {
          console.error('Erreur lors de l\'annulation de l\'invitation:', error);
        }
      );
  }



  handleInvitation() {
    if (this.me.role === 'ETUDIANT') {
      this.annulerInvitation();
    } else if (this.me.role === 'LAUREAT') {
      this.cancelInvitation();
    } else {
      console.error('Role non pris en charge:', this.me.role);
    }
  }
  

  annulerInvitation() {
    this.ProfileService
      .cancelInvitation(this.me.id, this.selectedId)
      .subscribe(
        (response) => {
          console.log(response);
          this.relationStatus = 'none';
        },
        (error) => {
          console.error('Erreur lors de l\'annulation de l\'invitation:', error);
        }
      );
  }


  
  acceptInvitation() {
    this.ProfileService
      .acceptInvitation(this.selectedId,this.me.id)
      .subscribe(
        (response) => {
          console.log(response);
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
  const userId = this.me.id; // Utilise l'identifiant de l'utilisateur connecté
  console.log(post)
  const isLiked = !post.isLiked; // L'inverse de l'état actuel du like
console.log(isLiked)
  if (isLiked) {
    // Utiliser le service pour "liker"
    this.postService.likePost(post.poste.id, userId).subscribe(
      (response) => {
        if (response) {
          post.isLiked = true; // Met à jour l'état local
          post.poste.nbrLikes = (post.poste.nbrLikes || 0) + 1; // Optionnel: augmenter le nombre de likes
          console.log(`Post liké avec succès :`, post);
        } else {
          console.error('Erreur: la réponse du serveur n\'est pas attendue', response);
        }
      },
      (error) => {
        console.error('Erreur lors du like du post :', error);
        // Optionnel: Afficher une notification ou message d'erreur
      }
    );
  } else {
    // Utiliser le service pour "unliker"
    this.postService.unlikePost(post.poste.id, userId).subscribe(
      (response) => {
        if (response ) {
          post.isLiked = false; // Met à jour l'état local
          post.poste.nbrLikes = (post.poste.nbrLikes || 0) - 1; // Optionnel: diminuer le nombre de likes
          console.log(`Post unliké avec succès :`, post);
        } else {
          console.error('Erreur: la réponse du serveur n\'est pas attendue', response);
        }
      },
      (error) => {
        console.error('Erreur lors du unlike du post :', error);
        // Optionnel: Afficher une notification ou message d'erreur
      }
    );
  } }



isModalOpen = false;
modalImage: string | null = null;
isModalOpenn = false;
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


