// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import AppModule from './app.module';

const httpPort = parseInt(process.env.BUZZ_API_HTTP_PORT, 10);

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter({ trustProxy: true });
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastifyAdapter);
  app.enableCors();
  Logger.log(`NODE_TLS_REJECT_UNAUTHORIZED := ${process.env.NODE_TLS_REJECT_UNAUTHORIZED}`);
  await app.listen(httpPort);
}
bootstrap();
