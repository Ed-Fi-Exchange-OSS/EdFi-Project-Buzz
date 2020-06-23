import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-survey-analytics-card',
    templateUrl: './surveyAnalyticsCard.component.html',
    styleUrls: ['./surveyAnalyticsCard.component.css']
})
export class SurveyAnalyticsCardComponent {
    @Input() surveyAnalyticsData: any;
}