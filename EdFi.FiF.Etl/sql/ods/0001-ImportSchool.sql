SELECT
		CAST(School.SchoolId AS VARCHAR) as schoolkey,
		EducationOrganization.NameOfInstitution as schoolname,
		COALESCE(SchoolType.CodeValue, '') as schooltype,
		COALESCE(SchoolAddress.SchoolAddress, '') as schooladdress,
		COALESCE(SchoolAddress.SchoolCity, '') as schoolcity,
		COALESCE(SchoolAddress.SchoolCounty, '') as schoolcounty,
		COALESCE(SchoolAddress.SchoolState, '') as schoolstate,
		COALESCE(EdOrgLocal.NameOfInstitution, '') as localeducationagencyname,
		EdOrgLocal.EducationOrganizationId as localeducationagencykey,
		COALESCE(EdOrgState.NameOfInstitution, '') as stateeducationagencyname,
		EdOrgState.EducationOrganizationId as stateeducationagencykey,
		COALESCE(EdOrgServiceCenter.NameOfInstitution, '') as educationservicecentername,
		EdOrgServiceCenter.EducationOrganizationId as educationservicecenterkey,
		(	SELECT
				MAX(MaxLastModifiedDate)
			FROM (VALUES (EducationOrganization.LastModifiedDate)
						,(SchoolType.LastModifiedDate)
						,(EdOrgLocal.LastModifiedDate)
						,(EdOrgState.LastModifiedDate)
						,(EdOrgServiceCenter.LastModifiedDate)
						,(SchoolAddress.LastModifiedDate)
				 ) AS VALUE (MaxLastModifiedDate)
		) AS lastmodifieddate
	FROM
		edfi.School
	INNER JOIN
		edfi.EducationOrganization
	  ON School.SchoolId = EducationOrganization.EducationOrganizationId
	LEFT OUTER JOIN
		edfi.Descriptor as SchoolType
	  ON School.SchoolTypeDescriptorId = SchoolType.DescriptorId
	LEFT OUTER JOIN
		edfi.LocalEducationAgency
	  ON School.LocalEducationAgencyId = LocalEducationAgency.LocalEducationAgencyId
	LEFT OUTER JOIN
		edfi.EducationOrganization as EdOrgLocal
	  ON School.LocalEducationAgencyId = EdOrgLocal.EducationOrganizationId
	LEFT OUTER JOIN
		edfi.EducationOrganization as EdOrgState
	  ON LocalEducationAgency.StateEducationAgencyId = EdOrgState.EducationOrganizationId
	LEFT OUTER JOIN
		edfi.EducationOrganization as EdOrgServiceCenter
	  ON LocalEducationAgency.EducationServiceCenterId = EdOrgServiceCenter.EducationOrganizationId
	OUTER APPLY (
		SELECT TOP 1
			CONCAT(EducationOrganizationAddress.StreetNumberName, ', ',
				(EducationOrganizationAddress.ApartmentRoomSuiteNumber + ', '),
				EducationOrganizationAddress.City,
				StateAbbreviationType.CodeValue, ' ',
				EducationOrganizationAddress.PostalCode) as SchoolAddress,
			EducationOrganizationAddress.City as SchoolCity,
			EducationOrganizationAddress.NameOfCounty as SchoolCounty,
			StateAbbreviationType.CodeValue as SchoolState,
			EducationOrganizationAddressPeriod.BeginDate as LastModifiedDate
		FROM
			edfi.EducationOrganizationAddress
		INNER JOIN
			edfi.Descriptor as AddressType
		  ON EducationOrganizationAddress.AddressTypeDescriptorId = AddressType.DescriptorId
		INNER JOIN
			edfi.EducationOrganizationAddressPeriod
		  ON EducationOrganizationAddress.AddressTypeDescriptorId = EducationOrganizationAddressPeriod.AddressTypeDescriptorId
		INNER JOIN
			edfi.Descriptor as StateAbbreviationType
		  ON EducationOrganizationAddress.StateAbbreviationDescriptorId = StateAbbreviationType.DescriptorId
         INNER JOIN
              analytics_config.DescriptorMap
           ON AddressType.DescriptorId = DescriptorMap.DescriptorId
         INNER JOIN
              analytics_config.DescriptorConstant
           ON DescriptorConstant.DescriptorConstantId = DescriptorMap.DescriptorConstantId
		WHERE
			School.SchoolId = EducationOrganizationAddress.EducationOrganizationId
			AND EducationOrganizationAddressPeriod.EndDate IS NULL
			AND DescriptorConstant.ConstantName = 'Address.Physical'
	) as SchoolAddress;
