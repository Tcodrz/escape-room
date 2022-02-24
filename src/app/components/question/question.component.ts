import { PageService, TextOptions } from './../../services/page.service';
import { Page } from './../../interface/page.interface';
import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Question } from 'src/app/interface/question.interface';
type messageTypes = 'warn' | 'success' | 'info';
export enum PageNames {
  Small = 'boxSmall',
  Medium = 'boxMedium',
  Big = 'boxBig',
};
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
  showHintExtra: boolean;
  hint: string;
  btnText: string;
  hintWithExtra: string;
  hintWithPenalty: string;
  constructor(
    private pageService: PageService,
  ) { }
  ngOnInit(): void {
    const isHebrew = this.pageService.isHebrew(this.page.id);
    this.initText();
    this.showHintExtra = this.page.name === 'boxSmall' && this.question.number === 2;
    if (this.question.hint) {
      // const hintWithExtra = this.question.hint?.extra + ' ' + this.question.hint.penalty + '+דקות';
      const hintWithPenalty = this.question.hint.penalty;
      this.hint = this.showHintExtra ? this.hintWithExtra : this.hintWithPenalty + '+' + hintWithPenalty;
    }
  }
  initText() {
    this.btnText = this.pageService.getText(TextOptions.ButtonSubmit, this.page.id);
    this.hintWithExtra = this.pageService.getText(TextOptions.HintWithExtra, this.page.id);
    this.hintWithPenalty = this.pageService.getText(TextOptions.Hint, this.page.id);
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

