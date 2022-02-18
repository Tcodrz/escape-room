import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Page } from 'src/app/interface/page.interface';
import { Team } from 'src/app/interface/team.interface';
import { CacheService, LocalStorageKeys } from 'src/app/services/cache.service';
import { GotoService } from 'src/app/services/goto.service';
import { TeamService } from 'src/app/services/team.service';
import { PageService } from './../../services/page.service';

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
    private goTo: GotoService,
  ) { }
  ngOnInit(): void {
    const pageInCache = this.cacheService.getItem<Page>(LocalStorageKeys.Page);
    const teamInCache = this.cacheService.getItem<Team>(LocalStorageKeys.Team);
    if (teamInCache) this.teamService.setTeam(teamInCache, false);
    else this.goTo.BadRequest();
    if (pageInCache) this.page = pageInCache;
    this.teamService.getTeam().subscribe((team: Team) => {
      this.team = team;
      const teamFinished = !!team && team.finished;
      const teamStarted = this.page && team.started;
      if (teamFinished) this.goTo.Results(team.finalTime);
      else if (teamStarted) this.continueGame();
      else this.startNewGame();
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
      } else { this.pageService.gotoErrorPage(); }
    });
  }
  onStart(): void { // start new game on user click
    this.team = { ...this.team, started: true, currentQuestion: 0, totalQuestions: this.page.questions.length };
    this.teamService.updateTeam(this.team, true);
    this.pageService.setAddedTime(0);
    this.timerStart();
    this.updateCache();
    this.gameStart = true;
  }
  onAddTime(minutes: number): void {
    const seconds = minutes * 60;
    this.pageService.addTime(seconds);
  }
  onAnswerSuccess(): void {
    this.team.currentQuestion++;
    this.team = { ...this.team, currentQuestion: this.team.currentQuestion }; // ?? check if neccessary
    this.teamService.updateTeam(this.team, true);
    this.updateCache();
    if (this.page.questions.length === this.team.currentQuestion) { this.onGameOver(); }
  }
  private continueGame(): void {
    const timerInCache = this.cacheService.getItem<{ time: string; timestamp: number }>(LocalStorageKeys.Timer)
    const timer = timerInCache || this.team.timer;
    let time: number;
    let timeDiffSec = 0; // time past from user disconnected in seconds
    if (timer) {
      const now = new Date().getTime();
      const timestamp = timer.timestamp;
      timeDiffSec = Math.floor((now - timestamp) / 1000);
      const parts = timer.time.split(':');
      const minutes = +parts[0];
      const seconds = +parts[1];
      time = (minutes * 60) + seconds;
    }
    const reloadTimeSec = 2 // 2 seconds penalty for reload
    const bufferInSeconds = reloadTimeSec + timeDiffSec;
    if (!!time) {
      this.pageService.setAddedTime(bufferInSeconds + time);
      this.updateCache();
    }
    if (this.team.started) {
      this.timerStart();
      this.gameStart = true;
    }
    this.isLoading = false;
  }
  private timerStart(): void {
    if (!!this.timerSub) this.timerSub.unsubscribe();
    this.timerSub = this.pageService.getTimer().subscribe((time) => {
      const timer = { time: time, timestamp: new Date().getTime() };
      this.cacheService.setItem(LocalStorageKeys.Timer, timer);
      this.team = { ...this.team, timer: timer };
      this.timer = time;
    });
  }
  private onGameOver(): void {
    this.timerSub.unsubscribe();
    this.gameStart = false;
    this.teamService.updateTeam({ finalTime: this.timer, finished: true, finishedAt: new Date() }, true);
    this.goTo.Results(this.timer);
  }
  private updateCache(): void { this.cacheService.setItem(LocalStorageKeys.Page, this.page); }
}
