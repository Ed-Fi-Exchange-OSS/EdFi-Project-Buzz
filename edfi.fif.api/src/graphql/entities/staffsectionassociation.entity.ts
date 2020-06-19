import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'fif', name: 'staffsectionassociation', synchronize: false })
export default class StaffSectionAssociationEntity {
  @PrimaryColumn() staffkey: number;

  @PrimaryColumn() sectionkey: string;
}
