import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Question } from 'src/app/interface/question.interface';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  @Input() question: Question;
  @Input() questionNumber: number;
  @Output() clueRecieved: EventEmitter<void> = new EventEmitter<void>();
  @Output() answerSuccess: EventEmitter<void> = new EventEmitter<void>();
  @Output() answerFail: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('answer', { static: false }) answerInput: ElementRef;
  clueIndex = 0;
  clues: string[] = [];
  constructor() { }
  ngOnInit(): void { }
  onClueRequest(): void {
    if (this.question.hints[this.clueIndex]) {
      this.clues.push(this.question.hints[this.clueIndex]);
      this.clueRecieved.emit();
      this.clueIndex++;
      setTimeout(() => {
        this.answerInput.nativeElement.focus();
      }, 300);
    } else {
      // show message 'NO MORE CLUES...'
    }
  }
  onSubmit(answer: string): void {
    if (this.question.a === answer) {
      this.answerSuccess.emit();
    } else {
      this.answerFail.emit();
    }
  }
}

