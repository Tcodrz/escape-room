import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Page } from 'src/app/interface/page.interface';
import { PageService } from './../../services/page.service';



@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {
  page: Page;
  timer$: Observable<string> = of('00:00');
  isLoading = true;
  gameStart = false;
  currentQuestion: number = undefined;
  constructor(
    private activatedRoutes: ActivatedRoute,
    private pageService: PageService,
  ) { }

  ngOnInit(): void {
    this.activatedRoutes.params.subscribe(params => {
      if (params.id) {
        this.pageService.getPage(params.id).subscribe(page => {
          this.page = page;
          this.isLoading = false;
        });
      } else {
        this.pageService.gotoErrorPage();
      }
    });
  }
  onStart(): void {
    this.timer$ = this.pageService.getTimer();
    this.currentQuestion = 0;
    this.gameStart = true;
  }
  onAddTime(seconds: number): void { this.pageService.addTime(seconds); }
  onNextQuestion(): void {
    this.currentQuestion++;
    if (this.currentQuestion >= this.page.questions.length) this.onGameOver();
  }
  onGameOver(): void {
    this.timer$.subscribe(time => {
      this.page.finalTime = time;
    });
  }
}
