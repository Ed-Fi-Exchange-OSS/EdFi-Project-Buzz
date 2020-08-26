/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */

import { FunctionComponent, useState, useEffect } from "react";
import * as React from "react";
import styled from "styled-components";

import { ContactPerson } from "src/app/Models";
import { EmailIcon, PhoneIcon } from "../common/Icons";

export interface StudentDetailContactCardProps {
  key: string;
  contact: ContactPerson;
}

export const StudentDetailContactCard: FunctionComponent<StudentDetailContactCardProps> = (props: StudentDetailContactCardProps) => {
  const [current, setCurrent] = useState<ContactPerson>(new ContactPerson());

  useEffect(() => {
    setCurrent(props.contact);
  }, []);

  const StyledContactCard = styled.div`
    display: flex;
    flex-direction: column;
    font-size: 14px;
    background-color: var(--white-lilac);
    min-width: 20rem;
    min-height: 50px;
    margin-right: 2rem;
    border-radius: 4px;

    .contact-card-name {
      color: var(--shark);
      font-size: 18px;
      font-weight: 600;
      margin-right: 1.5rem;
    }

    .contact-main-container {
      display: flex;
      flex-direction: row;
    }

    .contact-preferences-container {
      display: flex;
      flex-direction: row;
    }
  `;

  return (
    <StyledContactCard className="contact-card">
      <div className='contact-main-container'>
        <div className="contact-card-name">{`${current.contactfirstname} ${current.contactlastname}`}</div>
        <div className="italics">Relationship - {current.relationshiptostudent}</div>
      </div>
      <div className="contact-contact-info">
        {props.contact.primaryemailaddress && (
          <div className="contact-email">
            <EmailIcon />
            {`${props.contact.primaryemailaddress}`}
          </div>
        )}
        <div>
          <PhoneIcon />
          {`${props.contact.phonenumber}`}
        </div>
      </div>
      <div className='contact-preferences-container'>
        <div>Preferred contact method: {current.preferredcontactmethod}</div>
        <div>Best time to contact: {current.besttimetocontact}</div>
      </div>
    </StyledContactCard>
  );
};
