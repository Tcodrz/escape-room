import { PageService } from './../../services/page.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Page } from 'src/app/interface/page.interface';
import { CacheService, LocalStorageKeys } from 'src/app/services/cache.service';
import { TeamService } from 'src/app/services/team.service';
import { TextOptions } from 'src/app/services/page.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  time: string;
  code: string;
  page: Page;
  wellDone: string;
  yourCodeIs: string;
  yourTimeIs: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private pageService: PageService,
    private cacheService: CacheService,
  ) { }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.time = params.time;
      this.page = this.cacheService.getItem<Page>(LocalStorageKeys.Page);
      this.code = this.page.code;
      localStorage.removeItem(LocalStorageKeys.Timer);
      this.initText();
    });
  }
  initText() {
    this.wellDone = this.pageService.getText(TextOptions.WellDone, this.page.id)
    this.yourCodeIs = this.pageService.getText(TextOptions.YourCodeIs, this.page.id);
    this.yourTimeIs = this.pageService.getText(TextOptions.YourTimeIs, this.page.id);
  }
}
