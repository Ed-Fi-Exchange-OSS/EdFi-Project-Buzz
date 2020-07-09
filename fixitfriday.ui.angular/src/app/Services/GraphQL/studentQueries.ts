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
query($staffkey: ID!, $studentschoolkey: String!) {
  studentbystaff(staffkey:$staffkey, studentschoolkey: $studentschoolkey) {
    studentschoolkey,
    studentkey,

    studentfirstname,
    studentmiddlename,
    studentlastname,
    gradelevel,
    pictureurl,

    siblingscount,
    siblings {
      studentfirstname,
      studentmiddlename,
      studentlastname,
      gradelevel,
      studentschoolkey
    },
    notes{
      studentnotekey,
      note
    },
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
    }
  }
}
`;

export { getStudentsBySection, getStudentById };
