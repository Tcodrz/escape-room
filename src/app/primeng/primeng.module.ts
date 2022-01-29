import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    MenuModule,
    MessagesModule,
    MessageModule,
  ],
  exports: [
    CardModule,
    ButtonModule,
    InputTextModule,
    MenuModule,
    MessagesModule,
    MessageModule,
  ]
})
export class PrimengModule { }
