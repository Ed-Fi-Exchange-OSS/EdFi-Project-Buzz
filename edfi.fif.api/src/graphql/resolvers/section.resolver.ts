import { Args, Parent, Resolver, ResolveProperty } from '@nestjs/graphql';
import { Section, StudentSchool } from '../graphql.schema';
import SectionService from '../services/section.service';

@Resolver('Section')
export default class SectionResolvers {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly sectionsService: SectionService) {}

  async sections(): Promise<Section[]> {
    return this.sectionsService.findAll();
  }

  async findOneById(
    @Args('sectionkey')
    sectionkey: string,
  ): Promise<Section> {
    return this.sectionsService.findOneById(sectionkey);
  }

  @ResolveProperty('student')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async student(
    @Parent() parent,
    @Args('studentschoolkey')
    studentschoolkey: string,
  ): Promise<StudentSchool> {
    return this.sectionsService.findStudentBySection(parent.sectionkey, studentschoolkey);
  }

  @ResolveProperty('students')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async students(@Parent() parent): Promise<StudentSchool[]> {
    return this.sectionsService.findStudentsBySection(parent.sectionkey);
  }
}
