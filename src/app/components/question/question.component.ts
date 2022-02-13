import { Page } from './../../interface/page.interface';
import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Question } from 'src/app/interface/question.interface';
type messageTypes = 'warn' | 'success' | 'info';
@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  @Input() question: Question;
  @Input() page: Page;
  @Input() questionNumber: number;
  @Input() totalQuestions: number;
  @Output() clueRecieved: EventEmitter<number> = new EventEmitter<number>();
  @Output() answerSuccess: EventEmitter<void> = new EventEmitter<void>();
  @Output() answerFail: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('answer', { static: false }) answerInput: ElementRef;
  message: string;
  messageColor: messageTypes;
  showHint: boolean;
  showImageClue: boolean;
  showHintExtra: boolean
  constructor() { }
  ngOnInit(): void {
    this.showHintExtra = this.page.name === 'boxSmall' && this.question.number === 2;
  }
  onClueRequest(): void {
    this.showImageClue = this.page.name === 'boxSmall' && this.question.number === 2;
    if (this.question.hint && !this.showHint) {
      this.showHint = true;
      const penalty = this.question.hint.penalty;
      this.clueRecieved.emit(this.question.hint.penalty);
      this.showMessage(`נוספו ${penalty} דקות לשעון`, 'warn');
    } else {
      // show message 'NO MORE CLUES...'
    }
  }
  onSubmit(answer: string): void {
    if (this.question.a === answer) {
      this.showMessage('תשובה נכונה!', 'success');
      setTimeout(() => {
        this.answerSuccess.emit();
      }, 1000);
    } else {
      this.answerFail.emit();
      this.showMessage('תשובה לא נכונה, נוספו 2 דקות לשעון', 'warn');
    }
  }
  showMessage(message: string, color: messageTypes): void {
    this.message = message;
    this.messageColor = color;
    setTimeout(() => {
      this.message = undefined;
    }, 2500);

  }
}

