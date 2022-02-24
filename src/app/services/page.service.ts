import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { forkJoin, interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Page } from '../interface/page.interface';
import { Question } from '../interface/question.interface';
import { GotoService } from './goto.service';

const pagesHebrew = [
  'x5Xzc2UYBxxPT09k0Dwq',
  'G8r6AgGnsmifvOa3C7Us',
  '9STvkAn2nxn6gnqsVe5T',
];
const pagesArabic = [
  'xNwHtlWQdMkOcbx35zMX',
  'V2QjkfGFLOcetDLNRPIC',
  '3AzsAOnxJjG7gdUAVBYO',
];

@Injectable({
  providedIn: 'root'
})
export class PageService {
  private addedTime: number = 0;

  constructor(
    private db: AngularFirestore,
    private goto: GotoService,
  ) { }
  isHebrew(pageID: string): boolean {
    const isHebrew = pagesHebrew.includes(pageID);
    return isHebrew;
  }
  isArabic(pageID: string): boolean {
    const isArabic = pagesArabic.includes(pageID);
    return isArabic;
  }
  getPage(pageID: string): Observable<Page> {
    const pathHebrew = 'questions';
    const pathArabic = 'questions-arabic';
    const path = this.isHebrew(pageID) ? pathHebrew : pathArabic;
    return forkJoin([
      this.db.doc<Page>(`page/${pageID}`).get(),
      this.db.collection<Question>(path, ref => ref.orderBy('number')).get()
    ]).pipe(
      map(([pageDoc, questionsCollection]) => {
        const page: Page = { id: pageDoc.id, questions: [], name: pageDoc.data().name, code: pageDoc.data().code, language: pageDoc.data().language };
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

  getText(option: TextOptions, pageID: string): string {
    switch (option) {
      case TextOptions.Welcome: return this.getWelcome(pageID);
      case TextOptions.SubHeader: return this.getSubHeader(pageID);
      case TextOptions.Rules: return this.getRules(pageID);
      case TextOptions.YourCodeIs: return this.getYourCodeIs(pageID);
      case TextOptions.YourTimeIs: return this.getYourTimeIs(pageID);
      case TextOptions.ButtonSubmit: return this.getButtonSubmit(pageID);
      case TextOptions.WellDone: return this.getWellDone(pageID);
      case TextOptions.HintWithExtra: return this.getHintWithExtra(pageID);
      case TextOptions.Hint: return this.getHint(pageID);
      case TextOptions.Start: return this.getStart(pageID);
      case TextOptions.Enter: return this.getEnter(pageID);
      case TextOptions.InsertTeamName: return this.getInsertTeamName(pageID);
    }
  }
  getInsertTeamName(pageID: string): string {
    const arabic = 'أدخل اسم مجموعتك';
    const hebrew = 'הכניסו את שם הקבוצה שלכם';
    return this.isHebrew(pageID) ? hebrew : arabic;
  }
  getEnter(pageID: string): string {
    const hebrew = 'כניסה';
    const arabic = 'مدخل';
    return this.isHebrew(pageID) ? hebrew : arabic;
  }
  getStart(pageID: string): string {
    const hebrew = 'התחלה';
    const arabic = 'بدايه';
    return this.isHebrew(pageID) ? hebrew : arabic;
  }
  getWelcome(pageID: string): string {
    const welcomeHebrew = 'ברוכים הבאים';
    const welcomeArabic = 'اهلا وسهلا';
    return this.isHebrew(pageID) ? welcomeHebrew : welcomeArabic;
  }
  getSubHeader(pageID: string): string {
    const subHebrew = 'להלן חוקי המשחק:';
    const subArabic = 'قواعد اللعبة:';
    return this.isHebrew(pageID) ? subHebrew : subArabic;
  }
  getRules(pageID: string): string {
    const rulesHebrew = `
      עליכם לענות על כל השאלות בזמן הקצר ביותר/
      מרגע שתתחילו לשחק השעון יתחיל לרוץ ויספור את הזמן שלכם/
      תוכלו לבקש רמזים ע"י לחיצה על "?"/
      כל בקשה לרמז תוסיף זמן לשעון שלכם/
      אם תכניסו תשובה לא נכונה יתווספו שתי דקות לשעון שלכם/
      לחצו על התחלה כדי להתחיל לשחק/
      בהצלחה!`
    const rulesArabic = `
      عليك الإجابة على جميع الأسئلة بأقصر وقت ممكن/
	    في حين بدء اللعب، ستبدأ الساعة بالجري وحساب وقتك/
	    يمكنك طلب أدلة من خلال النقر على "؟"/
      كل طلب للحصول على دليل سيضيف الوقت لساعتك/
      في حال أدخال إجابة غير صحيحة، ستتم إضافة دقيقتين لساعتك/
      أنقر على زر أبدأ لبدأ اللعبة/
	    بالنجاح/`
    return this.isHebrew(pageID) ? rulesHebrew : rulesArabic;
  }
  getWellDone(pageID: string): string {
    const wellDoneHebre = 'כל הכבוד';
    const wellDoneArabic = 'كل الاحترام';
    return this.isHebrew(pageID) ? wellDoneHebre : wellDoneArabic;
  }
  getYourCodeIs(pageID: string): string {
    const hebrew = 'הקוד למנעול הוא';
    const arabic = 'رمز القفل هو';
    return this.isHebrew(pageID) ? hebrew : arabic;
  }
  getYourTimeIs(pageID: string) {
    const hebrew = 'הזמן שלכם הוא';
    const arabic = 'وقتك هو';
    return this.isHebrew(pageID) ? hebrew : arabic;
  }
  getButtonSubmit(pageID: string) {
    const hebrew = 'שליחת תשובה';
    const arabic = 'إرسال الإجابة';
    return this.isHebrew(pageID) ? hebrew : arabic;
  }
  getHintWithExtra(pageID: string) {
    const hebrew = 'רמז זה הוא הבהרה 3+ דקות';
    const arabic = 'هذا الدليل هو توضيح+3 دقائق';
    return this.isHebrew(pageID) ? hebrew : arabic;
  }
  getHint(pageID: string) {
    const hebrew = 'רמז';
    const arabic = '';
    return this.isHebrew(pageID) ? hebrew : arabic;
  }

}


export enum TextOptions {
  Welcome,
  SubHeader,
  Rules,
  WellDone,
  YourCodeIs,
  YourTimeIs,
  ButtonSubmit,
  Hint,
  HintWithExtra,
  Start,
  Enter,
  InsertTeamName,
}
