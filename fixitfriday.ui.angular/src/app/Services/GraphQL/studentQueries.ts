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

export { getStudentsBySection };
