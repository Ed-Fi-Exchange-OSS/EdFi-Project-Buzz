SELECT DISTINCT
  cpd.uniquekey,
  cpd.contactpersonkey,
  cpd.studentkey,
  cpd.contactfirstname,
  cpd.contactlastname,
  cpd.relationshiptostudent,
  pa.streetnumbername as streetnumbername,
  pa.apartmentroomsuitenumber as apartmentroomsuitenumber,
  d.codevalue as 'state',
  pa.postalcode as postalcode,
  pt.telephonenumber as phonenumber,
  pe.electronicmailaddress as primaryemailaddress,
  spa.primarycontactstatus as isprimarycontact,
  null as preferredcontactmethod,
  null as besttimetocontact,
  null as contactnotes
From analytics.ContactPersonDim cpd
  LEFT JOIN edfi.Student s ON cpd.StudentKey = s.StudentUniqueId
  LEFT JOIN edfi.StudentParentAssociation spa ON s.StudentUSI = spa.StudentUSI
  LEFT JOIN edfi.Parent p ON spa.ParentUSI = p.ParentUSI
  LEFT JOIN edfi.ParentTelephone pt ON p.ParentUSI = pt.ParentUSI and pt.OrderOfPriority = 1
  LEFT JOIN (Select *, RANK() over(Partition by ParentUSI order by ElectronicMailTypeDescriptorId) as R
  from edfi.ParentElectronicMail) pe ON p.ParentUSI = pe.ParentUSI and pe.R = 1
  LEFT JOIN edfi.Descriptor as spad on spa.RelationDescriptorId = spad.DescriptorId
  LEFT JOIN edfi.ParentAddress pa ON p.ParentUSI = pa.ParentUSI
  LEFT JOIN edfi.Descriptor d ON pa.StateAbbreviationDescriptorId = d.DescriptorId
