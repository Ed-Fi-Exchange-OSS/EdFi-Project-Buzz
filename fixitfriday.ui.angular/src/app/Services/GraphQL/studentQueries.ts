import gql from 'graphql-tag';

const getStudentsBySection = gql`
query {
  students {
    studentkey,
    studentfirstname,
    studentmiddlename,
    studentlastname,
    gradelevel,
    studentschoolkey,
  	contacts {
      contactfirstname,
      contactlastname,
      relationshiptostudent,
      primaryemailaddress,
      phonenumber,
      streetnumbername,
      apartmentroomsuitenumber,
      isprimarycontact,
      preferredcontactmethod,
      besttimetocontact,
      contactnotes,
    },
    siblingscount,
    siblings {
      studentfirstname,
      studentmiddlename,
      studentlastname,
      gradelevel,
      studentschoolkey
    }
  }
}
`;

const getStudentById = gql`
query($studentschoolkey: ID!) {
  student(studentschoolkey: $studentschoolkey) {
    studentschoolkey,
    studentkey,

    studentfirstname,
    studentmiddlename,
    studentlastname,
    gradelevel,
    pictureurl,

  	contacts {
      contactfirstname,
      contactlastname,
      relationshiptostudent,
      primaryemailaddress,
      phonenumber,
      streetnumbername,
      apartmentroomsuitenumber,
      isprimarycontact,
      preferredcontactmethod,
      besttimetocontact,
      contactnotes,
    },
    siblingscount,
    siblings {
      studentfirstname,
      studentmiddlename,
      studentlastname,
      gradelevel,
      studentschoolkey
    }
  }
}
`;

export { getStudentsBySection, getStudentById };
