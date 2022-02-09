import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GotoService {

  constructor(
    private router: Router
  ) { }
  private Go(route: string): void { this.router.navigate([route]); }
  Login(pageID: string): void { this.Go(`login/${pageID}`); }
  Results(time: string): void { this.Go(`results/${time}`); }
  Page(pageID: string): void { this.Go(`page/${pageID}`); }
  BadRequest(): void { this.Go('bad-request'); }
}
