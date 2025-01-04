import { ProfileService } from './../../services/profile/profile.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PostService } from '../../services/post/post.service';
import { Router, RouterLink } from '@angular/router';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { forkJoin, tap } from 'rxjs';





@Component({
  selector: 'app-myprofile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    RouterLink,
    NavBarComponent
  ],
  templateUrl: './myprofile.component.html',
  styleUrl: './myprofile.component.css'
})


export class MyprofileComponent implements OnInit {


  
   private router =inject(Router);
  form: FormGroup;
 postForm: FormGroup;
  posts:any=[];
  me:any;
  photoUser:any;
  classifiedPosts: any[] = [];

  
   ngOnInit(): void {

    if (isPlatformBrowser(this.platformId)) {
          console.log('hiiiiii123')

          this.me = JSON.parse(localStorage.getItem('user') || '{}');
          console.log("userayth",this.me)
  } else {
          console.log('Code exécuté côté serveur, pas d\'accès à l\'historique.');
        }
this.photoUser=this.postService. getUserImage(this.me.id);

  // this.me = {
  //   role: 'LAUREAT',
  //   firstName: 'Charlie',
  //   lastName: 'Brown',
  //   specialite: 'Mathématiques',
  //   entreprise: 'EduCenter',
  //   promotion:"2025",
  // };
  
    this.postService.getUserPosts(this.me.id).subscribe((data) => {
      this.posts = data;
      console.log("mesPost",this.posts)

      this.fetchPosts();

    });

    

    if (this.me.role === 'ETUDIANT') {
              this.form.patchValue({
                firstName: this.me.firstName,
                lastName: this.me.lastName,
                filiere: this.me.filiere || '', // Par défaut si non défini
              });
            }
        
            if (this.me.role === 'LAUREAT') {
              this.form.patchValue({
                firstName: this.me.firstName,
                lastName: this.me.lastName,
                specialite: this.me.specialite || '', // Par défaut si non défini
                entreprise: this.me.entreprise || '', // Par défaut si non défini
              });
            }
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


 



  constructor(private fb: FormBuilder,private postService: PostService, private ProfileService: ProfileService,
    @Inject(PLATFORM_ID) private platformId: Object) {


    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      filiere: ['', Validators.required],
      entreprise: [''],
      image: ['',Validators.required],
      specialite:['',Validators.required],

    });

    this.postForm = this.fb.group({
      textArea: [''],
      fichiers: [[]],
    
    });
  }

  selectedFiles: File[] = [];
  selectedFileNames: string[] = [];
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
      console.log("formData  f submit ",formData);
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
          location.reload();

        },
        (error) => {
          console.error('Erreur lors de l\'envoi du post :', error);
        }
      );
    }
  }

  
    
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

openModalimage(image: string) {
  this.selectedImage = image;
}

closeModalimage() {
  this.selectedImage = null;
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
  }}

updateProfile(event: Event): void {
  event.preventDefault();
  if (this.form.valid) {
    const updatedProfile = { ...this.form.value }; // Obtenir toutes les données du formulaire
    
 

    console.log('Profil mis à jour:', updatedProfile);

    // Appeler le service pour envoyer les données au backend
    this.ProfileService.updateProfile(updatedProfile).subscribe(
      (response) => {
        console.log('Profil mis à jour avec succès:', response);
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du profil:', error);
      }
    );
  } else {
    console.error('Formulaire invalide');
  }
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

    
    // updateImage(event: Event): void {
    //   event.preventDefault();
    //   const image = this.form.get('image')?.value;
    //   if (image) {
    //     this.ProfileService.updateProfile(updatedProfile).subscribe(
    //       (response) => {
    //         console.log('Profil mis à jour avec succès:', response);
    //       },
    //       (error) => {
    //         console.error('Erreur lors de la mise à jour du profil:', error);
    //       }
    //     );
    //     console.log('Image mise à jour:', image);
       
    //   } else {
    //     console.error('Aucune image sélectionnée');
    //   }
    // }



       visibleLists: { [key: number]: boolean } = {};

  toggleList(index: number): void {
    // Inverse l'état de visibilité de la liste pour un post donné
    this.visibleLists[index] = !this.visibleLists[index];
  }


selectFile(): void {
  const fileInput = document.querySelector('input[type="file"]') as HTMLElement;
  fileInput?.click(); // Simule un clic pour ouvrir le sélecteur de fichier
}

onImageSelected(event: any): void {
  const file = event.target.files[0]; // Récupère le fichier sélectionné
  if (file) {
    this.form.patchValue({image:file}) // Stocke l'image dans la variable imageFile
  }
}


isModalOpen = false; 
  openModal(): void {
    this.isModalOpen = true;
  }


  closeModal(): void {
    this.isModalOpen = false;
  }



  isEditing: boolean = false; 
  editingPost: any; 
  
  editPost(post: any): void {
    this.isEditing = true;
    this.editingPost = { ...post }; 
  }
  
  closeEdit(): void {
    this.isEditing = false;
    this.editingPost = { textArea: '', fichiers: [], id: null }; // ou undefined si vous préférez
  }

  updatePost() {
    this.postService.updatePost(this.editingPost).subscribe({
      next: (response) => {
        console.log('Post updated successfully:', response);
        // Rediriger ou afficher un message de succès
        //this.closeEdit();
        this.router.navigate(['/posts']); // Exemple de redirection après succès
      },
      error: (error) => {
        console.error('Error updating post:', error);
        // Afficher un message d'erreur si nécessaire
      }
    });
  }

  deletePost(post: any): void {
    this.postService.deletePost(post.id).subscribe(
      () => {
        console.log(`Post with ID ${post.id} deleted successfully.`);
        this.classifiedPosts = this.classifiedPosts.filter((p: any) => p.id !== post.id);
        
        // Rafraîchir la page après la suppression
        location.reload();
      },
      (error) => {
        console.error('Error deleting post:', error);
      }
    );
  }
  
  


  //   removeImage(index: number): void {
  //   this.editingPost.images.splice(index, 1);
  // }
  
  // removePdf(index: number): void {
  //   this.editingPost.pdfs.splice(index, 1);
  // }


  isImageOpen: boolean = false;

openImage() {
  this.isImageOpen = true;
}

closeImage() {
  this.isImageOpen = false;
}


checkLikes() {
  this.posts.forEach((post:any) => {
    this.postService.isLiked(post.id, this.me.id).subscribe((isLiked) => {
      (post as any).isLiked = isLiked; 
    });
  });
}


  
  
// isImage(fileType: string | null | undefined): boolean {
//   return !!fileType && fileType.toLowerCase().startsWith('image/');
// }

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


//parti commenbter




//     posts = [
//     {
//       profileImage: 'profile.png',
//       username: 'Mouad Ajmani',
//       role: '1337 student',
//       daysAgo: 4,
//       textArea: "🌟 Excited to Share My Portfolio! 🌟 I'm thrilled to unveil the first version of my personal portfolio website! 🎉",
//       images: ['windows-design.jpg'], // Tableau contenant les chemins des images
//       pdfs: [], // Tableau vide si aucun PDF n'est attaché
//       likes: 891,
//       likeIcon: 'like.png',
//       isLiked: false
//     },
//     {
//       profileImage: 'profile.png',
//       username: 'Mouad Ajmani',
//       role: '1337 student',
//       daysAgo: 4,
//       textArea: "🌟 Excited to Share My Portfolio! 🌟 I'm thrilled to unveil the first version of my personal portfolio website! 🎉",
//       images: ['laravel.png','profile.png'], // Tableau contenant les chemins des images
//       pdfs: ['projet_use_case.pdf'], // Tableau contenant les chemins des fichiers PDF
//       likes: 891,
//       likeIcon: 'like.png',
//       isLiked: false
//     },
//     {
//       profileImage: 'profile.png',
//       username: 'Mouad Ajmani',
//       role: '1337 student',
//       daysAgo: 4,
//       textArea: "🌟 Excited to Share My Portfolio! 🌟 I'm thrilled to unveil the first version of my personal portfolio website! 🎉",
//       images: ['laravel.png','profile.png','profile.png'], // Tableau contenant les chemins des images
//       pdfs: ['projet_use_case.pdf'], // Tableau contenant les chemins des fichiers PDF
//       likes: 891,
//       likeIcon: 'like.png',
//       isLiked: false
//     },
//     {
//       profileImage: 'profile.png',
//       username: 'Mouad Ajmani',
//       role: '1337 student',
//       daysAgo: 4,
//       textArea: "🌟 Excited to Share My Portfolio! 🌟 I'm thrilled to unveil the first version of my personal portfolio website! 🎉",
//       images: ['laravel.png','profile.png','profile.png','profile.png','profile.png'], // Tableau contenant les chemins des images
//       pdfs: ['projet_use_case.pdf'], // Tableau contenant les chemins des fichiers PDF
//       likes: 891,
//       likeIcon: 'like.png',
//       isLiked: false
//     }
    
    
//   ];
  

//   isLiked: boolean = false; 
 

 

//   postForm: FormGroup;
//   form: FormGroup;


//   //constructor(private fb: FormBuilder) {
//     constructor(private fb: FormBuilder) {
//     this.postForm = this.fb.group({
//       textArea: [''], 
//       images: [null],  
//       files: [null]   
//     });


//     this.form = this.fb.group({
//       firstName: ['', Validators.required],
//       lastName: ['', Validators.required],
//       filiere: ['', Validators.required],
//       entreprise: [''],
//       image: [''],
//       specialite:['',Validators.required],

//     });




    
//   }

//    me:any;


//   //me={id:'1',firstName:'soumaia',lastName:'kerouan',filiere:"ginf",role:"ETUDIANT"}
//     //me={id:'1',firstName:'Soumaia',lastName:'Kerouan Salah',promotion:"2025",specialite:'developpeur full stack' , entreprise:'KINOV',role:'LAUREAT'}
//     ngOnInit(): void {
//      console.log("hi")
//       this.me = {
//         id: '1',
//         firstName: 'Soumaia',
//         lastName: 'Kerouan Salah',
//         promotion: '2025',
//         specialite: 'developpeur full stack',
//         entreprise: 'KINOV',
//         role: 'LAUREAT',
//       };
  
//         //this.me={id:'1',firstName:'soumaia',lastName:'kerouan',filiere:"ginf",role:"ETUDIANT"};

     
//       if (this.me.role === 'ETUDIANT') {
//         this.form.patchValue({
//           firstName: this.me.firstName,
//           lastName: this.me.lastName,
//           filiere: this.me.filiere || '', // Par défaut si non défini
//         });
//       }
  
//       if (this.me.role === 'LAUREAT') {
//         this.form.patchValue({
//           firstName: this.me.firstName,
//           lastName: this.me.lastName,
//           specialite: this.me.specialite || '', // Par défaut si non défini
//           entreprise: this.me.entreprise || '', // Par défaut si non défini
//         });
//       }
//     }

//   updateProfile(event: Event): void {
//     event.preventDefault();
//     if (this.form.valid) {
//       const updatedProfile = { ...this.form.value, image: null }; // Exclure l'image
//       console.log('Profil mis à jour:', updatedProfile);
//       // Envoyer les données personnelles mises à jour au backend
//     } else {
//       console.error('Formulaire invalide');
//     }
//   }
  
//   updateImage(event: Event): void {
//     event.preventDefault();
//     const image = this.form.get('image')?.value;
//     if (image) {
//       console.log('Image mise à jour:', image);
//       // Envoyer l'image au backend
//     } else {
//       console.error('Aucune image sélectionnée');
//     }
//   }
  
//   submit(event: Event): void {
//     event.preventDefault();
//     if (this.form.valid) {
//       const updatedProfile = this.form.value;
//       console.log('Profil mis à jour:', updatedProfile);
//       // Envoyer les données mises à jour au backend
//     } else {
//       console.error('Formulaire invalide');
//     }
//     this.closeModal();
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
//         textArea: postData.textArea || '', // textArea vide par défaut si non renseignée
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
  
  
//   // Toggle "J'aime" pour un post
//   toggleLike(post: any): void {
//     post.isLiked = !post.isLiked;

 
//   }


//   visibleLists: { [key: number]: boolean } = {};

//   toggleList(index: number): void {
//     // Inverse l'état de visibilité de la liste pour un post donné
//     this.visibleLists[index] = !this.visibleLists[index];
//   }


//   isModalOpen = false; 

 





//   // Ouvrir la modale
//   openModal(): void {
//     this.isModalOpen = true;
//   }

//   // Fermer la modale
//   closeModal(): void {
//     this.isModalOpen = false;
//   }

//   // Sauvegarder les données
//   saveChanges(): void {
//    return this.form.value;
// }

// isImageOpen: boolean = false;

// openImage() {
//   this.isImageOpen = true;
// }

// closeImage() {
//   this.isImageOpen = false;
// }


// selectFile(): void {
//   const fileInput = document.querySelector('input[type="file"]') as HTMLElement;
//   fileInput?.click(); // Simule un clic pour ouvrir le sélecteur de fichier
// }

// imageFile: File | null = null;

  
// onImageSelected(event: any): void {
//   const file = event.target.files[0]; // Récupère le fichier sélectionné
//   if (file) {
//     this.form.patchValue({image:file}) // Stocke l'image dans la variable imageFile
//   }
// }

// isModalUpdateposte=false;
// closeModalUpdateposte(){
//   this.isModalUpdateposte=!this.isModalUpdateposte;
// }

// selectedImage: string | null = null;


//   openModalimage(image: string) {
//     this.selectedImage = image;
//   }

//   closeModalimage() {
//     this.selectedImage = null;
//   }

//   selectedImages: string[] = []; // Images sélectionnées pour la galerie
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



// //modifier poste





//   isEditing: boolean = false; 
//   editingPost: { textArea: string; images: string[]; pdfs: string[] } = {
//     textArea: '',
//     images: [],
//     pdfs: []
//   }; 
  
//   editPost(post: { textArea: string; images: string[]; pdfs: string[] }): void {
//     this.isEditing = true;
//     this.editingPost = { ...post }; // Crée une copie du post pour modification
//   }
  
//   closeEdit(): void {
//     this.isEditing = false;
//     this.editingPost = {
//       textArea: '', // Texte vide par défaut
//       images: [], // Liste d'images vide
//       pdfs: [] // Liste de PDF vide
//     };
//   }
  
//   removeImage(index: number): void {
//     this.editingPost.images.splice(index, 1);
//   }
  
//   removePdf(index: number): void {
//     this.editingPost.pdfs.splice(index, 1);
//   }
  
//   updatePost(): void {
//     const updatedPost = {
//       textArea: this.editingPost.textArea,
//       images: this.editingPost.images.length ? this.editingPost.images : null, // Vérifie si des images restent
//       pdfs: this.editingPost.pdfs.length ? this.editingPost.pdfs : null // Vérifie si des PDF restent
//     };
  
//     console.log('Post mis à jour :', updatedPost);
  
  
//     this.closeEdit(); 
//   }



 
  }