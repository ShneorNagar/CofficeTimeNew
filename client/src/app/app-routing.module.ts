import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {ChartComponent} from "./components/chart/chart.component";

const routes: Routes = [
  {path: 'home', pathMatch: 'full', component: HomeComponent},
  {path: 'chart', pathMatch: 'full', component: ChartComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: '**', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
