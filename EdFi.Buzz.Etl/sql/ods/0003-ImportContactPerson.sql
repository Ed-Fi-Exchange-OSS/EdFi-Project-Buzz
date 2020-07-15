-- SPDX-License-Identifier: Apache-2.0
-- Licensed to the Ed-Fi Alliance under one or more agreements.
-- The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
-- See the LICENSE and NOTICES files in the project root for more information.

    WITH ParentAddress AS (
        SELECT
            ParentAddress.ParentUSI,
			COALESCE(ParentAddress.StreetNumberName, '') as StreetNumberName,
			COALESCE(ParentAddress.ApartmentRoomSuiteNumber, '') as ApartmentRoomSuiteNumber,
			COALESCE(ParentAddress.City, '') as City,
			COALESCE(StateAbbreviationType.CodeValue, '') as State,
            COALESCE(ParentAddress.PostalCode, '') as PostalCode,
            CONCAT(COALESCE(ParentAddress.StreetNumberName, ''), COALESCE(', ' + ParentAddress.ApartmentRoomSuiteNumber, ''),
                COALESCE(' ' + ParentAddress.City, ''), COALESCE(' ' + StateAbbreviationType.CodeValue, ''),
                COALESCE(' ' + ParentAddress.PostalCode, '')) AS Address,
            CONCAT('Address.', AddressType.CodeValue) AS ConstantName,
            ParentAddress.CreateDate AS LastModifiedDate
        FROM
            edfi.ParentAddress
        INNER JOIN
            edfi.Descriptor AS AddressType
        ON
            ParentAddress.AddressTypeDescriptorId = AddressType.DescriptorId
        -- Parent Address does not require a record in Parent Address Period. But if there is one, make sure
        -- that an end date has not been set or is in the future
        LEFT OUTER JOIN
            edfi.ParentAddressPeriod
        ON
            ParentAddress.AddressTypeDescriptorId = ParentAddressPeriod.AddressTypeDescriptorId
        AND
            ParentAddress.ParentUSI = ParentAddressPeriod.ParentUSI
        INNER JOIN
            edfi.Descriptor AS StateAbbreviationType
        ON
            ParentAddress.StateAbbreviationDescriptorId = StateAbbreviationType.DescriptorId
        WHERE
		AddressType.CodeValue IN ('Home', 'Physical','Work') AND
            (ParentAddressPeriod.EndDate IS NULL
        OR
            ParentAddressPeriod.EndDate > GETDATE())
    ), ParentTelephone AS (
        SELECT
            ParentTelephone.ParentUSI,
            ParentTelephone.TelephoneNumber,
            TelephoneNumberType.CodeValue AS TelephoneNumberType,
            CONCAT('Telephone.', TelephoneNumberType.CodeValue) as ConstantName,
            ParentTelephone.CreateDate
        FROM
            edfi.ParentTelephone
        INNER JOIN
            edfi.Descriptor AS TelephoneNumberType
        ON
            ParentTelephone.TelephoneNumberTypeDescriptorId = TelephoneNumberType.DescriptorId
		WHERE
		(TelephoneNumberType.CodeValue IN ('Home','Mobile','Work'))
    ), ParentEmail AS (
        SELECT
            ParentElectronicMail.ParentUSI,
            ParentElectronicMail.ElectronicMailAddress,
            ParentElectronicMail.PrimaryEmailAddressIndicator,
            HomeEmailType.CodeValue AS EmailType,
            CONCAT('Email.', HomeEmailType.CodeValue) AS ConstantName,-- DescriptorConstant.ConstantName,
            ParentElectronicMail.CreateDate
        FROM
            edfi.ParentElectronicMail
        LEFT OUTER JOIN
            edfi.Descriptor AS HomeEmailType
        ON
            ParentElectronicMail.ElectronicMailTypeDescriptorId = HomeEmailType.DescriptorId
	WHERE
		HomeEmailType.CodeValue IN ('Personal', 'Work')
    )
    SELECT
        CONCAT(Parent.ParentUniqueId,'-',Student.StudentUniqueId) AS uniquekey,
        Parent.ParentUniqueId AS contactpersonkey,
        Student.StudentUniqueId AS studentkey,
        Parent.FirstName AS contactfirstname,
        Parent.LastSurname AS contactlastname,
        RelationType.CodeValue AS relationshiptostudent,
		CASE WHEN COALESCE(HomeAddress.Address, '') <> '' THEN HomeAddress.StreetNumberName WHEN COALESCE(PhysicalAddress.Address, '') <> '' THEN PhysicalAddress.StreetNumberName WHEN COALESCE(WorkAddress.Address, '') <> '' THEN WorkAddress.StreetNumberName  ELSE '' END  as streetnumbername,
		CASE WHEN COALESCE(HomeAddress.Address, '') <> '' THEN HomeAddress.ApartmentRoomSuiteNumber WHEN COALESCE(PhysicalAddress.Address, '') <> '' THEN PhysicalAddress.ApartmentRoomSuiteNumber WHEN COALESCE(WorkAddress.Address, '') <> '' THEN WorkAddress.ApartmentRoomSuiteNumber  ELSE '' END  as apartmentroomsuitenumber,
		CASE WHEN COALESCE(HomeAddress.Address, '') <> '' THEN HomeAddress.City WHEN COALESCE(PhysicalAddress.Address, '') <> '' THEN PhysicalAddress.City WHEN COALESCE(WorkAddress.Address, '') <> '' THEN WorkAddress.City  ELSE '' END  as city,
		CASE WHEN COALESCE(HomeAddress.Address, '') <> '' THEN HomeAddress.State WHEN COALESCE(PhysicalAddress.Address, '') <> '' THEN PhysicalAddress.State WHEN COALESCE(WorkAddress.Address, '') <> '' THEN WorkAddress.State  ELSE '' END  as state,
		CASE WHEN COALESCE(HomeAddress.Address, '') <> '' THEN HomeAddress.PostalCode WHEN COALESCE(PhysicalAddress.Address, '') <> '' THEN PhysicalAddress.PostalCode WHEN COALESCE(WorkAddress.Address, '') <> '' THEN WorkAddress.PostalCode  ELSE '' END  as postalcode,
		COALESCE(HomeTelephone.TelephoneNumber, MobileTelephone.TelephoneNumber, WorkTelephone.TelephoneNumber, '') AS phonenumber,
		COALESCE(HomeEmail.ElectronicMailAddress, WorkEmail.ElectronicMailAddress, '') AS primaryemailaddress,
        COALESCE(StudentParentAssociation.PrimaryContactStatus, CAST(0 as BIT)) AS isprimarycontact,
        (
            SELECT
                MAX(MaxLastModifiedDate)
            FROM
                (VALUES(StudentParentAssociation.LastModifiedDate)
                    , (Parent.LastModifiedDate)
                    , (HomeAddress.LastModifiedDate)
                    , (PhysicalAddress.LastModifiedDate)
                    , (MailingAddress.LastModifiedDate)
                    , (WorkAddress.LastModifiedDate)
                    , (TemporaryAddress.LastModifiedDate)
                    , (HomeTelephone.CreateDate)
                    , (MobileTelephone.CreateDate)
                    , (WorkTelephone.CreateDate)
                    , (HomeEmail.CreateDate)
                    , (WorkEmail.CreateDate)
                ) AS VALUE(MaxLastModifiedDate)
        ) AS lastmodifieddate
    FROM
        edfi.StudentParentAssociation
    INNER JOIN
        edfi.Student
    ON
        StudentParentAssociation.StudentUSI = edfi.Student.StudentUSI
    INNER JOIN
        edfi.Parent
    ON
        StudentParentAssociation.ParentUSI = Parent.ParentUSI
    INNER JOIN
        edfi.Descriptor AS RelationType
    ON
        StudentParentAssociation.RelationDescriptorId = RelationType.DescriptorId
    LEFT OUTER JOIN
        ParentAddress AS HomeAddress
    ON
        Parent.ParentUSI = HomeAddress.ParentUSI
    AND
        HomeAddress.ConstantName = 'Address.Home'
    LEFT OUTER JOIN
        ParentAddress AS PhysicalAddress
    ON
        Parent.ParentUSI = HomeAddress.ParentUSI
    AND
        HomeAddress.ConstantName = 'Address.Physical'
    LEFT OUTER JOIN
        ParentAddress AS MailingAddress
    ON
        Parent.ParentUSI = MailingAddress.ParentUSI
    AND
        MailingAddress.ConstantName = 'Address.Mailing'
    LEFT OUTER JOIN
        ParentAddress AS WorkAddress
    ON
        Parent.ParentUSI = WorkAddress.ParentUSI
    AND
        WorkAddress.ConstantName = 'Address.Work'
    LEFT OUTER JOIN
        ParentAddress AS TemporaryAddress
    ON
        Parent.ParentUSI = TemporaryAddress.ParentUSI
    AND
        TemporaryAddress.ConstantName = 'Address.Temporary'
    LEFT OUTER JOIN
        ParentTelephone AS HomeTelephone
    ON
        Parent.ParentUSI = HomeTelephone.ParentUSI
    AND
        HomeTelephone.ConstantName = 'Telephone.Home'
    LEFT OUTER JOIN
        ParentTelephone AS MobileTelephone
    ON
        Parent.ParentUSI = MobileTelephone.ParentUSI
    AND
        MobileTelephone.ConstantName = 'Telephone.Mobile'
    LEFT OUTER JOIN
        ParentTelephone AS WorkTelephone
    ON
        Parent.ParentUSI = WorkTelephone.ParentUSI
    AND
        WorkTelephone.ConstantName = 'Telephone.Work'
    LEFT OUTER JOIN
        ParentEmail AS HomeEmail
    ON
        Parent.ParentUSI = HomeEmail.ParentUSI
    AND
        HomeEmail.ConstantName = 'Email.Personal'
    LEFT OUTER JOIN
        ParentEmail AS WorkEmail
    ON
        Parent.ParentUSI = WorkEmail.ParentUSI
    AND
        WorkEmail.ConstantName = 'Email.Work';
