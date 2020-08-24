import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import * as React from 'react';

import * as ReactDOM from 'react-dom';
import { ApiService } from 'src/app/Services/api.service';
import { SurveyAnalytics } from './surveyAnalytics';
import { ThemeProvider } from 'styled-components';
import BuzzTheme from 'src/buzztheme';
import GlobalFonts from '../../../globalstyle';

const containerElementName = 'surveyAnalyticsReactComponentContainer';

@Component({
  selector: 'app-survey-analytics-react',
  template: `<span #${containerElementName}></span>`,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
})
export class SurveyAnalyticsReactWrapperComponent implements OnChanges, OnDestroy, AfterViewInit {
  @ViewChild(containerElementName, { static: false }) containerRef: ElementRef;

  @Output() public componentClick = new EventEmitter<void>();

  constructor(private api: ApiService) {}

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
    ReactDOM.render(
      <>
        <GlobalFonts />
        <ThemeProvider theme={BuzzTheme}>
          <SurveyAnalytics api={this.api} />
        </ThemeProvider>
      </>,
      this.containerRef.nativeElement,
    );
  }
}
