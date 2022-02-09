import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { forkJoin, interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Page } from '../interface/page.interface';
import { Question } from '../interface/question.interface';
import { GotoService } from './goto.service';


interface PageDocument {
  number: number;
  questions: string[];
}

@Injectable({
  providedIn: 'root'
})
export class PageService {
  private addedTime: number = 0;

  constructor(
    private db: AngularFirestore,
    private goto: GotoService,
  ) { }
  getPage(id: string): Observable<Page> {
    return forkJoin([
      this.db.doc<PageDocument>(`page/${id}`).get(),
      this.db.collection<Question>(`questions`).get()
    ]).pipe(
      map(([pageDoc, questionsCollection]) => {
        const page: Page = { id: pageDoc.id, questions: [], number: pageDoc.data().number };
        questionsCollection.forEach(questionDoc => {
          const question: Question = { id: questionDoc.id, ...questionDoc.data() };
          if (question.pageID === page.id) page.questions.push(question);
        });
        return page;
      })
    );
  }
  getTimer(): Observable<string> {
    const timer = interval(1000);
    return timer.pipe(map(time => {
      time = time + this.addedTime;
      const minutes = Math.floor(time / 60);
      const seconds = time - (minutes * 60);
      const timeString = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
      return timeString;
    }));
  }
  setAddedTime(time: number): void { this.addedTime = time; }
  addTime(seconds: number): void { this.addedTime += seconds; }
  gotoErrorPage(): void { this.goto.BadRequest(); }
  gotoResultsPage(time: string): void { this.goto.Results(time); }
}
