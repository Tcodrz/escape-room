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
  constructor(
    private activatedRoute: ActivatedRoute,
    private teamService: TeamService,
    private cacheService: CacheService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const page = this.cacheService.getItem<Page>(LocalStorageKeys.Page);
      const team = this.cacheService.getItem<Team>(LocalStorageKeys.Team);
      if (!!team) this.teamName.nativeElement.value = team.name;
      if (!!team && team.finished) this.router.navigate([`results/${team.finalTime}`]);
      if (!!page && page.id === params.pageID && !!team) this.router.navigate([`page/${params.pageID}`]);
      this.team = {
        pageID: params.pageID,
        id: '',
        name: '',
        finished: false,
        started: false,
      }
    });
  }
  onSubmit(teamName: string): void {
    if (!this.validate(teamName)) return;
    this.team.name = teamName;
    this.teamService.createTeam(this.team);
  }
  validate(teamName: string): boolean {
    if (!teamName || teamName === '') return false;
    else return true;
  }
}
