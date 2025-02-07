import {Routes} from '@angular/router';
import {OverviewComponent} from './overview/overview.component';
import {BonsaiDetailsComponent} from './bonsai-details/bonsai-details.component';

export const routes: Routes = [
  {path: '', redirectTo: '/bonsais', pathMatch: 'full'},
  {path: 'bonsais', component: OverviewComponent},
  {path: 'bonsais/:id', component: BonsaiDetailsComponent},
  {path: '**', redirectTo: '/bonsais'}
];
