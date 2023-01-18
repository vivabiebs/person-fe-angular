import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePersonComponent } from './components/person/create-person/create-person.component';
import { PersonComponent } from './components/person/person.component';
import { PersonsComponent } from './components/persons/persons.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/persons', pathMatch: 'full' },
  {
    path: 'persons',
    component: PersonsComponent,
  },
  {
    path: 'person',
    component: PersonComponent,
    children: [
      { path: 'create', component: CreatePersonComponent },
      { path: 'edit/:id', component: CreatePersonComponent },
      { path: 'view/:id', component: CreatePersonComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { enableTracing: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
