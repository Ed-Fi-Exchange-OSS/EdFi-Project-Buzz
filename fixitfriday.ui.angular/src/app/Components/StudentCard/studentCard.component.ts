import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-student-card',
  templateUrl: './studentCard.component.html',
  styleUrls: ['./studentCard.component.css']
})
export class StudentCardComponent {
    @Input() student: any;
    isCollapsed: boolean;
}
