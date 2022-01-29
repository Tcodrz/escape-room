import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CacheService, LocalStorageKeys } from 'src/app/services/cache.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  time: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private teamService: TeamService,
    private cacheService: CacheService,
  ) { }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.time = params.time;
      localStorage.removeItem(LocalStorageKeys.Page);
      localStorage.removeItem(LocalStorageKeys.Timer);
    });
  }
}
