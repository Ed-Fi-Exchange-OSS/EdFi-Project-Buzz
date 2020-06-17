import { Args, Query, Resolver } from '@nestjs/graphql';
import { Section } from '../graphql.schema';
import SectionService from '../services/section.service';

@Resolver('Section')
export default class SectionResolvers {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly sectionsService: SectionService) {}

  @Query()
  async sections(): Promise<Section[]> {
    return this.sectionsService.findAll();
  }

  @Query('section')
  async findOneById(
    @Args('sectionkey')
    sectionkey: string,
  ): Promise<Section> {
    return this.sectionsService.findOneById(sectionkey);
  }
}
