import { Component, ElementRef, HostListener, Inject, OnInit, PLATFORM_ID, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators,  } from '@angular/forms';
import { CommunityService } from '../../services/community/community.service';
import { UserService } from '../../services/authservice/user.service';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { Router } from '@angular/router';
import { PostService } from '../../services/post/post.service';


@Component({
  selector: 'app-community-space',
  standalone: true,
  imports: [CommonModule,FormsModule,NavBarComponent,ReactiveFormsModule],
  templateUrl: './community-space.component.html',
  styleUrls: ['./community-space.component.css']  // Correction ici : styleUrls au pluriel
})
export class CommunitySpaceComponent implements OnInit{

  @ViewChildren('messagesContainer') private messagesContainers!: QueryList<ElementRef>;
  ngAfterViewChecked(): void {
    // Vérifier et faire défiler vers le bas uniquement pour la communauté sélectionnée
    if (this.selectedCommunityId !== null && this.messagesContainers) {
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    // Récupérer tous les conteneurs de messages et les faire défiler
    this.messagesContainers.forEach(containerRef => {
      const container = containerRef.nativeElement;
      container.scrollTop = container.scrollHeight;
    });
  }


  menuOpen: boolean=false;
  selectedMessage: any = null;
  userId: any;
  newMessageText: string = '';
  selectedImages: File[] = [];
  isAddCommunityDialogOpen: boolean=false;
  communities: any[] = [];
  communityForm!: FormGroup;  // Le formulaire pour la communauté
  newCommunity = { name: '', description: '' };  // Structure de la communauté
  user:any
  classifiedPosts: any[] = []; // Tableau pour stocker les posts affichés
  posteFiles: { fileName: string, data: string }[] = [];



  // communities = [
  //   {
  //     id: 1,
  //     name: 'Stages',
  //     description: "C'est votre opportunité pour trouver votre stage de rêve.",
  //     postes: [
  //       {
  //         id: 2,
  //         textArea: 'Poste disponible pour un stage en IA.',
  //         posteFiles: [
  //           {
  //             id: 1,
  //             fileName: 'networking.png',
  //             fileType: 'image/png',
  //             data: 'mentorship.webp', 
  //           }
  //         ],
  //         user: {
  //           id: 6,
  //           firstName: 'Safae',
  //           lastName: 'Labjakh',
  //           photoProfile: 'safae.jpeg',
  //         }
  //       },
  //       {
  //         id: 1,
  //         textArea: 'Rejoignez-nous pour un stage en développement web !',
  //         posteFiles: [
  //           {
  //             id: 2,
  //             fileName: 'event.webp',
  //             fileType: 'image/webp',
  //             data: 'networking.png', 
  //           }
  //         ],
  //         user: {
  //           id: 2,
  //           firstName: 'Soumaia',
  //           lastName: 'Benali',
  //           photoProfile: 'soumaia.jpg',
  //         }
  //       }
  //     ]
  //   },
  //   {
  //     id: 2,
  //     name: 'Carrière',
  //     description: 'Discussion autour des opportunités de carrière.',
  //     postes: [
  //       {
  //         id: 3,
  //         textArea: 'Nouveau poste de développeur backend ouvert !',
  //         posteFiles: [
  //           {
  //             id: 3,
  //             fileName: 'hand.avif',
  //             fileType: 'image/avif',
  //             data: 'hand.avif', // Idem ici
  //           }
  //         ],
  //         user: {
  //           id: 3,
  //           firstName: 'Ali',
  //           lastName: 'Hassan',
  //           photoProfile: 'soumaia.jpg',
  //         }
  //       },
  //       {
  //         id: 4,
  //         textArea: 'Une excellente opportunité dans la fintech !',
  //         posteFiles: [], // Aucun fichier pour ce poste
  //         user: {
  //           id: 4,
  //           firstName: 'Fatima',
  //           lastName: 'Zahra',
  //           photoProfile: 'safae.jpeg',
  //         }
  //       }
  //     ]
  //   }
  // ];

  ngOnInit() {
    this.communityForm = this.fb.group({
      titre: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]]
    });
  
    if (isPlatformBrowser(this.platformId)) {
      this.user = JSON.parse(localStorage.getItem('user') || '{}');
      console.log(`this.user`)
      console.log(this.user)
  
      this.isAdmin = this.user.role === 'ADMIN'; 
      this.userId = this.user.id;
    }
  
    this.loadCommunities();

  }

  loadCommunities() {
    this.communityService.getAllCommunities().subscribe(
      (data) => {
        this.communities = data; // Mettez à jour l'interface utilisateur avec les données reçues
        console.log('Communautés chargées:', this.communities);
        setTimeout(() => this.ngAfterViewChecked(), 100);

      },
      (error) => {
        console.error('Erreur lors du chargement des communautés:', error);
      }
    );
  }

  toggleMenu(message: any): void {
    if (this.selectedMessage === message) {
      this.menuOpen = !this.menuOpen; // Si le même message est cliqué, alterner l'état du menu
    } else {
      this.selectedMessage = message; // Sélectionner un nouveau message
      this.menuOpen = true; // Ouvrir le menu pour ce message
    }
  

  }
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const menuElement = document.getElementById('menu');
    const messageElement = document.getElementById('message');
    
    // Vérifiez si le clic n'a pas eu lieu sur le menu ou sur un message
    if (menuElement && !menuElement.contains(event.target as Node) && messageElement && !messageElement.contains(event.target as Node)) {
      
      this.menuOpen = false; // Ferme le menu
    }
  }


  isEditDialogOpen = false;
  editPost: any;
  openEditDialog(poste:any) {
    this.editPost = { ...poste }; 

    this.isEditDialogOpen = true;
  }

 saveEdit() {
    
    if (this.selectedCommunityId === null || !this.editPost) {
      console.error('Aucune communauté sélectionnée ou aucun post à modifier.');
      return;
    }

    const updatedPost = {
      ...this.editPost, // Copie des données existantes
      textArea: this.editPost.textArea.trim(),
      posteFiles: this.editPost.posteFiles // Inclure les fichiers mis à jour, le cas échéant
    };

    // Utiliser le service pour envoyer les données mises à jour
    this.communityService.updatePost(this.selectedCommunityId, this.editPost.id, updatedPost)
      .subscribe(
        (response) => {
          console.log('Post mis à jour avec succès!', response);

          // Mettez à jour l'interface utilisateur
          const communityIndex = this.communities.findIndex(c => c.id === this.selectedCommunityId);
          if (communityIndex !== -1) {
            const postIndex = this.communities[communityIndex].postes.findIndex( (p: { id: number }) => p.id === this.editPost.id);
            if (postIndex !== -1) {
              this.communities[communityIndex].postes[postIndex] = response; // Mise à jour locale
            }
          }

          // Fermer la boîte de dialogue
          this.isEditDialogOpen = false;
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du poste :', error);
          // Gérer l'erreur (afficher un message à l'utilisateur, par exemple)
        }
      );
  }
  




  // Méthode pour convertir une image en base64
  // Assurez-vous que l'importation des classes est correcte, notamment `FileReader` et `Promise` (si nécessaire).

// Fonction pour convertir un fichier en Base64
convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}


// Fonction pour ajouter les fichiers dans `posteFiles` avec Base64
async addFiles() {
  try {
    const files = await Promise.all(
      this.selectedImages.map(async (file) => ({
        fileName: file.name,
        data: await this.convertFileToBase64(file) // Convertir chaque fichier en Base64
      }))
    );
    this.posteFiles = files; // Stocker les fichiers convertis
    console.log('Images converties:', this.posteFiles); // Vérifier les fichiers convertis
  } catch (error) {
    console.error('Erreur lors de la conversion des fichiers:', error);
  }
}

  // convertFileToBase64(file: File): Promise<string | ArrayBuffer> {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       if (reader.result) {
  //         resolve(reader.result); // Résoudre avec le résultat uniquement s'il n'est pas null
  //       } else {
  //         reject(new Error("Failed to read file")); // Rejeter si le résultat est null
  //       }
  //     };
  //     reader.onerror = (error) => {
  //       reject(error);
  //     };
  //     reader.readAsDataURL(file); // Lire le fichier en tant qu'URL de données
  //   });
  // }
  // Methode pour supprimer l'image
  removeImage(file: any) {
    if (this.editPost) {
      // Filtrer le tableau pour enlever le fichier spécifié
      this.editPost.posteFiles = this.editPost.posteFiles.filter((f: any) => f.id !== file.id);
    }
  }
canEditOrDeleteMessage(_t27: { user: string; firstName: string; lastName: string; description: string; text: string; photo: string; image: string; }|{ user: string; firstName: string; lastName: string; description: string; text: string; photo: string; image?: undefined; }): any {
throw new Error('Method not implemented.');
}
deleteMessage(arg0: any) {
throw new Error('Method not implemented.');
}
editMessage(_t27: { user: string; firstName: string; lastName: string; description: string; text: string; photo: string; image: string; }|{ user: string; firstName: string; lastName: string; description: string; text: string; photo: string; image?: undefined; }) {
throw new Error('Method not implemented.');
}
  
  isAdmin: boolean=false;
  constructor(private communityService: CommunityService,
    @Inject(PLATFORM_ID) private platformId: Object,
        private userService: UserService ,
        private fb: FormBuilder,
            private router: Router,
             private postService: PostService 
        
  ) {}

  

   selectedCommunityId: number | null = null;
  communityListVisible: boolean = true;  // Contrôle l'affichage de la liste des communautés (mobile uniquement)

     


  deleteCommunity(communityId: number): void {
    const confirmed = confirm('Êtes-vous sûr de vouloir supprimer cette communauté ?');
    if (confirmed) {
      this.communityService.deleteCommunity(communityId).subscribe(
        () => {
          this.communities = this.communities.filter((community) => community.id !== communityId);
        },
        (error) => {
          console.error('Erreur lors de la suppression de la communauté', error);
        }
      );
    }
  }
  // deleteCommunity(communityId: number) {
  //   const confirmed = confirm("Êtes-vous sûr de vouloir supprimer cette communauté ?");
  //   if (confirmed) {
  //     this.communities = this.communities.filter(c => c.id !== communityId);
  //   }
  // }
  
  selectedImageName: string | null = null;  // Variable pour stocker le nom du fichier image sélectionné

  onImagesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
      
      if (input.files && input.files.length > 0) {
        Array.from(input.files).forEach((file) => {
          const mimeType = file.type;
            const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'pdf'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

          if (mimeType.startsWith('image/') || mimeType === 'application/pdf'
        ||  mimeType.startsWith('application') && validExtensions.includes(fileExtension || '')) {
            this.selectedImages.push(file);  // Ajoute le fichier valide à la liste
           // this.selectedFileNames.push(file.name); // Stocke le nom du fichier
           this.selectedImageName = file.name; // Stocker le nom du fichier

          } else {
            console.error('Type de fichier non pris en charge :', file.name);
            this.selectedImageName = null; // Réinitialiser si aucun fichier n'est sélectionné

          }
        });
    
        // Log des fichiers sélectionnés (utile pour le débogage)
        console.log('Fichiers sélectionnés :', this.selectedImages);
       // console.log('Noms des fichiers :', this.selectedFileNames);
      }
  }
  
  // getFileUrl(file: any): string {
  //     console.log('Fichier invalide ou données manquantes', file);
 
    
  //   // Si fileType est incorrect, déduire le type à partir de l'extension
  //   const mimeType = this.getMimeType(file.fileName);
  
  //   return `data:${mimeType};base64,${file.data}`;
  // }
  
  getFileUrl(file: any): string {
    // Si fileType est incorrect, déduire le type à partir de l'extension
    const mimeType = this.getMimeType(file.fileName);
  
    return `data:${mimeType};base64,${file.data}`;
  }
  

  getMimeType(fileName: string): string {
    // Vérifier si le nom du fichier est valide et contient un point
    if (!fileName || !fileName.includes('.')) {
      console.error('Nom de fichier invalide:', fileName);
      return 'application/octet-stream';  // Type générique si fichier invalide
    }
  
    // Extraire l'extension et la convertir en minuscule
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (!extension) {
      console.error('Impossible de récupérer l\'extension de fichier:', fileName);
      return 'application/octet-stream';  // Type générique si extension invalide
    }
  
    // Retourner le type MIME basé sur l'extension
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
        console.warn('Extension inconnue:', extension);
        return 'application/octet-stream';  // Type générique pour extension non reconnue
    }
  }
  

  
  postMessage() {
    if (!this.newMessageText.trim()) {
        return;
    }

    const formData = new FormData();
    formData.append('textArea', this.newMessageText);
    formData.append('typePost', 'CAUMMUNAUTE');
    formData.append('userId', this.userId);
    if (this.selectedCommunityId !== null && this.selectedCommunityId !== undefined) {
        formData.append('caummunauteId', this.selectedCommunityId.toString());
    }

    // Ajout des fichiers au FormData
    this.selectedImages.forEach((file) => {
        formData.append('files', file);
    });

    console.log(`formData`, formData);

    // Génération d'un ID temporaire pour le post
    const tempPostId = Date.now();
    const newPost = {
        id: tempPostId,
        textArea: this.newMessageText,
        user: {
            id: this.userId,
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            photoProfile: null // Remplacer par la photo de profil si disponible
        },
        posteFiles: this.selectedImages.map(file => ({
            fileName: file.name,
            data: URL.createObjectURL(file) // Crée une URL temporaire pour l'image locale
        }))
    };

    // Ajouter temporairement le post localement
    const community = this.communities.find(c => c.id === this.selectedCommunityId);
    if (community) {
        community.postes = [...community.postes, newPost];
    }

    // Réinitialisation des champs après l'ajout
    this.newMessageText = "";
    this.selectedImages = [];
          this.selectedImageName = null; // Réinitialiser si aucun fichier n'est sélectionné


    // Envoi au backend
    this.postService.createPost(formData).subscribe(
        (response: any) => {
            console.log("Post ajouté avec succès:", response);

            // Mettre à jour le post temporaire avec les vraies données du backend
            if (community) {
              const index = community.postes.findIndex((post: { id: number }) => post.id === tempPostId);
              if (index !== -1) {
                    community.postes[index] = response; // Remplace le post temporaire par le post réel
                }
            }

            // Maintenant, recharge la liste complète des posts

            this.loadCommunities();


        },
        (error) => {
            console.error('Erreur lors de l\'envoi du post :', error);

            // Supprimer le post temporaire en cas d'échec
            if (community) {
              community.postes = community.postes.filter((post: { id: number }) => post.id !== tempPostId);
            }
        }
    );
    // setTimeout(() => this.ngAfterViewChecked(), 100);

}

  
  
  

  

  // postMessage() {
  //   if (!this.newMessageText.trim()) {
  //     return; 
  //   }
  
  //   // Création du nouveau poste
  //   const newPost: Poste = {
  //     id: Date.now(), // Utilisez un timestamp comme ID unique
  //     textArea: this.newMessageText,
  //     posteFiles: [], // Initialisez comme un tableau vide
  //     user: {
  //       id: this.userId,
  //       firstName: this.userId.firstName, // Remplacez par des données réelles si disponibles
  //       lastName: this.userId.lastName,
  //       photoProfile: 'safae.jpeg',
  //     }
  //   };
  
  //   // Si un fichier a été sélectionné, convertissez-le en base64 et ajoutez-le au poste
  //   if (this.selectedImage) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       const formattedFile: PosteFile = {
  //         id: Date.now(), // Utilisez un timestamp comme ID unique pour le fichier
  //         fileName: this.selectedImage!.name,
  //         fileType: this.selectedImage!.type,
  //         data: reader.result as string, // Cette valeur est le contenu en base64 de l'image
  //       };
  
  //       // Ajoutez le fichier au tableau des fichiers
  //       newPost.posteFiles.push(formattedFile);
  
  //       // Ajoutez le nouveau poste à la communauté sélectionnée
  //       if (this.selectedCommunityId !== null) {
  //         const community = this.communities.find(c => c.id === this.selectedCommunityId);
  //         if (community) {
  //           community.postes.push(newPost);
  //         }
  //       }
  
  //       // Réinitialisez les champs après l'envoi
  //       this.newMessageText = '';
  //       this.selectedImage = null;

  //       console.log('Poste ajouté localement :', newPost);
  //     };
  //     reader.readAsDataURL(this.selectedImage); // Convertir l'image en base64
  //   } else {
  //     // Si aucune image n'est sélectionnée, ajoutez juste le poste sans image
  //     if (this.selectedCommunityId !== null) {
  //       const community = this.communities.find(c => c.id === this.selectedCommunityId);
  //       if (community) {
  //         community.postes.push(newPost);
  //       }
  //     }
  //   }
  // }
  



// postMessage() {
//   if (!this.newMessageText.trim()) {
//     return; 
//   }

//   const newPost: Poste = {
//     id: Date.now(),
//     textArea: this.newMessageText,
//     posteFiles: [], // Initialisez comme un tableau vide
//     user: {
//       id: this.userId,
//       firstName: 'User',
//       lastName: 'Name',
//       photoProfile: 'safae.jpeg',
//     }
//   };

//   // Convertir les fichiers sélectionnés en base64 et les ajouter au nouveau poste
//   Promise.all(this.selectedImages.map(file => this.convertFileToBase64(file))).then(base64Files => {
//     newPost.posteFiles.push(...base64Files); // Ajouter les fichiers à la liste

//     if (this.selectedCommunityId !== null) {
//       const community = this.communities.find(c => c.id === this.selectedCommunityId);
//       if (community) {
//         community.postes.push(newPost);
//       }
//     }

//     this.newMessageText = '';
//     this.selectedImages = []; // Réinitialiser les fichiers sélectionnés
//   });
// }
  
  
openAddCommunityDialog() {
  this.isAddCommunityDialogOpen = true;
}

closeAddCommunityDialog(): void {
  this.isAddCommunityDialogOpen = false;
}

// Sauvegarder la communauté
saveCommunity(): void {
  if (this.communityForm.valid) {
    const communityData = this.communityForm.value;
console.log(communityData)
    this.communityService.saveCommunity(communityData,this.userId).subscribe({
      next: (response) => {
        console.log('Communauté sauvegardée avec succès :', response);
        this.communityForm.reset();
        this.closeAddCommunityDialog();
        this.loadCommunities()
      },
      error: (error) => {
        console.error('Erreur lors de la sauvegarde de la communauté :', error);
      }
    });
  } else {
    console.log('Le formulaire est invalide');
  }
}

  selectCommunity(communityId: number) {
    this.selectedCommunityId = communityId;
    this.loadCommunities();
  }

  toggleCommunityList() {
    this.communityListVisible = !this.communityListVisible;
  }

  goBackToCommunities() {
    this.selectedCommunityId = null; 
    this.communityListVisible = true;  
  }
  canPost(): boolean {
    return this.user.role === 'ADMIN' || this.user.role === 'LAUREAT';
  }
 
}
