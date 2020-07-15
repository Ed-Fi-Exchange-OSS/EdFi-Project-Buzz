import gql from 'graphql-tag';

const getSectionsByStaff = gql`
query($staffkey: ID!) {
  sectionsbystaff(staffkey:$staffkey) {
    sectionkey
    localcoursecode
    sessionname
    schoolyear
  }
}
`;

export { getSectionsByStaff };
