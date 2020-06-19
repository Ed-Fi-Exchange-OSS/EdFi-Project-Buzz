import { Entity, Column, PrimaryColumn, OneToMany, JoinTable } from 'typeorm';

import StudentSchoolEntity from './studentschool.entity';

@Entity({ schema: 'fif', name: 'section', synchronize: false })
export default class SectionEntity {
  @PrimaryColumn() sectionkey: string;

  @Column() schoolkey: string;

  @Column() localcoursecode: string;

  @Column() sessionname: string;

  @Column() sectionidentifier: string;

  @Column() schoolyear: number;

  @OneToMany(() => StudentSchoolEntity, studentschool => studentschool.studentschoolkey)
  @JoinTable()
  students?: StudentSchoolEntity[];
}
