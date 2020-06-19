import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'fif', name: 'studentsection', synchronize: false })
export default class StudentSectionEntity {
  @PrimaryColumn() studentsectionkey: string;

  @Column() studentschoolkey: string;

  @Column() studentkey: string;

  @Column() sectionkey: string;

  @Column() localcoursecode: string;

  @Column() subject: string;

  @Column() coursetitle: string;

  @Column() teachername: string;

  @Column() studentsectionstartdatekey: string;

  @Column() studentsectionenddatekey: string;

  @Column() schoolkey: string;

  @Column() schoolyear: string;
}
