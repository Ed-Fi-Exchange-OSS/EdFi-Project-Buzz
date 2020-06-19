import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import SectionResolvers from '../resolvers/section.resolver';
import SectionService from '../services/section.service';
import SectionEntity from '../entities/section.entity';
import StudentSchoolEntity from '../entities/studentschool.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SectionEntity, StudentSchoolEntity])],
  providers: [SectionService, SectionResolvers],
})
export default class SectionModule {}
