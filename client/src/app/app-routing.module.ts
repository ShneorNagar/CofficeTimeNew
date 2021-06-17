import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PreferencesComponent} from "./components/user-registration/user-preferences/user-preferences.component";
import {UserResponseComponent} from "./components/user-response/user-response.component";
import {HomeComponent} from "./components/main/home/home.component";

const routes: Routes = [
  {path: 'home', pathMatch: 'full', component: HomeComponent},
  {path: 'preference', pathMatch: 'full', component: PreferencesComponent},
  {path: 'reaction', pathMatch: 'full', component: UserResponseComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: '**', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
