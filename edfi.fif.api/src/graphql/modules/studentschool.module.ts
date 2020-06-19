import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import StudentSchoolResolvers from '../resolvers/studentschool.resolver';
import StudentSchoolService from '../services/studentschool.service';
import StudentSchoolEntity from '../entities/studentschool.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentSchoolEntity])],
  providers: [StudentSchoolService, StudentSchoolResolvers],
})
export default class StudentSchoolModule {}
