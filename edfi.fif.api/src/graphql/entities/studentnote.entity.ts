import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'fif', name: 'studentnote', synchronize: false })
export default class StudentNoteEntity {
  @PrimaryColumn() studentnotekey: string;

  @Column() note: string;

  @Column() studentschoolkey: string;
}
