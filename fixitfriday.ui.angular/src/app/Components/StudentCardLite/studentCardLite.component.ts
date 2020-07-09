import { Component, Input } from '@angular/core';
import {Student} from '../../Models/student';

@Component({
    selector: 'app-student-card-lite',
    templateUrl: './studentCardLite.component.html',
    styleUrls: ['./studentCardLite.component.css']
})
export class StudentCardLiteComponent {
    @Input() student: Student;
}
