import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BookingComponent } from './booking/booking.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {
  MatButtonModule, MatCardModule,
  MatFormFieldModule,
  MatIconModule,
  MatListModule, MatPaginatorModule, MatProgressBarModule,
  MatSortModule,
  MatTableModule
} from '@angular/material';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {
  AgendaService,
  DayService,
  MonthAgendaService,
  MonthService, ScheduleModule,
  WeekService,
  WorkWeekService
} from '@syncfusion/ej2-angular-schedule';
import { ConfirmbookingComponent } from './confirmbooking/confirmbooking.component';
import { ThanksComponent } from './thanks/thanks.component';
import { AdminbookingComponent } from './adminbooking/adminbooking.component';
import {HttpClientModule} from '@angular/common/http';
import { AdminComponent } from './admin/admin.component';
import { AdminaddComponent } from './adminadd/adminadd.component';
import {
  AdminusersComponent,
  DialogDeleteComponent, DialogDeleteUserComponent,
  DialogOverviewExampleDialog
} from './adminusers/adminusers.component';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { CookieService } from 'ngx-cookie-service';
import { AdminmapComponent } from './adminmap/adminmap.component';
import { BookedComponent } from './booked/booked.component';
import { CoronaComponent } from './corona/corona.component';

@NgModule({
  declarations: [
    AppComponent,
    BookingComponent,
    ConfirmbookingComponent,
    ThanksComponent,
    AdminbookingComponent,
    AdminComponent,
    AdminaddComponent,
    AdminusersComponent,
    DialogOverviewExampleDialog,
    NotFoundPageComponent,
    AdminmapComponent,
    BookedComponent,
    CoronaComponent,
    DialogDeleteComponent,
    DialogDeleteUserComponent
  ],
  entryComponents: [DialogOverviewExampleDialog, DialogDeleteComponent, DialogDeleteUserComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgxMapboxGLModule.withConfig({
      accessToken: 'pk.eyJ1IjoiZ2d3cHMiLCJhIjoiY2s5YW04dThsMDl0NDNtcDdyZWk3b253NSJ9.mIbaAxPPsbYWNJJcKyXAMA',
    }),
    MatFormFieldModule,
    MatSliderModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    NgxMaterialTimepickerModule,
    ScheduleModule,
    HttpClientModule,
    MatListModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatCardModule,
    MatProgressBarModule,
  ],
  providers: [DayService,
    WeekService,
    WorkWeekService,
    MonthService,
    AgendaService,
    MonthAgendaService,
      CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
