/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */

import React, { FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import Icon from '@iconify/react';
import mdBuild from '@iconify-icons/ion/md-build';
import { Link } from 'react-router-dom';
import ApiService from 'Services/ApiService';

const LinkButton = styled.button`
  padding: .5em 0em;
  color: var(--nevada);
  text-transform: uppercase;
  border: none;
  font-weight: bold;
  color: var(--nevada);
`;

interface LoadOdsSurveysMenuOptionProps {
  isAdminSurveyLoader: boolean;
  api: ApiService;
}

export const LoadOdsSurveysMenuOption: FunctionComponent<LoadOdsSurveysMenuOptionProps> = (
  props: LoadOdsSurveysMenuOptionProps
) => {
  const [canLoadSurverysFromUI, setCanLoadSurverysFromUI] = useState(false);
  const [doesOdsContainsSurveyModel, setDoesOdsContainsSurveyModel] = useState(false);

  function getCanLoadSurverysFromUI() {
    props.api.odsSurvey.getCanLoadSurverysFromUI().then((result) => {
      setCanLoadSurverysFromUI(result);
    });
  }

  function getDoesOdsContainsSurveyModel() {
    props.api.odsSurvey.getCanLoadSurverysFromUI().then((result) => {
      setDoesOdsContainsSurveyModel(result);
    });
  }

  getCanLoadSurverysFromUI();
  getDoesOdsContainsSurveyModel();

  return (
    <>
      {props.isAdminSurveyLoader && canLoadSurverysFromUI && doesOdsContainsSurveyModel
        ? <li >
          <Link to="/loadodssurvey">
            <LinkButton><Icon icon={mdBuild}></Icon>&nbsp;Load Surveys from ODS</LinkButton>
          </Link>
        </li>
        : null}
    </>
  );
};
