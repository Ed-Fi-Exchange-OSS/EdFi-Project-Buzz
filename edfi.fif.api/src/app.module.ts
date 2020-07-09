// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import AppController from './app.controller';
import AppService from './app.service';
import SectionModule from './graphql/modules/section.module';
import StaffModule from './graphql/modules/staff.module';
import StudentSchoolModule from './graphql/modules/studentschool.module';
import SurveySummaryModule from './graphql/modules/surveysummary.module';
import SurveySummaryQuestionsModule from './graphql/modules/surveysummaryquestions.module';
import StudentSurveyModule from './graphql/modules/studentsurvey.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      playground: true,
      context: ({ req }) => ({ headers: req.headers }),
    }),
    SectionModule,
    StaffModule,
    StudentSchoolModule,
    StudentSurveyModule,
    SurveySummaryModule,
    SurveySummaryQuestionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export default class AppModule {}
