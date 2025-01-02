import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PostService } from '../../services/post/post.service';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { Router } from '@angular/router'; 
import { forkJoin, tap } from 'rxjs';


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
  photoUser:any;
  classifiedPosts: any[] = [];
  constructor(private fb: FormBuilder, private postService: PostService ,@Inject(PLATFORM_ID) private platformId: Object, private router: Router) {
    this.postForm = this.fb.group({
     textArea: [''],
     PosteFiles: [[]],
      
    });
  }
  
  ngOnInit(): void {


    
if (isPlatformBrowser(this.platformId)) {
          console.log('hiiiiii123')

          this.me = JSON.parse(localStorage.getItem('user') || '{}');
  } else {
          console.log('Code exécuté côté serveur, pas d\'accès à l\'historique.');
       }
this.photoUser=this.postService. getUserImage(this.me.id);
    this.postService.getAllPosts().subscribe((data) => {
      this.posts = data;
   
      this.fetchPosts();
    //  this.checkLikes();

    });
    console.log("postes recu",this.posts)
    console.log("Token récupéré dans /posts:", localStorage.getItem('authToken'));

    console.log("hi");
    console.log(this.me);
  

    console.log(this.posts);
  }

  checkLikes() {
    this.posts.forEach((post:any) => {
      this.postService.isLiked(post.id, this.me.id).subscribe((isLiked) => {
        (post as any).isLiked = isLiked; 
      });
    });
  }
 
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
          tap((isLiked) => (post.isLiked = isLiked))
        )
      )
    ).subscribe({
      next: () => console.log("Likes mis à jour :", this.classifiedPosts),
      error: (err) => console.error("Erreur lors de la mise à jour des likes :", err),
    });
  }
  
  
  
  // isImage(fileType: string | null | undefined): boolean {
  //   return !!fileType && fileType.toLowerCase().startsWith('image/');
  // }



  
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

  submitPost(): void {
    if (this.postForm.valid) {
      const postData = this.postForm.value;
  
      // Créez un objet FormData pour la requête multipart/form-data
      const formData = new FormData();
  
      // Ajoutez la description au FormData
      formData.append('textArea', postData.textArea);
      formData.append('typePost', 'NORMAL');
      formData.append('userId', this.me.id);
      this.selectedFiles.forEach((file) => {
        formData.append('files', file); // "files[]" correspond à l'attente du backend
      });

      console.log("Fichiers dans 'files[]' :");
const files = formData.getAll('files[]');
files.forEach((file, index) => {
  console.log(`File ${index + 1}:`, file);
});
      console.log("formData",formData);
this.selectedFiles.forEach((file, index) => {
  console.log(`soumaia File ${index}:`, file);
});
  

      // Envoi des données au backend via le service
      this.postService.createPost(formData).subscribe(
        (response) => {
          // Ajoutez le nouveau post localement (par exemple, dans une liste)
          // this.classifiedPosts.unshift(formData);
          console.log("le poste est ajoute");
          // Réinitialisez le formulaire et les fichiers sélectionnés
          this.postForm.reset();
          this.selectedFiles = [];
          this.selectedFileNames = [];
          this.router.navigate(['/posts']);
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


  selectedFiles: File[] = [];
    selectedFileNames: string[] = [];

    onFileChange(event: Event): void {
      const input = event.target as HTMLInputElement;
      
    if (input.files && input.files.length > 0) {
        Array.from(input.files).forEach((file) => {
          const mimeType = file.type;
            const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'pdf'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

          if (mimeType.startsWith('image/') || mimeType === 'application/pdf'
        ||  mimeType.startsWith('application') && validExtensions.includes(fileExtension || '')) {
            this.selectedFiles.push(file);  // Ajoute le fichier valide à la liste
            this.selectedFileNames.push(file.name); // Stocke le nom du fichier
          } else {
            console.error('Type de fichier non pris en charge :', file.name);
          }
        });
    
        // Log des fichiers sélectionnés (utile pour le débogage)
        console.log('Fichiers sélectionnés :', this.selectedFiles);
        console.log('Noms des fichiers :', this.selectedFileNames);
      }
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



selectedImage: string | null = null;
isModalOpen:boolean=false;
openModalimage(image: string) {
  this.selectedImage = image;
  this.isModalOpen=true;
}

closeModalimage() {
  this.selectedImage = null;
  this.isModalOpen=false;
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
          post.nbrLikes = (post.nbrLikes || 0) + 1; // Optionnel: augmenter le nombre de likes
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
          post.nbrLikes = (post.nbrLikes || 0) - 1; // Optionnel: diminuer le nombre de likes
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
  }
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
