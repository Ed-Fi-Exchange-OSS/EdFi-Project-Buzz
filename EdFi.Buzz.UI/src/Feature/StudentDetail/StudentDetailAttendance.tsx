/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */

import * as React from 'react';
import { FunctionComponent } from 'react';
import { RadialGauge, RadialGaugeSeries, RadialGaugeArc, ChartTooltip } from 'reaviz';
import styled from 'styled-components';
import { Attendance } from '../../Models';

const ChartContainer = styled.div`
  width: 50%;
  margin: 0 auto;
`;

interface StudentDetailAttendanceProps {
  attendance: Attendance;
}

export const StudentDetailAttendance: FunctionComponent<StudentDetailAttendanceProps> = (
  props: StudentDetailAttendanceProps
) => {

  const heightAndWidth=190;
  const minValue=0;
  const maxValue=100;
  const arcWidth=15;
  const cornerRadius=1.5;
  const tooltipPlacement='right';
  const colorScheme='#007cba';

  return (
    <>
      {props.attendance
        ? <ChartContainer>
          <RadialGauge
            data={[
              {
                'key': 'Present at school %',
                'data': props.attendance.reportedaspresentatschool
              }
            ]}
            height={heightAndWidth}
            width={heightAndWidth}
            minValue={minValue}
            maxValue={maxValue}
            series={
              <RadialGaugeSeries
                arcWidth={arcWidth}
                colorScheme={colorScheme}
                innerArc={
                  <RadialGaugeArc cornerRadius={cornerRadius} tooltip={
                    <ChartTooltip
                      placement={tooltipPlacement}
                    />
                  } />
                }
              />
            }
          />
          <RadialGauge
            data={[
              {
                'key': 'Present at homeroom %',
                'data': props.attendance.reportedaspresentathomeroom
              }
            ]}
            height={heightAndWidth}
            width={heightAndWidth}
            minValue={minValue}
            maxValue={maxValue}
            series={
              <RadialGaugeSeries
                arcWidth={arcWidth}
                colorScheme={colorScheme}
                innerArc={
                  <RadialGaugeArc cornerRadius={cornerRadius} tooltip={
                    <ChartTooltip
                      placement={tooltipPlacement}
                    />
                  } />
                }
              />
            }
          />
          <RadialGauge
            data={[
              {
                'key': 'Present all sections %',
                'data': props.attendance.reportedasispresentinallsections
              }
            ]}
            height={heightAndWidth}
            width={heightAndWidth}
            minValue={minValue}
            maxValue={maxValue}
            series={
              <RadialGaugeSeries
                arcWidth={arcWidth}
                colorScheme={colorScheme}
                innerArc={
                  <RadialGaugeArc cornerRadius={cornerRadius} tooltip={
                    <ChartTooltip
                      placement={tooltipPlacement}
                    />
                  } />
                }
              />
            }
          />
        </ChartContainer>
        : null
      }
    </>
  );
};
