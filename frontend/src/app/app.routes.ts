import { LoginComponent } from './componnents/login/login.component';
import { LandingComponent } from './componnents/landing/landing.component';
import { Routes } from '@angular/router';
import { PostePageComponent } from './componnents/postepage/postepage.component';
import { RechercheProfileComponent } from './componnents/recherche-profile/recherche-profile.component';
import { MyprofileComponent } from './componnents/myprofile/myprofile.component';
import { NavBarComponent } from './componnents/nav-bar/nav-bar.component';
import { DemandeMentoratComponent } from './componnents/demande-mentorat/demande-mentorat.component';
import { RegistreComponent } from './componnents/registre/registre.component';
import { FormEventComponent } from './componnents/form-event/form-event.component';
import { ShowEventComponent } from './componnents/show-event/show-event.component';
import { EventDetailsComponent } from './componnents/event-details/event-details.component';
import { CommunitySpaceComponent } from './componnents/community-space/community-space.component';



export const routes: Routes = [
    { path: '', component: LandingComponent},
    { path: 'login', component: LoginComponent },
    { path: 'registre', component: RegistreComponent },
    { path: 'formEvent', component: FormEventComponent },
    { path: 'Events', component: ShowEventComponent },
    { path: 'eventDetails', component: EventDetailsComponent }, // Route avec paramètre dynamique
    { path: 'Community', component: CommunitySpaceComponent },
    { path: 'posts', component: PostePageComponent },
    { path: 'rechercheProfile/:id', component: RechercheProfileComponent },
    { path: 'myProfile', component:MyprofileComponent },
    { path: 'navbar', component:NavBarComponent },
    { path: 'demandesMentorat', component:DemandeMentoratComponent},

];
