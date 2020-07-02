import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import StudentSchoolResolvers from '../resolvers/studentschool.resolver';
import StudentSchoolService from '../services/studentschool.service';
import StudentSchoolEntity from '../entities/studentschool.entity';
import StudentContactEntity from '../entities/studentcontact.entity';
import ContactPersonEntity from '../entities/contactperson.entity';
import SchoolEntity from '../entities/school.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentSchoolEntity, ContactPersonEntity, StudentContactEntity, SchoolEntity])],
  providers: [StudentSchoolService, StudentSchoolResolvers],
})
export default class StudentSchoolModule {}
