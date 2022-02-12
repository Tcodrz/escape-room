import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Team } from 'src/app/interface/team.interface';
import { CacheService, LocalStorageKeys } from 'src/app/services/cache.service';
import { TeamService } from 'src/app/services/team.service';
import { GotoService } from '../../services/goto.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('teamName', { static: true }) teamName: ElementRef;
  team: Team;
  isSubmiting: boolean;
  message: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private teamService: TeamService,
    private cacheService: CacheService,
    private goTo: GotoService,
  ) { }

  ngOnInit(): void {
    this.isSubmiting = false;
    this.activatedRoute.params.subscribe(params => {
      this.team = this.initTeam(params.pageID);
      const teamInCache = this.cacheService.getItem<Team>(LocalStorageKeys.Team);
      if (!!teamInCache) {
        const cooldownTime = 1; // how much time the user should stay locked out from the game in minutes
        const cooldownMs = cooldownTime * 60 * 1000; // total cooldown time in milliseconds
        const now = new Date().getTime();
        const timeFinished = new Date(teamInCache.finishedAt).getTime();
        const timePasssedFromLastGame = now - timeFinished;
        const enableNewGame = timePasssedFromLastGame >= cooldownMs;
        if (teamInCache.finished) {
          if (enableNewGame) {
            this.cacheService.clear();
            this.goTo.Login(teamInCache.pageID);
          } else { this.goTo.Results(teamInCache.finalTime); }
        } else { this.goTo.Page(teamInCache.pageID); }
      }
    });
  }
  onSubmit(teamName: string): void {
    this.isSubmiting = true;
    this.message = undefined;
    this.teamService.isAvailable(teamName).subscribe(isAvailable => {
      if (isAvailable && this.validate(teamName)) {
        this.team.name = teamName;
        this.teamService.createTeam(this.team);
      } else {
        this.message = 'שם קבוצה תפוס או לא חוקי, נסו שם אחר'
        this.isSubmiting = false;
      }
    });

  }
  validate(teamName: string): boolean {
    if (!teamName || teamName === '') return false;
    else return true;
  }
  private initTeam(pageID: string): Team {
    const team = {
      pageID: pageID,
      id: '',
      name: '',
      finished: false,
      started: false,
    }
    return team;
  }
}
