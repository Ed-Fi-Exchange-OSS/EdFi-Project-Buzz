// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

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

  import { AdminSurvey } from './adminSurvey';
  import { ApiService } from 'src/app/Services/api.service';

  const containerElementName = 'adminSurveyReactComponentContainer';

  import GlobalFonts from '../../globalstyle';
  import { ThemeProvider } from 'styled-components';
  import BuzzTheme from '../../buzztheme';

  @Component({
    selector: 'app-admin-survey-react',
    template: `<span #${containerElementName}></span>`,
    styleUrls: ['./adminSurvey.css'],
    encapsulation: ViewEncapsulation.None,
  })
  export class AdminSurveyReactWrapperComponent implements OnChanges, OnDestroy, AfterViewInit {
    @ViewChild(containerElementName, { static: false }) containerRef: ElementRef;

    @Input() public counter = 100;
    @Output() public componentClick = new EventEmitter<void>();

    constructor(
      private api: ApiService) { }

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
          <AdminSurvey
            api={this.api} />
        </ThemeProvider>
      </>, this.containerRef.nativeElement);
    }
  }

