import { TextOptions } from 'src/app/services/page.service';
import { PageService } from './../../services/page.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  team: Team;
  isSubmiting: boolean;
  message: string;
  isLoading: boolean;
  welcome: string;
  enter: string;
  enterTeamName: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private teamService: TeamService,
    private cacheService: CacheService,
    private pageService: PageService,
    private goTo: GotoService,
  ) { }

  ngOnInit(): void {
    // general login logic:
    // 1. no team in cache -> enable login
    // 2. team in cache ->
    //    a. if team doesnt exists in DB -> clear cache and enable login
    //    b. if team exists in DB continue
    // 3. team still in game -> continue game
    // 4. team finished game and logged in to same page -> go to results page if in cooldown, if not in cooldown clear cache and enable login
    // 5. team finished game and logged in to different page -> clear cache and enable login
    this.isSubmiting = false;
    this.isLoading = true;
    this.activatedRoute.params.subscribe(params => {
      this.initText(params.pageID);
      this.team = this.initTeam(params.pageID); // if no pageID in params user will be redirected to error-page from app-routing.module.ts
      const teamInCache = this.cacheService.getItem<Team>(LocalStorageKeys.Team);
      if (teamInCache) this.cacheReset(teamInCache, params.pageID);
      else this.isLoading = false;
    });
  }
  initText(pageID: any) {
    this.enter = this.pageService.getText(TextOptions.Enter, pageID);
    this.welcome = this.pageService.getText(TextOptions.Welcome, pageID);
    this.enterTeamName = this.pageService.getText(TextOptions.InsertTeamName, pageID);
  }
  cacheReset(team: Team, pageID: string) {
    this.teamService.getTeamByID(team.id).subscribe(t => {
      const teamExists = !!t.name;
      if (teamExists) this.loginValidation(t, pageID);
      else this.cacheService.clear();
      this.isLoading = false;
    });
  }
  loginValidation(team: Team, pageID: string) {
    const cooldownTime = 1; // how much time the user should stay locked out from the game in minutes
    const cooldownMs = cooldownTime * 60 * 1000; // total cooldown time in milliseconds
    const now = new Date().getTime();
    const timeFinished = new Date(team.finishedAt).getTime();
    const timePasssedFromLastGame = now - timeFinished;
    const enableNewGame = timePasssedFromLastGame >= cooldownMs;
    const differentPage = pageID !== team.pageID;
    if (team.finished) {
      if (enableNewGame || differentPage) { // timeout finished or different page - can start new game
        this.cacheService.clear();
        this.goTo.Login(pageID);
      } else { this.goTo.Results(team.finalTime); }
    } else { // if team did not finish -> continue game with current page
      this.goTo.Page(team.pageID);
    }
  }
  onSubmit(teamName: string): void {
    if (!teamName) {
      this.message = 'שם קבוצה לא יכול להיות ריק';
      return;
    }
    this.isSubmiting = true;
    this.message = undefined;
    this.teamService.isAvailable(teamName).subscribe(isAvailable => {
      if (isAvailable && this.validate(teamName)) {
        this.team.name = teamName;
        this.teamService.createTeam(this.team);
        // this.goTo.Page(this.team.pageID); // instead of calling it from the service
      } else {
        this.message = 'שם קבוצה תפוס או לא חוקי, נסו שם אחר'
        this.isSubmiting = false;
      }
    });

  }
  validate(teamName: string): boolean {
    return !!teamName && teamName !== '';
  }
  private initTeam(pageID: string): Team {
    const team: Team = {
      pageID: pageID,
      id: '',
      name: '',
      finished: false,
      started: false,
    }
    return team;
  }
}
