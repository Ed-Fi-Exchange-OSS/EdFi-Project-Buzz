// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-survey-analytics-card',
    templateUrl: './surveyAnalyticsCard.component.html',
    styleUrls: ['./surveyAnalyticsCard.component.css']
})
export class SurveyAnalyticsCardComponent {
    @Input() surveyAnalyticsData: any;
}
