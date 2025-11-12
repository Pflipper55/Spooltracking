import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { SpoolsComponent } from './spools/spools';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'spools',
    component: SpoolsComponent,
  },
];
