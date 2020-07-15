import gql from 'graphql-tag';

const GET_TEACHER_NAME_AND_SECTIONS = gql`
  query($StaffKey: Int) {
    sectionsbystaff(staffkey: $StaffKey) {
      staffkey
      firstname
      middlename
      lastsurname
      sections {
        sectionkey
        localcoursecode
        sessionname
        schoolyear
      }
    }
  }
`;

export default GET_TEACHER_NAME_AND_SECTIONS;
