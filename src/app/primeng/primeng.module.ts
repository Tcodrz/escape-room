import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@NgModule({
  declarations: [],
  imports: [
    ButtonModule,
    CardModule,
    CommonModule,
    InputTextModule,
    MenuModule,
    MessageModule,
    MessagesModule,
    ProgressSpinnerModule,
  ],
  exports: [
    ButtonModule,
    CardModule,
    InputTextModule,
    MenuModule,
    MessageModule,
    MessagesModule,
    ProgressSpinnerModule
  ]
})
export class PrimengModule { }
