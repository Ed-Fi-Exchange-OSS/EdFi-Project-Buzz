import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-sibling-card',
    templateUrl: './siblingCard.component.html',
    styleUrls: ['./siblingCard.component.css']
})
export class SiblingCardComponent {
    @Input() sibling: any;
}
