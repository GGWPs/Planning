import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BookingComponent} from './booking/booking.component';
import {ConfirmbookingComponent} from './confirmbooking/confirmbooking.component';
import {ThanksComponent} from './thanks/thanks.component';
import {AdminComponent} from './admin/admin.component';
import {NotFoundPageComponent} from './not-found-page/not-found-page.component';
import {BookedComponent} from './booked/booked.component';
import {CoronaComponent} from "./corona/corona.component";


const routes: Routes = [
    {path: 'booking', component: BookingComponent},
    {path: 'booking/:id', component: BookingComponent},
    {path: '',   redirectTo: '/NotFound', pathMatch: 'full'},
    {path: 'NotFound', component: NotFoundPageComponent},
    {path: 'confirmbooking', component: ConfirmbookingComponent},
    {path: 'thanks', component: ThanksComponent},
    {path: 'admin', component: AdminComponent},
    {path: 'booked', component: BookedComponent},
    {path: 'corona', component: CoronaComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
