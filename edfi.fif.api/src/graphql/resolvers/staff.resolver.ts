import { Args, Parent, Query, Resolver, ResolveProperty } from '@nestjs/graphql';
import { Staff, Section } from '../graphql.schema';
import StaffService from '../services/staff.service';

@Resolver('Staff')
export default class StaffResolvers {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly staffService: StaffService) {}

  @Query('staff')
  async staffs(): Promise<Staff[]> {
    return this.staffService.findAll();
  }

  @Query('sectionsbystaff')
  async findOneById(
    @Args('staffkey')
    staffkey: number,
  ): Promise<Staff> {
    return this.staffService.findOneById(staffkey);
  }

  @ResolveProperty('sections')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async students(@Parent() parent): Promise<Section[]> {
    return this.staffService.findSectionByStaff(parent.staffkey);
  }
}
