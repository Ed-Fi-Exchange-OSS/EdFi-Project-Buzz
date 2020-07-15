import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-survey-card',
    templateUrl: './surveyCard.component.html',
    styleUrls: ['./surveyCard.component.css']
})
export class SurveyCardComponent {
    @Input() surveyResult: any;
    isCollapsed = true;
}
