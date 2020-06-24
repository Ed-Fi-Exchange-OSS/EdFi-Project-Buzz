import gql from 'graphql-tag';

const getAllSections = gql`
query {
  sections {
    sectionkey
    localcoursecode
    sessionname
    schoolyear
  }
}
`;

export { getAllSections };
