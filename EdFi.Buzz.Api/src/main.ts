// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Logger } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import AppModule from './app.module';

const httpPort: number = parseInt(process.env.BUZZ_API_HTTP_PORT, 10);
const allowedOrigins: string[] = process.env.BUZZ_API_CORS_ORIGINS.split(',');

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} was not defined in BUZZ_API_CORS_ORIGINS`));
    }callback(null, true);
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: [
    'Authorization',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Headers',
    'Origin',
    'Accept',
    'X-Requested-With',
    'Content-Type',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
  ],
  credentials: true,
};

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter({ trustProxy: true, logger: true });
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastifyAdapter);
  app.enableCors({ ...corsOptions });
  Logger.log(`NODE_TLS_REJECT_UNAUTHORIZED := ${process.env.NODE_TLS_REJECT_UNAUTHORIZED}`);
  await app.listen(httpPort);
}

bootstrap();
