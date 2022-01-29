import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Page } from 'src/app/interface/page.interface';
import { PageService } from './../../services/page.service';
import { CacheService, LocalStorageKeys } from 'src/app/services/cache.service';
import { Team } from 'src/app/interface/team.interface';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit, OnDestroy {
  team: Team;
  page: Page;
  timer: string = '00:00';
  isLoading = true;
  gameStart = false;
  timerSub: Subscription;
  constructor(
    private activatedRoutes: ActivatedRoute,
    private pageService: PageService,
    private teamService: TeamService,
    private cacheService: CacheService,
    private router: Router,
  ) { }
  ngOnInit(): void {
    const page = this.cacheService.getItem<Page>(LocalStorageKeys.Page);
    if (!!page) this.page = page;
    const cachedTeam = this.cacheService.getItem<Team>(LocalStorageKeys.Team);
    if (!!cachedTeam) this.teamService.setTeam(cachedTeam, false);
    this.teamService.getTeam().subscribe(team => {
      this.team = team;
      if (!!team && team.finished) this.router.navigate([`results/${team.finalTime}`]);
      else {
        if (this.page && team.started) this.continueGame();
        else this.startNewGame();
      }
    })
  }
  ngOnDestroy(): void {
    if (!!this.timerSub && !this.timerSub.closed) this.timerSub.unsubscribe();
  }
  startNewGame(): void {
    this.activatedRoutes.params.subscribe(params => {
      if (params.id) {
        this.pageService.getPage(params.id).subscribe(page => {
          this.page = page;
          this.updateCache();
          this.isLoading = false;
        });
      } else {
        this.pageService.gotoErrorPage();
      }
    });
  }
  continueGame(): void {
    this.page = this.cacheService.getItem<Page>(LocalStorageKeys.Page);
    let timer = this.cacheService.getItem<string>(LocalStorageKeys.Timer)
    let cacheTime;
    let time;
    if (!!timer) {
      const cacheMinutes = +timer.split(':')[0];
      const cacheSeconds = +timer.split(':')[1];
      cacheTime = (cacheMinutes * 60) + cacheSeconds;
    }
    if (!!this.team.time) {
      const minutes = +this.team.time.split(':')[0];
      const seconds = +this.team.time.split(':')[1];
      time = (minutes * 60) + seconds;
    }
    if (!!time || !!cacheTime) {
      this.pageService.setAddedTime(time >= cacheTime ? time : cacheTime);
    }
    if (this.team.started) {
      this.timerStart();
      this.gameStart = true;
    }
    this.isLoading = false;
  }
  onStart(): void {
    this.team = { ...this.team, started: true, currentQuestion: 0, totalQuestions: this.page.questions.length };
    this.teamService.updateTeam(this.team, true);
    this.pageService.setAddedTime(0);
    this.timerStart();
    this.updateCache();
    this.gameStart = true;
  }
  timerStart(): void {
    if (!!this.timerSub) this.timerSub.unsubscribe();
    this.timerSub = this.pageService.getTimer().subscribe((time) => {
      this.cacheService.setItem(LocalStorageKeys.Timer, time);
      this.team = { ...this.team, time: time };
      this.timer = time;
    });
  }
  onAddTime(seconds: number): void { this.pageService.addTime(seconds); }
  onGameOver(): void {
    this.timerSub.unsubscribe();
    this.gameStart = false;
    this.teamService.updateTeam({ finalTime: this.timer, finished: true, finishedAt: new Date() }, true);
    this.pageService.gotoResultsPage(this.timer);
  }
  onAnswerSuccess(): void {
    this.team.currentQuestion++;
    this.team = { ...this.team, currentQuestion: this.team.currentQuestion };
    this.teamService.updateTeam(this.team, true);
    this.updateCache();
    if (this.page.questions.length === this.team.currentQuestion) {
      this.onGameOver();
    }
  }
  updateCache(): void {
    this.cacheService.setItem(LocalStorageKeys.Page, this.page);
  }
}
