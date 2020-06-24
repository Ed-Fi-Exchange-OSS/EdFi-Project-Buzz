import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'fif', name: 'section', synchronize: false })
export default class SectionEntity {
  @PrimaryColumn() sectionkey: string;

  @Column() schoolkey: string;

  @Column() localcoursecode: string;

  @Column() sessionname: string;

  @Column() sectionidentifier: string;

  @Column() schoolyear: number;
}
