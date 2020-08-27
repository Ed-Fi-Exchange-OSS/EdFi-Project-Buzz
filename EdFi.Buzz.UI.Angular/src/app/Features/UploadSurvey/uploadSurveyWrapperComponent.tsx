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

import { UploadSurvey } from './uploadSurvey';
import * as React from 'react';

import * as ReactDOM from 'react-dom';
import { ApiService } from 'src/app/Services/api.service';

const containerElementName = 'uploadSurveyReactComponentContainer';

import GlobalFonts from '../../../globalstyle';
import { ThemeProvider } from 'styled-components';
import BuzzTheme from '../../../buzztheme';
import { FormBuilder } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-upload-survey',
  template: `<span #${containerElementName}></span>`,
  styleUrls: ['./uploadSurvey.css'],
  encapsulation: ViewEncapsulation.None,
})
export class UploadSurveyWrapperComponent implements OnChanges, OnDestroy, AfterViewInit {
  @ViewChild(containerElementName, {static: false}) containerRef: ElementRef;

  @Input() public counter = 100;
  @Output() public componentClick = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private title: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
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
    let surveyKey = '';
    this.activatedRoute.paramMap.subscribe(params => {
      if (params.get('id')) {
        surveyKey = '' + params.get('id');
      }
    });
    ReactDOM.render(<>
    <GlobalFonts />
        <ThemeProvider theme={BuzzTheme}>
          <UploadSurvey api={this.api} surveyKey={surveyKey}/>
        </ThemeProvider>
      </>, this.containerRef.nativeElement);
  }
}
