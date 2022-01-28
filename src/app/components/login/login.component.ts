import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Team } from 'src/app/interface/team.interface';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  team: Team;
  constructor(
    private activatedRoute: ActivatedRoute,
    private db: AngularFirestore,
    private teamService: TeamService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.team = {
        pageID: params.pageID,
        id: '',
        name: '',
        finished: false,
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
