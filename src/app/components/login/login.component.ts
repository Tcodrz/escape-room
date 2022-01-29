import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from 'src/app/interface/page.interface';
import { Team } from 'src/app/interface/team.interface';
import { CacheService, LocalStorageKeys } from 'src/app/services/cache.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('teamName', { static: true }) teamName: ElementRef;
  team: Team;
  isSubmiting: boolean;
  constructor(
    private activatedRoute: ActivatedRoute,
    private teamService: TeamService,
    private cacheService: CacheService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.isSubmiting = false;
    this.activatedRoute.params.subscribe(params => {
      const team = this.cacheService.getItem<Team>(LocalStorageKeys.Team);
      this.team = {
        pageID: params.pageID,
        id: '',
        name: '',
        finished: false,
        started: false,
      }
      if (!!team) {
        const cooldownTime = 1; // how much time the user should stay locked out from the game in minutes
        const cooldownMs = cooldownTime * 60 * 1000; // total cooldown time in milliseconds
        const now = new Date().getTime();
        const timeFinished = new Date(team.finishedAt).getTime();
        const timePasssed = now - timeFinished;
        if (timePasssed >= cooldownMs) {
          this.cacheService.clear();
          this.router.navigate([`login/${params.pageID}`]);
          return;
        }
        if (team.finished) this.router.navigate([`results/${team.finalTime}`]);
        else this.router.navigate([`page/${team.pageID}`]);
      }
    });
  }
  onSubmit(teamName: string): void {
    if (!this.validate(teamName)) return;
    this.isSubmiting = true;
    this.team.name = teamName;
    this.teamService.createTeam(this.team);
  }
  validate(teamName: string): boolean {
    if (!teamName || teamName === '') return false;
    else return true;
  }
}
