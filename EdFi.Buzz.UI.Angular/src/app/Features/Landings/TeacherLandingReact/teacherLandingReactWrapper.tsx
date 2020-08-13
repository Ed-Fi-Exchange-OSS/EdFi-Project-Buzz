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

import GlobalFonts from '../../../../globalstyle';
import { ThemeProvider } from 'styled-components';
import BuzzTheme from '../../../../buzztheme';

@Component({
  selector: 'app-teacher-landing-react',
  template: `<span #${containerElementName}></span>`,
  styleUrls: ['./teacherLanding.css', './studentTable.css', '../../../Components/StudentCardReact/studentCard.css'],
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
    ReactDOM.render(<>
        <GlobalFonts />
        <ThemeProvider theme={BuzzTheme}>
          <TeacherLanding api={this.api} onClick={this.handleDivClicked} />
        </ThemeProvider>
      </>, this.containerRef.nativeElement);
  }
}
