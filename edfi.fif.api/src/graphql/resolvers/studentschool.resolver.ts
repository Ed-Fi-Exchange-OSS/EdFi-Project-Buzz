import { Args, Query, Resolver } from '@nestjs/graphql';
import { StudentSchool } from '../graphql.schema';
import StudentSchoolService from '../services/studentschool.service';

@Resolver('StudentSchool')
export default class StudentSchoolResolvers {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly studentschoolService: StudentSchoolService) {}

  @Query()
  async students(): Promise<StudentSchool[]> {
    return this.studentschoolService.findAll();
  }

  @Query('student')
  async findOneById(
    @Args('studentschoolkey')
    studentschoolkey: string,
  ): Promise<StudentSchool> {
    return this.studentschoolService.findOneById(studentschoolkey);
  }
}
