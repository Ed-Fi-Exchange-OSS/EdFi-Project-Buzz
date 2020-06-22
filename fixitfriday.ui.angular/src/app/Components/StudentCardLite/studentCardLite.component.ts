import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-student-card-lite',
    templateUrl: './studentCardLite.component.html',
    styleUrls: ['./studentCardLite.component.css']
})
export class StudentCardLiteComponent {
    @Input() student: any;
}