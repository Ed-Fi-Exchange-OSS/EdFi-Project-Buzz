import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { TeacherLanding } from './teacherLanding';
import * as React from 'react';

import * as ReactDOM from 'react-dom';
import { ApiService } from 'src/app/Services/api.service';

const containerElementName = 'teacherLandingReactComponentContainer';

@Component({
  selector: 'app-teacher-landing-react',
  template: `<span #${containerElementName}></span>`,
  styleUrls: ['./teacherLanding.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TeacherLandingReactWrapperComponent implements OnChanges, OnDestroy, AfterViewInit {
  @ViewChild(containerElementName, {static: false}) containerRef: ElementRef;

  @Input() public counter = 100;
  @Output() public componentClick = new EventEmitter<void>();

  constructor(private api: ApiService) {
    this.handleDivClicked = this.handleDivClicked.bind(this);
  }

  public handleDivClicked() {
    if (this.componentClick) {
      this.componentClick.emit();
      this.render();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.render();
  }

  ngAfterViewInit() {
    this.render();
  }

  ngOnDestroy() {
    ReactDOM.unmountComponentAtNode(this.containerRef.nativeElement);
  }

  private render() {
    const {counter} = this;

    ReactDOM.render(<TeacherLanding api={this.api} onClick={this.handleDivClicked}/>, this.containerRef.nativeElement);
  }
}
