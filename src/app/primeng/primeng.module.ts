import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    InputTextModule,
  ],
  exports: [
    CardModule,
    ButtonModule,
    InputTextModule,
  ]
})
export class PrimengModule { }
