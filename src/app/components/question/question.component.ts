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
  @Input() questionNumber: number;
  @Input() totalQuestions: number;
  @Output() clueRecieved: EventEmitter<void> = new EventEmitter<void>();
  @Output() answerSuccess: EventEmitter<void> = new EventEmitter<void>();
  @Output() answerFail: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('answer', { static: false }) answerInput: ElementRef;
  message: string;
  messageColor: messageTypes;
  clueIndex = 0;
  clues: string[] = [];
  constructor() { }
  ngOnInit(): void { }
  onClueRequest(): void {
    if (this.question.hints[this.clueIndex]) {
      this.clues.push(this.question.hints[this.clueIndex]);
      this.clueRecieved.emit();
      this.clueIndex++;
      this.showMessage('נוספה דקה לשעון', 'warn');
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

