import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'fif', name: 'contactperson', synchronize: false })
export default class ContactPersonEntity {
  @PrimaryColumn() uniquekey: string;

  @Column() contactpersonkey: string;

  @Column() studentkey: string;

  @Column() contactfirstname: string;

  @Column() contactlastname: string;

  @Column() relationshiptostudent: string;

  @Column() streetnumbername: string;

  @Column() apartmentroomsuitenumber: string;

  @Column() state: string;

  @Column() postalcode: string;

  @Column() phonenumber: string;

  @Column() primaryemailaddress: string;

  @Column() isprimarycontact: boolean;

  @Column() preferredcontactmethod: string;

  @Column() besttimetocontact: string;

  @Column() contactnotes: string;
}
