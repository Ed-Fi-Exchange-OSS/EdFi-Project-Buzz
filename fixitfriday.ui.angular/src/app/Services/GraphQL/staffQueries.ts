import gql from 'graphql-tag';

const getStaffById = gql`
query($staffkey:ID!){
  staffbyid(staffkey: $staffkey){
    staffkey
    personaltitleprefix
    lastsurname
    firstname
    middlename
    electronicmailaddress
    sections{
      sectionkey
      localcoursecode
      sessionname
      schoolyear
    }
  }
}
`;


export { getStaffById };
