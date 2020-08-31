/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */

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
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import * as React from 'react';

import * as ReactDOM from 'react-dom';
import { ApiService } from 'src/app/Services/api.service';
import { ThemeProvider } from 'styled-components';
import BuzzTheme from 'src/buzztheme';
import GlobalFonts from '../../../globalstyle';
import { StudentDetail } from './StudentDetail';
import { ActivatedRoute, Router } from '@angular/router';
import { Student, Teacher } from 'src/app/Models';

const containerElementName = 'studentDetailReactComponentContainer';

@Component({
  selector: 'app-student-detail-react',
  template: `<span #${containerElementName}></span>`,
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentDetailReactWrapperComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @ViewChild(containerElementName, { static: false }) containerRef: ElementRef;
  studentId: string;
  currentTeacher: Teacher;

  @Output() public componentClick = new EventEmitter<void>();

  constructor(
    private api: ApiService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.currentTeacher = this.api.authentication.currentUserValue.teacher;
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      if (!params.get('id')) {
        this.router.navigate(['/app']);
        return;
      }

      this.studentId = params.get('id');
    });
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
    ReactDOM.render(
      <>
        <GlobalFonts />
        <ThemeProvider theme={BuzzTheme}>
          <StudentDetail api={this.api} studentId={ this.studentId } />
        </ThemeProvider>
      </>,
      this.containerRef.nativeElement,
    );
  }
}
