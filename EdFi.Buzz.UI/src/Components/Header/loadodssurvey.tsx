/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */

import React, { FunctionComponent, useState, useEffect } from 'react';
import styled from 'styled-components';
import Icon from '@iconify/react';
import mdCloudDownload from '@iconify-icons/ion/md-cloud-download';
import { Link, useHistory } from 'react-router-dom';
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
  const history = useHistory();
  const [canLoadSurverysFromUI, setCanLoadSurverysFromUI] = useState(false);
  const [doesOdsContainsSurveyModel, setDoesOdsContainsSurveyModel] = useState(false);

  useEffect(()=> {
    let unmounted = false;

    props.api.odsSurvey.getCanLoadSurverysFromUI().then((result) => {
      if (!unmounted) {
        setCanLoadSurverysFromUI(result);
      }
    });

    props.api.odsSurvey.getCanLoadSurverysFromUI().then((result) => {
      if (!unmounted) {
        setDoesOdsContainsSurveyModel(result);
      }
    });

    return () => {
      unmounted = true;
    };
  }, [props.api.odsSurvey]);

  const goToLoadodssurvey = (event) => {
    if(event.key === 'Enter'){
      history.push('/loadodssurvey');
    }
  };

  return (
    <>
      {props.isAdminSurveyLoader && canLoadSurverysFromUI && doesOdsContainsSurveyModel
        ? <li tabIndex={1} onKeyPress={goToLoadodssurvey}>
          <Link to="/loadodssurvey">
            <LinkButton><Icon icon={mdCloudDownload}></Icon>&nbsp;ODS Surveys</LinkButton>
          </Link>
        </li>
        : null}
    </>
  );
};
