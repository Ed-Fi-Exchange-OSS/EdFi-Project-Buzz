import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'fif', name: 'studentcontact', synchronize: false })
export default class StudentContactEntity {
  @PrimaryColumn() contactkey: string;

  @PrimaryColumn() studentschoolkey: string;
}
