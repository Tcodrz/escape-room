import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Team } from '../interface/team.interface';
import { CacheService, LocalStorageKeys } from './cache.service';
import firebase from 'firebase/app'
import TimeStamp = firebase.firestore.Timestamp;

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private readonly team$: BehaviorSubject<Team> = new BehaviorSubject({
    id: '',
    name: '',
    pageID: '',
    finished: false,
    started: false,
  });
  constructor(
    private db: AngularFirestore,
    private router: Router,
    private cacheService: CacheService,
  ) { }
  createTeam(team: Team): void {
    this.db.collection(`teams`).add(team).then(res => {
      team.id = res.id;
      this.setTeam(team, true);
      this.goToPage();
    });
  }
  setTeam(team: Team, withCache: boolean): void {
    this.team$.next(team);
    if (withCache) this.updateCache();
    if (team.finished) {
      const timestamp = TimeStamp.fromDate(new Date(team.finishedAt));
      const t = { ...team, finishedAt: timestamp };
      this.db.doc(`teams/${team.id}`).set(t);
    } else
      this.db.doc(`teams/${team.id}`).set(team);
  }
  getTeam(): Observable<Team> { return this.team$.asObservable(); }
  goToPage(): void {
    const team = this.team$.getValue();
    this.router.navigate([`page/${team.pageID}`]);
  }
  updateTeam(changes: Partial<Team>, withCache: boolean): void {
    const team = { ...this.team$.getValue(), ...changes };
    this.setTeam(team, withCache);
  }
  private updateCache(): void {
    const team = this.team$.getValue();
    this.cacheService.setItem(LocalStorageKeys.Team, team);
  }
}
