import { Component, Input } from '@angular/core';
import { ContactPerson } from 'src/app/Models';

@Component({
    selector: 'app-guardian-card',
    templateUrl: './guardianCard.component.html',
    styleUrls: ['./guardianCard.component.css']
})
export class GuardianCardComponent {
    @Input() contact: ContactPerson;
}