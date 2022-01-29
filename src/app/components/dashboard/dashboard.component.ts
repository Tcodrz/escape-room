import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MenuItem } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { Team } from 'src/app/interface/team.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  teams$: Observable<Team[]>;
  menuItems: MenuItem[];
  teams: Team[];
  sub: Subscription;
  constructor(
    private db: AngularFirestore,
  ) { }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngOnInit(): void {
    this.teams$ = this.db.collection<Team>('teams').valueChanges();
    this.sub = this.teams$.subscribe(teams => this.teams = teams)
    this.menuItems = [
      {
        label: 'איפוס משחק',
        icon: 'pi pi-replay',
        command: () => {
          this.resetGame();
        }
      }
    ]
  }

  resetGame(): void {
    this.teams.forEach(async (team) => {
      await this.db.doc(`teams/${team.id}`).delete();
    });
  }

}
