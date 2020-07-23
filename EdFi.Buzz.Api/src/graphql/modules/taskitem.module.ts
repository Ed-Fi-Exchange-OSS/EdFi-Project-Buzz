// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import TaskItemResolvers from '../resolvers/taskitem.resolver';
import TaskItemService from '../services/taskitem.service';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  providers: [TaskItemService, TaskItemResolvers],
})
export default class TaskItemModule {}
