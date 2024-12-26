import { LoginComponent } from './componnents/login/login.component';
import { LandingComponent } from './componnents/landing/landing.component';
import { Routes } from '@angular/router';
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

];
