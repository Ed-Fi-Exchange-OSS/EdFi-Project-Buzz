import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-guardian-card',
    templateUrl: './guardianCard.component.html',
    styleUrls: ['./guardianCard.component.css']
})
export class GuardianCardComponent {
    @Input() guardian: any;
}