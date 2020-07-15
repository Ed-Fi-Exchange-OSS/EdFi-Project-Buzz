import { Component } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  isClassRosterActive: boolean;
  isSurveyActive: boolean;

  constructor(router: Router) {
    router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.isClassRosterActive = event.url === '/app';
        this.isSurveyActive = event.url === '/app/surveyAnalytics2';
      }
    });

  }
}
