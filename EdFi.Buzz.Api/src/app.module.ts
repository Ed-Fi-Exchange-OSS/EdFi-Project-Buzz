// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import AppController from './app.controller';
import AppService from './app.service';
import SectionModule from './graphql/modules/section.module';
import StaffModule from './graphql/modules/staff.module';
import StudentSchoolModule from './graphql/modules/studentschool.module';
import StudentNoteModule from './graphql/modules/studentnote.module';
import TaskItemModule from './graphql/modules/taskitem.module';
import SurveySummaryModule from './graphql/modules/surveysummary.module';
import SurveySummaryQuestionsModule from './graphql/modules/surveysummaryquestions.module';
import StudentSurveyModule from './graphql/modules/studentsurvey.module';
import SurveyFileModule from './graphql/modules/surveyfile.module';
import SurveyStatusModule from './graphql/modules/surveystatus.module';
import SurveyModule from './graphql/modules/survey.module';

config({ path: `${__dirname}/.env` });

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.BUZZ_API_DB_HOST,
      port: parseInt(process.env.BUZZ_API_DB_PORT, 10),
      username: process.env.BUZZ_API_DB_USERNAME,
      password: process.env.BUZZ_API_DB_PASSWORD,
      database: process.env.BUZZ_API_DB_DATABASE,
      entities: [`${__dirname}/**/*.entity.js`],
      synchronize: true,
    }),
    GraphQLModule.forRoot({
      typePaths: [`${__dirname}/**/*.graphql`],
      playground: true,
      context: ({ request }) => ({ headers: request.raw.headers }),
    }),
    SectionModule,
    StaffModule,
    StudentSchoolModule,
    StudentNoteModule,
    StudentSurveyModule,
    SurveySummaryModule,
    SurveySummaryQuestionsModule,
    TaskItemModule,
    SurveyFileModule,
    SurveyStatusModule,
    SurveyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export default class AppModule { }
