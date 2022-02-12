import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Team } from '../interface/team.interface';
import { CacheService, LocalStorageKeys } from './cache.service';
import { GotoService } from './goto.service';
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
    private goto: GotoService,
    private cacheService: CacheService,
  ) { }
  createTeam(team: Team): void {
    this.db.collection(`teams`).add(team).then(res => {
      team.id = res.id;
      this.setTeam(team, true);
      this.cacheService.setItem(LocalStorageKeys.Team, team);
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
    this.goto.Page(team.pageID);
  }
  updateTeam(changes: Partial<Team>, withCache: boolean): void {
    const team = { ...this.team$.getValue(), ...changes };
    this.setTeam(team, withCache);
  }
  isAvailable(teamName: string): Observable<boolean> {
    return this.db.collection<Team>('teams').get().pipe(
      map(teams => {
        const teamNames: string[] = [];
        teams.forEach(team => {
          const tName = team.data().name;
          teamNames.push(tName);
        });
        return !teamNames.includes(teamName);
      }));
  }
  private updateCache(): void {
    const team = this.team$.getValue();
    this.cacheService.setItem(LocalStorageKeys.Team, team);
  }
}
