import { BadRequestComponent } from './components/bad-request/bad-request.component';
import { PageComponent } from './components/page/page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResultsComponent } from './components/results/results.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: 'login', redirectTo: 'bad-request' },
  { path: 'login/:id', component: LoginComponent },
  { path: 'page', redirectTo: 'bad-request' },
  { path: 'page/:id', component: PageComponent },
  { path: 'bad-request', component: BadRequestComponent },
  { path: 'results/:time', component: ResultsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
