import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { forkJoin, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface User {
  name: string;
}
export interface Page {
  number: number;
  questions: Question[];
}
export interface Question {
  q: string;
  a: string;
  hints: string[];
  pageID: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'escape-room';
  users$: Observable<User[]>;
  pages$: Observable<Page[]>;
  constructor(
    private db: AngularFirestore
  ) { }
  ngOnInit(): void {
    // this.db.collection('users').get().subscribe(res => {
    //   res.forEach(x => console.log(x.data()));
    // });
    this.users$ = this.db.collection('users').valueChanges()
      .pipe(
        map(docs => docs as User[])
      );
    // this.db.collection('page').get().subscribe(x => console.log(x.forEach(d => console.log(d.data()))));
    // this.pages$ = this.db.collection('page').valueChanges()
    //   .pipe(
    //     map(pages => pages.map(page =>
    //       ({...pages, questions: (page as Page).questions.map(q => (q['path'] as string))})
    //       )
    //       ),
    //     map(pages => pages as Page[]),
    //   );
    // map(pages => pages.map(page =>
    //   page.questions.map(q => q['id'])
    // ))
    this.pages$ = forkJoin([
      this.db.collection('page').get(),
      this.db.collectionGroup('questions').get()
    ]).pipe(
      map(([pages, questions]) => {
        const aQuestions = [];
        const aPages = [];
        questions.forEach(q => aQuestions.push(q.data()));
        pages.forEach(page => aPages.push({ id: page.id, }));
        pages.forEach(page => {
          aPages.forEach(p => {
            if (p.id === page.id) {
              const data = page.data() as Page;
              p = { ...p, ...data };
            }
          });
        });
        aQuestions.forEach(q => {
          aPages.forEach(p => {
            if (!p.questions) p.questions = [];
            if (q.pageID === p.id) p.questions.push(q);
          })
        });
        return aPages;
      }));
  }
}
