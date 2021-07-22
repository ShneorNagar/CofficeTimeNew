import {BrowserModule} from '@angular/platform-browser';
import {ButtonModule} from 'primeng/button';
import {NgModule} from '@angular/core';


import {AppRoutingModule} from './app-routing.module';
import {InputTextareaModule} from "primeng/inputtextarea";
import {InputTextModule} from "primeng/inputtext";
import {RippleModule} from "primeng/ripple";
import {SelectButtonModule} from "primeng/selectbutton";
import {DialogService, DynamicDialogModule} from "primeng/dynamicdialog";
import {ToastModule} from "primeng/toast";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ConfirmationService, MessageService} from "primeng/api";
import {ChartModule} from "primeng/chart";
import {MenuModule} from 'primeng/menu';
import {DropdownModule} from 'primeng/dropdown';

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {ServiceWorkerModule,} from '@angular/service-worker';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

import {UserDataComponent} from './components/user-registration/user-data/user-data.component';
import {PreferencesComponent} from './components/user-registration/user-preferences/user-preferences.component';
import {HeaderComponent} from './components/header/header.component';
import {UserEditComponent} from './components/user-registration/user-edit/user-edit.component';
import {AppComponent} from './app.component';
import {OrdersService} from "./services/orders.service";
import {WebSocketService} from "./services/web-socket/web-socket.service";
import {HomeComponent} from './components/home/home.component';
import {HomeFlipDirective} from './components/home/home-flip.directive';
import {ChartComponent} from './components/chart/chart.component';
import {TooltipModule} from "primeng/tooltip";
import {UserAvatarBannerComponent} from './components/user-avatar/user-avatar-banner.component';
import { UserAvatarComponent } from './components/user-registration/user-preferences/user-avatar/user-avatar.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { ChartUnitComponent } from './components/chart/chart-unit/chart-unit.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    UserDataComponent,
    PreferencesComponent,
    UserEditComponent,
    HomeComponent,
    HomeFlipDirective,
    ChartComponent,
    UserAvatarBannerComponent,
    UserAvatarComponent,
    NotificationsComponent,
    ChartUnitComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    RippleModule,
    DynamicDialogModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SelectButtonModule,
    FormsModule,
    ToastModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: true, registrationStrategy: 'registerImmediately'}),
    ConfirmDialogModule,
    ChartModule,
    MenuModule,
    TooltipModule,
    DropdownModule
  ],
  providers: [
    DialogService,
    MessageService,
    OrdersService,
    ConfirmationService,
    WebSocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
