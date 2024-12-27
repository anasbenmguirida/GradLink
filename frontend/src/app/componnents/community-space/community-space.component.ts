import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators,  } from '@angular/forms';
import { CommunityService } from '../../services/community/community.service';
import { UserService } from '../../services/authservice/user.service';
import { NavBarComponent } from '../nav-bar/nav-bar.component';


interface User {
  id: number;
  firstName: string;
  lastName: string;
  photoProfile: string;
}
interface PosteFile {
  id: number; // Identifiant du fichier
  fileName: string; // Nom du fichier
  fileType: string; // Type du fichier (par exemple, image/jpeg)
  data: string; // Représentation base64 des données du fichier
}

interface Poste {
  id: number;
  textArea: string;
  posteFiles: PosteFile[]; 
  user: User;
}




@Component({
  selector: 'app-community-space',
  standalone: true,
  imports: [CommonModule,FormsModule,NavBarComponent,ReactiveFormsModule],
  templateUrl: './community-space.component.html',
  styleUrls: ['./community-space.component.css']  // Correction ici : styleUrls au pluriel
})
export class CommunitySpaceComponent implements OnInit{




  menuOpen: boolean=false;
  selectedMessage: any = null;
  userId: any;
  newMessageText: string = '';
  selectedImage: File | null = null; 
  isAddCommunityDialogOpen: boolean=false;
  communityForm!: FormGroup;  // Le formulaire pour la communauté
  newCommunity = { name: '', description: '' };  // Structure de la communauté
  
  communities = [
    {
      id: 1,
      name: 'Stages',
      description: "C'est votre opportunité pour trouver votre stage de rêve.",
      postes: [
        {
          id: 2,
          textArea: 'Poste disponible pour un stage en IA.',
          posteFiles: [
            {
              id: 1,
              fileName: 'networking.png',
              fileType: 'image/png',
              data: '', 
            }
          ],
          user: {
            id: 1,
            firstName: 'Safae',
            lastName: 'Labjakh',
            photoProfile: 'safae.jpeg',
          }
        },
        {
          id: 1,
          textArea: 'Rejoignez-nous pour un stage en développement web !',
          posteFiles: [
            {
              id: 2,
              fileName: 'event.webp',
              fileType: 'image/webp',
              data: '', 
            }
          ],
          user: {
            id: 2,
            firstName: 'Soumaia',
            lastName: 'Benali',
            photoProfile: 'soumaia.jpg',
          }
        }
      ] as Poste[]
    },
    {
      id: 2,
      name: 'Carrière',
      description: 'Discussion autour des opportunités de carrière.',
      postes: [
        {
          id: 3,
          textArea: 'Nouveau poste de développeur backend ouvert !',
          posteFiles: [
            {
              id: 3,
              fileName: 'hand.avif',
              fileType: 'image/avif',
              data: 'hand.avif', // Idem ici
            }
          ],
          user: {
            id: 3,
            firstName: 'Ali',
            lastName: 'Hassan',
            photoProfile: 'soumaia.jpg',
          }
        },
        {
          id: 4,
          textArea: 'Une excellente opportunité dans la fintech !',
          posteFiles: [], // Aucun fichier pour ce poste
          user: {
            id: 4,
            firstName: 'Fatima',
            lastName: 'Zahra',
            photoProfile: 'safae.jpeg',
          }
        }
      ] as Poste[]
    }
  ];

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

  async saveEdit() {
    if (this.editPost) {
      try {
        // Vérifiez si une image a été sélectionnée
        if (this.selectedImage) {
          // Convertir le fichier sélectionné en base64
          const base64 = await this.convertFileToBase64(this.selectedImage);
  
          // Formater le fichier pour l'ajouter à editPost
          const formattedFile = {
            id: 1, // Assurez-vous que l'ID est unique
            fileName: this.selectedImage!.name,
            fileType: this.selectedImage!.type,
            data: base64,
          };
  
          this.editPost.posteFiles.push(formattedFile); // Ajouter le fichier formaté à la liste
        }
  
        const community = this.communities.find(c => c.id === this.selectedCommunityId);
        if (community) {
          const index = community.postes.findIndex(p => p.id === this.editPost.id);
          if (index !== -1) {
            community.postes[index] = { ...this.editPost }; // Mettre à jour le poste
          }
        }
  
        this.isEditDialogOpen = false; // Fermer le formulaire
        this.editPost = null; // Réinitialiser le poste
        this.selectedImage = null; // Réinitialiser l'image sélectionnée
      } catch (error) {
        console.error("Erreur lors de la sauvegarde de l'édition :", error);
        // Affichez un message d'erreur à l'utilisateur ici si nécessaire
      }
    }
  }
  // Méthode pour convertir une image en base64
  convertFileToBase64(file: File): Promise<string | ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          resolve(reader.result); // Résoudre avec le résultat uniquement s'il n'est pas null
        } else {
          reject(new Error("Failed to read file")); // Rejeter si le résultat est null
        }
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file); // Lire le fichier en tant qu'URL de données
    });
  }
  // Methode pour supprimer l'image
  removeImage(file: PosteFile) {
    if (this.editPost) {
      // Filtrer le tableau pour enlever le fichier spécifié
      this.editPost.posteFiles = this.editPost.posteFiles.filter((f: PosteFile) => f.id !== file.id);
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
        private fb: FormBuilder
  ) {}

  

   selectedCommunityId: number | null = null;
  communityListVisible: boolean = true;  // Contrôle l'affichage de la liste des communautés (mobile uniquement)

      ngOnInit(){
        this.communityForm = this.fb.group({
          name: ['', [Validators.required, Validators.maxLength(100)]],
          description: ['', [Validators.required, Validators.maxLength(500)]]
        });

        if (isPlatformBrowser(this.platformId)) {
          const user = JSON.parse(localStorage.getItem('user') || '{}');

          this.isAdmin = user.role === 'admin'; 
          this.userId=user.id

          
        } else {
          console.log('Code exécuté côté serveur, pas d\'accès à l\'historique.');
        }
      }


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
  

  onImagesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedImage = input.files[0]; // Stocke l'objet File
    }
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
  //       firstName: 'User', // Remplacez par des données réelles si disponibles
  //       lastName: 'Name',
  //       photoProfile: 'safae.jpeg',
  //     }
  //   };
  
  //   // Si un fichier a été sélectionné, ajoutez-le directement au poste
  //   if (this.selectedImage) {
  //     const formattedFile: PosteFile = {
  //       id: Date.now(), // Utilisez un timestamp comme ID unique pour le fichier
  //       fileName: this.selectedImage.name,
  //       fileType: this.selectedImage.type,
  //       data: '', // Laissez vide pour indiquer que le fichier est local
  //     };
  
  //     // Ajoutez le fichier au tableau des fichiers
  //     newPost.posteFiles.push(formattedFile);
  //   }
  
  //   // Ajoutez le nouveau poste à la communauté sélectionnée
  //   if (this.selectedCommunityId !== null) {
  //     const community = this.communities.find(c => c.id === this.selectedCommunityId);
  //     if (community) {
  //       community.postes.push(newPost);
  //     }
  //   }
  
  //   // Réinitialisez les champs après l'envoi
  //   this.newMessageText = '';
  //   this.selectedImage = null;
  
  //   console.log('Poste ajouté localement :', newPost);
  // }
  

  postMessage() {
    if (!this.newMessageText.trim()) {
      return; 
    }
  
    // Création du nouveau poste
    const newPost: Poste = {
      id: Date.now(), // Utilisez un timestamp comme ID unique
      textArea: this.newMessageText,
      posteFiles: [], // Initialisez comme un tableau vide
      user: {
        id: this.userId,
        firstName: 'User', // Remplacez par des données réelles si disponibles
        lastName: 'Name',
        photoProfile: 'safae.jpeg',
      }
    };
  
    // Si un fichier a été sélectionné, convertissez-le en base64 et ajoutez-le au poste
    if (this.selectedImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const formattedFile: PosteFile = {
          id: Date.now(), // Utilisez un timestamp comme ID unique pour le fichier
          fileName: this.selectedImage!.name,
          fileType: this.selectedImage!.type,
          data: reader.result as string, // Cette valeur est le contenu en base64 de l'image
        };
  
        // Ajoutez le fichier au tableau des fichiers
        newPost.posteFiles.push(formattedFile);
  
        // Ajoutez le nouveau poste à la communauté sélectionnée
        if (this.selectedCommunityId !== null) {
          const community = this.communities.find(c => c.id === this.selectedCommunityId);
          if (community) {
            community.postes.push(newPost);
          }
        }
  
        // Réinitialisez les champs après l'envoi
        this.newMessageText = '';
        this.selectedImage = null;
  
        console.log('Poste ajouté localement :', newPost);
      };
      reader.readAsDataURL(this.selectedImage); // Convertir l'image en base64
    } else {
      // Si aucune image n'est sélectionnée, ajoutez juste le poste sans image
      if (this.selectedCommunityId !== null) {
        const community = this.communities.find(c => c.id === this.selectedCommunityId);
        if (community) {
          community.postes.push(newPost);
        }
      }
    }
  }
  



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
    console.log('Nouvelle communauté ajoutée :', communityData);
    
    // Ajoutez la logique pour sauvegarder la communauté (par exemple, appel API ou ajout local)
    this.newCommunity = { ...communityData }; // Exemple de sauvegarde locale

    // Réinitialisez le formulaire après l'ajout
    this.communityForm.reset();
    this.closeAddCommunityDialog();  // Fermer le formulaire
  } else {
    console.log('Formulaire invalide');
  }
}

  selectCommunity(communityId: number) {
    this.selectedCommunityId = communityId;
  }

  toggleCommunityList() {
    this.communityListVisible = !this.communityListVisible;
  }

  goBackToCommunities() {
    this.selectedCommunityId = null; 
    this.communityListVisible = true;  
  }
}
