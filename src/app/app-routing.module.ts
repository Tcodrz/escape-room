import { BadRequestComponent } from './components/bad-request/bad-request.component';
import { PageComponent } from './components/page/page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResultsComponent } from './components/results/results.component';

const routes: Routes = [
  { path: 'page', component: PageComponent },
  { path: 'page/:id', component: PageComponent },
  { path: 'bad-request', component: BadRequestComponent },
  { path: 'results/:time', component: ResultsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
