import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Team } from 'src/app/interface/team.interface';
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
  ) { }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.time = params.time;
      this.teamService.updateTeam({
        finished: true,
        finalTime: this.time,
      });
    });
  }
}
