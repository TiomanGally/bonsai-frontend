import {Routes} from '@angular/router';
import {OverviewComponent} from './overview/overview.component';
import {BonsaiDetailsComponent} from './bonsai-details/bonsai-details.component';

export const routes: Routes = [
  { path: '', component: OverviewComponent },
  {path: 'bonsais', component: OverviewComponent},
  {path: 'bonsais/:id', component: BonsaiDetailsComponent},
];
