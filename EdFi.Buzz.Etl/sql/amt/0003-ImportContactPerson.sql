-- SPDX-License-Identifier: Apache-2.0
-- Licensed to the Ed-Fi Alliance under one or more agreements.
-- The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
-- See the LICENSE and NOTICES files in the project root for more information.

    SELECT
        ContactPersonDim.UniqueKey AS uniquekey,
        ContactPersonDim.ContactPersonKey AS contactpersonkey,
        ContactPersonDim.StudentKey as studentkey,
        ContactPersonDim.ContactFirstName as contactfirstname,
        ContactPersonDim.ContactLastName as contactlastname,
        ContactPersonDim.RelationshipToStudent as relationshiptostudent,
		CASE
			WHEN 
				ContactPersonDim.ContactHomeAddress <> ''
				THEN ContactPersonDim.ContactHomeAddress
			WHEN
				ContactPersonDim.ContactPhysicalAddress <> '' 
				THEN ContactPersonDim.ContactPhysicalAddress
			WHEN
				ContactPersonDim.ContactMailingAddress <> '' 
				THEN ContactPersonDim.ContactMailingAddress
			WHEN
				ContactPersonDim.ContactWorkAddress <> '' 
				THEN ContactPersonDim.ContactWorkAddress
			WHEN
				ContactPersonDim.ContactTemporaryAddress <> '' 
				THEN ContactPersonDim.ContactTemporaryAddress
			ELSE '' 
			END as contactaddress,
		CASE
			WHEN 
				ContactPersonDim.HomePhoneNumber <> ''
				THEN ContactPersonDim.HomePhoneNumber
			WHEN
				ContactPersonDim.MobilePhoneNumber <> '' 
				THEN ContactPersonDim.MobilePhoneNumber
			WHEN
				ContactPersonDim.WorkPhoneNumber <> '' 
				THEN ContactPersonDim.WorkPhoneNumber
			ELSE '' 
			END as phonenumber,
		CASE
			WHEN 
				ContactPersonDim.PrimaryEmailAddress <> 'Not specified'
				THEN ContactPersonDim.PrimaryEmailAddress
			WHEN
				ContactPersonDim.PersonalEmailAddress <> '' 
				THEN ContactPersonDim.PersonalEmailAddress
			WHEN
				ContactPersonDim.WorkEmailAddress <> '' 
				THEN ContactPersonDim.WorkEmailAddress
			ELSE '' 
			END as primaryemailaddress,
        contactpersondim.IsPrimaryContact as isprimarycontact,
		contactPersonDim.lastModifiedDate as lastmodifieddate
    FROM
		analytics.ContactPersonDim