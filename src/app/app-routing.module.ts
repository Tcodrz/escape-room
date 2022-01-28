import { BadRequestComponent } from './components/bad-request/bad-request.component';
import { PageComponent } from './components/page/page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'page', component: PageComponent },
  { path: 'page/:id', component: PageComponent },
  { path: 'bad-request', component: BadRequestComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
