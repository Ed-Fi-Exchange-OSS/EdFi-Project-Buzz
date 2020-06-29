import gql from 'graphql-tag';

const getSectionsByStaff = gql`
query {
  sections {
    sectionkey
    localcoursecode
    sessionname
    schoolyear
  }
}
`;

export { getSectionsByStaff };
