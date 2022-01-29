import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Team } from 'src/app/interface/team.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  teams$: Observable<Team[]>;
  constructor(
    private db: AngularFirestore,
  ) { }

  ngOnInit(): void {
    this.teams$ = this.db.collection<Team>('teams').valueChanges();
  }

}
