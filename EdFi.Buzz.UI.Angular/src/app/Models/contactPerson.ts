// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

export class ContactPerson {
    uniquekey: string;
    contactpersonkey: string;
    studentkey: string;

    contactfirstname: string;
    contactlastname: string;

    relationshiptostudent: string;

    // Address
    streetnumbername: string;
    apartmentroomsuitenumber: string;
    state: string;
    postalcode: string;

    phonenumber: string;
    primaryemailaddress: string;
    isprimarycontact: boolean;
    preferredcontactmethod: string;
    besttimetocontact: string;
    contactnotes: string;
}
