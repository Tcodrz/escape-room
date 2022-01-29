import { Injectable } from '@angular/core';


export enum LocalStorageKeys {
  Team = 'esacpe-room_team',
  Page = 'escape-room_page',
  Timer = 'escape-room_timer',
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  constructor() { }
  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
  getItem<T>(key: string): T | null {
    return JSON.parse(localStorage.getItem(key));
  }
  clear(): void {
    localStorage.clear();
  }
}
