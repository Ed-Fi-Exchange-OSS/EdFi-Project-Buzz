import gql from 'graphql-tag';

const GET_STUDENTS_FOR_SECTION = gql`
query StudentsBySection($key: String) {
  studentsbysection(sectionkey: $key) {
    student {
      studentschoolkey
      studentfirstname
      studentmiddlename
      studentlastname
      pictureurl
    }
  }
}

`;

export default GET_STUDENTS_FOR_SECTION