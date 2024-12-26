import { Routes } from '@angular/router';
import { PostePageComponent } from './componnents/postepage/postepage.component';
import { RechercheProfileComponent } from './componnents/recherche-profile/recherche-profile.component';
import { MyprofileComponent } from './componnents/myprofile/myprofile.component';
import { NavBarComponent } from './componnents/nav-bar/nav-bar.component';
import { DemandeMentoratComponent } from './componnents/demande-mentorat/demande-mentorat.component';

export const routes: Routes = [
  { path: 'posts', component: PostePageComponent },
  { path: 'rechercheProfile/:id', component: RechercheProfileComponent },
  { path: 'myProfile', component:MyprofileComponent },
  { path: 'navbar', component:NavBarComponent },
  { path: 'demandesMentorat', component:DemandeMentoratComponent},

];
