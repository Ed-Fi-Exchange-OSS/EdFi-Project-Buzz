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
import OdsSurveyModule from './graphql/modules/odssurvey.module';
import { BUZZ_DATABASE, ODS_DATABASE } from './constants';

config({ path: `${__dirname}/.env` });

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: BUZZ_DATABASE,
      type: 'postgres',
      host: process.env.BUZZ_API_DB_HOST,
      port: parseInt(process.env.BUZZ_API_DB_PORT, 10),
      username: process.env.BUZZ_API_DB_USERNAME,
      password: process.env.BUZZ_API_DB_PASSWORD,
      database: process.env.BUZZ_API_DB_DATABASE,
      entities: [`${__dirname}/**/entities/buzz/**/*.entity.js`],
      synchronize: false,
      logging: false,
    }),
    TypeOrmModule.forRoot({
      name: ODS_DATABASE,
      type: 'mssql',
      host: process.env.ODS_SERVER,
      port: parseInt(process.env.ODS_PORT, 10),
      username: process.env.ODS_USER,
      password: process.env.ODS_PASSWORD,
      database: process.env.ODS_DBNAME,
      entities: [`${__dirname}/**/entities/ods/**/*.entity.js`],
      synchronize: false,
      logging: false,
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
    OdsSurveyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export default class AppModule { }
