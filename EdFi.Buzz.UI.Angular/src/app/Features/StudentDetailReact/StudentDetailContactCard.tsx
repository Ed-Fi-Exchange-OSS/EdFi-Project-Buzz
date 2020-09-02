/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */

import { FunctionComponent, useState, useEffect } from 'react';
import * as React from 'react';
import styled from 'styled-components';

import { EmailIcon, PhoneIcon } from '../common/Icons';

export interface StudentDetailContactCardProps {
  firstname: String;
  lastname: String;
  relationshiptostudent: String;
  isSibling: Boolean;
  isprimarycontact: Boolean;
  primaryemailaddress?: String;
  phonenumber?: String;
  preferredcontactmethod?: String;
  besttimetocontact?: String;
}

const StyledContactCard = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 14px;
  background-color: var(--white-lilac);
  min-width: 330px;
  min-height: 50px;
  margin-right: 2rem;
  margin-bottom: 30px;
  padding: 15px 20px;
  border-radius: 4px;
  overflow: hidden;
  text-overflow: ellipsis;

  .contact-card-name {
    color: var(--shark);
    font: 'OpenSansBold', sans-serif;
    font-size: 18px;
    font-weight: 600;
    margin-right: 1.5rem;
  }

  .contact-main-container {
    display: flex;
    flex-direction: row;
    align-content: flex-start;
    justify-content: center;

    & > div {
      line-height: 1.7rem;
      justify-self: center;
      height: 2rem;
      flex: 1;
    }
  }

  .contact-preferences-container {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    font-weight: 600;

    & > div {
      max-width: 20rem;
      flex: 1;
      flex-wrap: wrap;
      font-size: 12px;
      margin-right: 1.5rem;
    }
  }
`;

export const StudentDetailContactCard: FunctionComponent<StudentDetailContactCardProps> = (
  props: StudentDetailContactCardProps,
) => {
  return (
    <StyledContactCard>
      <div className='contact-main-container'>
        <div>
          <span className='contact-card-name'>{`${props.firstname} ${props.lastname}`}</span>
          <span className='italics'>
            {' '}
            - {`${props.relationshiptostudent} ${props.isprimarycontact ? ' / Primary Contact' : ''}`}
          </span>
        </div>
      </div>
      <div className='contact-contact-info'>
        {props.primaryemailaddress && (
          <div className='contact-email'>
            <EmailIcon />
            {`${props.primaryemailaddress}`}
          </div>
        )}
        {props.phonenumber && (
          <div>
            <PhoneIcon />
            {`${props.phonenumber}`}
          </div>
        )}
      </div>
      {!props.isSibling && (
        <>
          <div className='contact-preferences-container'>
            <div>Preferred contact method: {props.preferredcontactmethod || 'None specified'}</div>
            <div>Best time to contact: {props.besttimetocontact || 'None specified'}</div>
          </div>
        </>
      )}
    </StyledContactCard>
  );
};
