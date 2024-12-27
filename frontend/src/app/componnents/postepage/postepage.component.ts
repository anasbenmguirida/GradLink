import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PostService } from '../../services/post/post.service';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

interface Post {
  id: string;
  description: string;
  fichiers: string[]; // Tableau de chaînes (si ce sont des URL de fichiers)
  isLiked?: boolean; // Ajout de isLiked, qui peut être géré côté frontend
}

@Component({
  selector: 'app-postepage',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    NavBarComponent
  ],
  templateUrl: './postepage.component.html',
  styleUrls: ['./postepage.component.css']
})



export class PostePageComponent implements OnInit  {
  postForm: FormGroup;
  posts:any=[];
  me:any;
  classifiedPosts: any[] = [];
  constructor(private fb: FormBuilder, private postService: PostService) {
    this.postForm = this.fb.group({
      description: [''],
      images: [[]],
      files: [[]],
    });
  }
  
  ngOnInit(): void {

    this.postService.getAllPosts().subscribe((data) => {
      this.posts = data;
      this.fetchPosts();
      this.checkLikes();

    });
    this.me = JSON.parse(localStorage.getItem('user') || '{}');

    console.log("hi");
    this.postService.getPosts().subscribe((data) => {
      this.posts = data;
    });
  }

  checkLikes() {
    this.posts.forEach((post:Post) => {
      this.postService.isLiked(post.id, this.me.id).subscribe((isLiked) => {
        (post as any).isLiked = isLiked; 
      });
    });
  }
 
  fetchPosts(): void {
    this.classifiedPosts = this.posts.map((post: Post) => ({
      ...post,
      images: post.fichiers.filter((url: string) => this.isImage(url))  || [],
      pdfs: post.fichiers.filter((url: string) => this.isPdf(url)) || [],
    }));
  }
  

  isImage(url: string): boolean {
    return /\.(jpg|jpeg|png|gif)$/i.test(url);
  }

  isPdf(url: string): boolean {
    return /\.pdf$/i.test(url);
  }

  submitPost(): void {
    if (this.postForm.valid) {
      const postData = this.postForm.value;
  
      // Créez un objet FormData pour la requête multipart/form-data
      const formData = new FormData();
  
      // Ajoutez la description au FormData
      formData.append('description', postData.description);
  
      // Ajoutez les fichiers au FormData
      this.selectedFiles.forEach((file) => {
        formData.append('files[]', file); // "files[]" correspond à l'attente du backend
      });
  
      // Envoi des données au backend via le service
      this.postService.createPost(formData).subscribe(
        (response) => {
          // Ajoutez le nouveau post localement (par exemple, dans une liste)
          this.posts.unshift(response);
          
          // Réinitialisez le formulaire et les fichiers sélectionnés
          this.postForm.reset();
          this.selectedFiles = [];
          this.selectedFileNames = [];
        },
        (error) => {
          console.error('Erreur lors de l\'envoi du post :', error);
        }
      );
    }



    // submitPost(): void {
    //   if (this.postForm.valid) {
    //     const postData = this.postForm.value;
    
    //     // Créez un objet FormData pour la requête multipart/form-data
    //     const formData = new FormData();
    
    //     // Ajoutez les données de description sous forme de JSON
    //     const posteJson = JSON.stringify({ description: postData.description });
    //     formData.append('poste', posteJson);
    
    //     // Ajoutez les fichiers au FormData
    //     this.selectedFiles.forEach((file) => {
    //       formData.append('file', file); // Le backend attend un champ "file"
    //     });
    
    //     // Envoi des données au backend via le service
    //     this.postService.createPost(formData).subscribe(
    //       (response) => {
    //         // Ajoutez le nouveau post localement (par exemple, dans une liste)
    //         this.posts.unshift(response);
    
    //         // Réinitialisez le formulaire et les fichiers sélectionnés
    //         this.postForm.reset();
    //         this.selectedFiles = [];
    //         this.selectedFileNames = [];
    //       },
    //       (error) => {
    //         console.error('Erreur lors de l\'envoi du post :', error);
    //       }
    //     );
    //   }
    // }
    
  }
  
 //si je veux envoyer urls 
//  submitPost(): void {
//   if (this.postForm.valid) {
//     const postData = this.postForm.value;

//     // Ajouter les URLs des fichiers si préchargés
//     postData.files = this.selectedFiles.map((file) => URL.createObjectURL(file));

//     this.postService.createPost(postData).subscribe(
//       (response) => {
//         this.posts.unshift(response);
//         this.postForm.reset();
//         this.selectedFiles = [];
//         this.selectedFileNames = [];
//       },
//       (error) => {
//         console.error('Erreur lors de l\'envoi du post :', error);
//       }
//     );
//   }
// }


  selectedFiles: File[] = [];
    selectedFileNames: string[] = [];

    onFileChange(event: Event): void {
      const input = event.target as HTMLInputElement;
    
      if (input.files && input.files.length > 0) {
        Array.from(input.files).forEach((file) => {
          const mimeType = file.type;
    
          if (mimeType.startsWith('image/') || mimeType === 'application/pdf') {
            this.selectedFiles.push(file);  // Ajoute le fichier valide à la liste
            this.selectedFileNames.push(file.name); // Stocke le nom du fichier
          } else {
            console.error('Type de fichier non pris en charge :', file.name);
          }
        });
    
        // Log des fichiers sélectionnés (utile pour le débogage)
        console.log('Fichiers sélectionnés :', this.selectedFiles);
      }
    }
    
    
    // onFileChange(event: Event): void {
    //   const input = event.target as HTMLInputElement;
    //   if (input.files && input.files.length > 0) {
    //     // Ne réinitialisez pas les tableaux, mais ajoutez les nouveaux fichiers sélectionnés
    //     Array.from(input.files).forEach((file) => {
    //       const mimeType = file.type;
    
    //       if (mimeType.startsWith('image/') || mimeType === 'application/pdf') {
    //         this.selectedFiles.push(file);  // Ajoute les fichiers valides à la liste
    //         this.selectedFileNames.push(file.name); // Ajoute le nom du fichier
    //       } else {
    //         console.error('Type de fichier non pris en charge :', file.name);
    //       }
    //     });
    
    //     console.log('Fichiers sélectionnés :', this.selectedFiles);
    //   }
    // }
  
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



selectedImage: string | null = null;

openModalimage(image: string) {
  this.selectedImage = image;
}

closeModalimage() {
  this.selectedImage = null;
}
  

toggleLike(post: any): void {
  const userId = 'myCIN'; 
  const isLiked = !post.isLiked;

    this.postService.toggleLike(post.id,  isLiked).subscribe(
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
















//   posts = [
//     {
//       profileImage: 'profile.png',
//       username: 'Mouad Ajmani',
//       role: '1337 student',
//       daysAgo: 4,
//       description: `🌟 Excited to Share My Portfolio! 🌟 I'm thrilled to unveil the first version of my personal portfolio website! 🎉`,
//       images: ['windows-design.jpg', 'additional-image.jpg'], // Plusieurs images
//       pdfs: ['projet_use_case.pdf'],                          // Plusieurs fichiers PDF
//       likes: 891,
//       likeIcon: 'like.png',
//       isLiked: false,
//     },
//     {
//       profileImage: 'profile.png',
//       username: 'Mouad Ajmani',
//       role: '1337 student',
//       daysAgo: 4,
//       description: `🌟 Excited to Share My Portfolio! 🌟 I'm thrilled to unveil the first version of my personal portfolio website! 🎉`,
//       images: ['laravel.png'],        // Une seule image
//       pdfs: [],                       // Aucun fichier PDF
//       likes: 891,
//       likeIcon: 'like.png',
//       isLiked: false,
//     },
//   ];
  

//   isLiked: boolean = false; // État de "J'aime" pour un post
//   postForm: FormGroup; // Formulaire pour soumettre un post

//   constructor(private fb: FormBuilder) {
//     // Initialisation du formulaire avec FormBuilder
//     this.postForm = this.fb.group({
//       description: [''],   // Champ de description
//       images: [[]],        // Champ pour plusieurs images
//       files: [[]]          // Champ pour plusieurs fichiers PDF
//     });
    
//   }

//   // Fonction pour gérer le changement du champ "description"
//   onContentChange(event: any): void {
//     const description = event.target.value.trim();
//     this.postForm.get('description')?.setValue(description);
//   }





//   selectedFiles: File[] = [];
//   selectedFileNames: string[] = [];
  
//   onFileChange(event: Event): void {
//     const input = event.target as HTMLInputElement;
//     if (input.files && input.files.length > 0) {
//       // Ne réinitialisez pas les tableaux, mais ajoutez les nouveaux fichiers sélectionnés
//       Array.from(input.files).forEach((file) => {
//         const mimeType = file.type;
  
//         if (mimeType.startsWith('image/') || mimeType === 'application/pdf') {
//           this.selectedFiles.push(file);  // Ajoute les fichiers valides à la liste
//           this.selectedFileNames.push(file.name); // Ajoute le nom du fichier
//         } else {
//           console.error('Type de fichier non pris en charge :', file.name);
//         }
//       });
  
//       console.log('Fichiers sélectionnés :', this.selectedFiles);
//     }
//   }
  
//   // Soumission du post
//   submitPost(): void {
//     if (this.postForm.valid) {
//       const postData = this.postForm.value;
//       console.log('Post soumis :', postData);
  
//       // Traitez les fichiers images
//       const images = this.selectedFiles
//         .filter((file) => file.type.startsWith('image/'))
//         .map((file) => URL.createObjectURL(file));  // Crée des URL temporaires pour les images
  
//       // Traitez les fichiers PDF
//       const pdfs = this.selectedFiles
//         .filter((file) => file.type === 'application/pdf')
//         .map((file) => URL.createObjectURL(file));  // Crée des URL temporaires pour les PDF
  
//       const newPost = {
//         profileImage: 'profile.png', // Remplace par le chemin de l'image du profil utilisateur
//         username: 'Soumaia Kerouan', // Remplace par le nom de l'utilisateur connecté
//         role: 'User', // Ajout de la propriété 'role'
//         daysAgo: 0, // Nouveau post, donc publié aujourd'hui
//         description: postData.description || '', // Description vide par défaut si non renseignée
//         images, // Liste des URL temporaires pour les images
//         pdfs,   // Liste des URL temporaires pour les fichiers PDF
//         likes: 0, // Initialisation des likes à 0
//         likeIcon: 'like.png', // Ajout de la propriété 'likeIcon'
//         isLiked: false, // Par défaut, le post n'est pas aimé
//       };
  
//       // Ajouter le nouveau post au début du tableau posts
//       this.posts.unshift(newPost);
  
//       // Réinitialisation du formulaire après soumission
//       this.postForm.reset();
//       this.selectedFiles = []; // Réinitialise la liste des fichiers
//       this.selectedFileNames = []; // Réinitialise les noms des fichiers
//     }
//   }
  
  





  



// toggleLike(post: any): void {
//   post.isLiked = !post.isLiked;


// }


// selectedImages: string[] = []; // Images sélectionnées pour la galerie
// isGalleryOpen: boolean = false; // Initialement fermé
// openGallery(images: string[]): void {
//   this.selectedImages = images; // Stocke les images restantes
//   console.log('Opening gallery with images:', images);
//   // Ajoutez ici la logique pour ouvrir un modal ou une galerie
//   this.isGalleryOpen = true; // Exemple : activer un état pour afficher un modal
// }

// closeGallery(): void {
//   this.isGalleryOpen = false;
// }

// selectedImage: string | null = null;

// openModalimage(image: string) {
//   this.selectedImage = image;
// }

// closeModalimage() {
//   this.selectedImage = null;
// }


}
