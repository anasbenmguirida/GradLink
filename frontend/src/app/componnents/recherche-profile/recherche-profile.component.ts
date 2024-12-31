import { ProfileService } from './../../services/profile/profile.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post/post.service';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

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
        console.log("seaaaarch",this.searchUser);
      },
      (error) => {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      }
    );
  }
  console.log("hooooooooola",this.searchUser)
  this.postService.getUserPosts(this.selectedId).subscribe((data) => {
    this.posts = data;
    console.log("lesPostRecherch",this.posts)
    this.fetchPosts();

  });
this.loadRelation();

  }
  // platformId(platformId: any) {
  //   throw new Error('Method not implemented.');
  // }

//fin ngoninit


fetchPosts(): void {
  console.log('Original Posts:', this.posts); // Log des données initiales

  // Initialise classifiedPosts avec les posts modifiés
  this.classifiedPosts = this.posts.map((post: any) => {
    if (!Array.isArray(post.posteFiles)) {
      console.warn('PosteFiles is not an array:', post);
      return {
        ...post,
        images: [],
        pdfs: [],
        isLiked: false, // Ajout d'un champ par défaut
      };
    }

    const images = post.posteFiles.filter((file: any) => this.isImage(file.fileType, file.fileName)) || [];
    const pdfs = post.posteFiles.filter((file: any) => this.isPdf(file.fileType)) || [];

    return {
      ...post,
      images,
      pdfs,
      isLiked: false, // Ajout d'un champ par défaut
    };
  });

  // Vérifie si chaque post est liké
  this.classifiedPosts.forEach((post: any) => {
    this.postService.isLiked(post.id, this.me.id).subscribe((isLiked) => {
      post.isLiked = isLiked; // Met à jour le champ `isLiked`
    });
  });

  console.log('Classified Posts with Likes:', this.classifiedPosts); // Log des résultats finaux avec les likes
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
  const userId = 'myCIN'; // Identifiant de l'utilisateur
  const isLiked = !post.isLiked;

  if (isLiked) {
    // Utiliser le service pour "liker"
    this.postService.likePost(post.id, this.me.id).subscribe(
      (response) => {
        post.isLiked = true; // Met à jour l'état local
        console.log(`Post liké avec succès :`, post);
      },
      (error) => {
        console.error('Erreur lors du like du post :', error);
      }
    );
  } else {
    // Utiliser le service pour "unliker"
    this.postService.unlikePost(post.id, this.me.id).subscribe(
      (response) => {
        post.isLiked = false; // Met à jour l'état local
        console.log(`Post unliké avec succès :`, post);
      },
      (error) => {
        console.error('Erreur lors du unlike du post :', error);
      }
    );
  } }



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



