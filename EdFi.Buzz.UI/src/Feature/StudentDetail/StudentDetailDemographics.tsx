/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */

import * as React from 'react';
import { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Demographic } from '../../Models';

const DemographicSection = styled.div`
  margin-bottom: 20px;
`;

const DemographicTitle = styled.div`
  text-decoration: underline;
`;

interface StudentDetailDemographicsProps {
  demographicsCharacteristics?: Demographic[];
  demographicsPrograms?: Demographic[];
}

export const StudentDetailDemographics: FunctionComponent<StudentDetailDemographicsProps> = (
  props: StudentDetailDemographicsProps
) => (
  <>
    {props.demographicsCharacteristics && props.demographicsCharacteristics.length > 0 &&
          <DemographicSection>
            <DemographicTitle className="bold row">
              <div className="col">Student Characteristics</div>
            </DemographicTitle>
            {props.demographicsCharacteristics.map((characteristic) =>
              <div key={characteristic.demographicskey} className="row">
                <div className="col">{characteristic.shortdescription}</div>
              </div>
            )}
          </DemographicSection>
    }
    {props.demographicsPrograms && props.demographicsPrograms.length > 0 &&
        <DemographicSection>
          <DemographicTitle className="bold row">
            <div className="col">Programs</div>
          </DemographicTitle>
          {props.demographicsPrograms.map((program) =>
            <div key={program.demographicskey}  className="row">
              <div className="col">{program.shortdescription}</div>
            </div>
          )}
        </DemographicSection>
    }
  </>
);
