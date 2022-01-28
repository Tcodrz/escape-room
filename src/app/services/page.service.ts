import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable, forkJoin, interval } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Question } from '../interface/question.interface';
import { Page } from '../interface/page.interface';


interface PageDocument {
  number: number;
  questions: string[];

}

@Injectable({
  providedIn: 'root'
})
export class PageService {
  addedTime: number = 0;

  constructor(
    private db: AngularFirestore,
    private router: Router,
  ) { }
  getPage(id: string): Observable<Page> {
    return forkJoin([
      this.db.doc<PageDocument>(`page/${id}`).get(),
      this.db.collection<Question>(`questions`).get()
    ]).pipe(
      map(([pageDoc, questionsCollection]) => {
        const page: Page = { id: pageDoc.id, questions: [], number: pageDoc.data().number, finalTime: '' };
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
  addTime(seconds: number): void {
    this.addedTime += seconds;
  }
  gotoErrorPage(): void {
    this.router.navigate(['bad-request']);
  }
  gotoResultsPage(time: string): void {
    this.router.navigate([`results/${time}`]);
  }
}
