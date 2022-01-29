import { BadRequestComponent } from './components/bad-request/bad-request.component';
import { PageComponent } from './components/page/page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResultsComponent } from './components/results/results.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'login', redirectTo: 'bad-request' },
  { path: 'login/:pageID', component: LoginComponent },
  { path: 'page', redirectTo: 'bad-request' },
  { path: 'page/:id', component: PageComponent },
  { path: 'bad-request', component: BadRequestComponent },
  { path: 'results/:time', component: ResultsComponent },
  { path: '**', redirectTo: 'bad-request' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
