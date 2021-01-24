import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AdminmapComponent} from './adminmap.component';
import {NgxMapboxGLModule} from 'ngx-mapbox-gl';
import {MatFormFieldModule, MatListModule, MatSelectModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';



@NgModule({
  declarations: [AdminmapComponent],
  imports: [
    CommonModule,
    NgxMapboxGLModule.withConfig({
      accessToken: 'pk.eyJ1IjoiZ2d3cHMiLCJhIjoiY2s5YW04dThsMDl0NDNtcDdyZWk3b253NSJ9.mIbaAxPPsbYWNJJcKyXAMA',
    }),
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
  ],
  exports: [AdminmapComponent]
})
export class AdminMapModule { }
