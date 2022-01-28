import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Team } from '../interface/team.interface';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private readonly team$: BehaviorSubject<Team> = new BehaviorSubject({
    id: '',
    name: '',
    pageID: '',
    finished: false,
  });
  constructor(
    private db: AngularFirestore,
    private router: Router,
  ) { }
  createTeam(team: Team): void {
    this.db.collection(`teams`).add(team).then(res => {
      team.id = res.id;
      this.setTeam(team);
      this.goToPage();
    });
  }
  setTeam(team: Team): void {
    this.team$.next(team);
    this.db.doc(`teams/${team.id}`).set(team);
  }
  getTeam(): Observable<Team> { return this.team$.asObservable(); }
  goToPage(): void {
    const team = this.team$.getValue();
    this.router.navigate([`page/${team.pageID}`]);
  }
  updateTeam(changes: Partial<Team>): void {
    const team = { ...this.team$.getValue(), ...changes };
    this.setTeam(team);
  }
}
