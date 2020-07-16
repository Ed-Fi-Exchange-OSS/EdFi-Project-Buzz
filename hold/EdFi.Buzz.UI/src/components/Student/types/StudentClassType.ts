// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

export type GuardianInformationType = {
  name: string;
  email: string;
  phone: string;
  address: string;
  relationship: string;
  preferredContactMethod: string;
  bestTimeToContact: string;
  contactNotes: string;
};

export type StudentClassType = {
  studentschoolkey: string;
  studentfirstname: string;
  studentlastname: string;
  studentmiddlename: string;
  pictureurl: string;
  email: string;
  guardianInformation: GuardianInformationType;
  hasEmail: boolean;
  hasAccessToGoogleClassroom: boolean;
  hasInternetAccess: boolean;
  hasPhone: boolean;
};
