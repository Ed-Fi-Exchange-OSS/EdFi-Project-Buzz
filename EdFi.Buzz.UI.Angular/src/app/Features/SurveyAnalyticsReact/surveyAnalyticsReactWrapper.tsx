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
import * as React from 'react';

import * as ReactDOM from 'react-dom';
import { ApiService } from 'src/app/Services/api.service';
import { SurveyAnalytics } from './surveyAnalytics';

const containerElementName = 'surveyAnalyticsReactComponentContainer';

@Component({
  selector: 'app-survey-analytics-react',
  template: `<span #${containerElementName}></span>`,
  styleUrls: ['./surveyAnalytics.css', './surveyMetadataUI.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SurveyAnalyticsReactWrapperComponent implements OnChanges, OnDestroy, AfterViewInit {
  @ViewChild(containerElementName, {static: false}) containerRef: ElementRef;

  @Input() public counter = 100;
  @Output() public componentClick = new EventEmitter<void>();

  constructor(private api: ApiService) {
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

    ReactDOM.render(<SurveyAnalytics api={this.api} />, this.containerRef.nativeElement);
  }
}
