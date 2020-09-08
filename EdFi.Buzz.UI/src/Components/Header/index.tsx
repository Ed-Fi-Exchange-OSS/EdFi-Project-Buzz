import * as React from 'react';
import { FunctionComponent, ReactFragment } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';

export interface HeaderComponentProps {
  title?: string;
}

export const Header: FunctionComponent<HeaderComponentProps> = (
  props: HeaderComponentProps
) => (
  <div>
      Header {props.title ?? ''}
    <ul>
      <li> <CustomLink to="/login">Login (/login)</CustomLink> </li>
      <li> <CustomLink to="/" activeOnlyWhenExact={true}> Student Roster (/)</CustomLink> </li>
      <li> <CustomLink to="/studentDetail/1">Student Detail (/studentDetail/1) </CustomLink> </li>
      <li> <CustomLink to="/surveyAnalytics">Survey Analytics (/surveyAnalytics)</CustomLink> </li>
      <li> <CustomLink to="/uploadSurvey" activeOnlyWhenExact={true}> Upload Survey (/uploadSurvey)</CustomLink> </li>
      <li> <CustomLink to="/uploadSurvey/1">Upload Survey (/uploadSurvey/1)</CustomLink> </li>
      <li> <CustomLink to="/adminSurvey">Admin Survey (/adminSurvey)</CustomLink> </li>
    </ul>
  </div>
);

interface CustomLikComponentProps {
  children: ReactFragment;
  to: string;
  activeOnlyWhenExact?: boolean;
}

function CustomLink({
  to,
  activeOnlyWhenExact,
  children
}: CustomLikComponentProps) {
  const match = useRouteMatch({
    path: to,
    exact: activeOnlyWhenExact
  });

  return (
    <div className={match ? 'active' : ''}>
      {match && '> '}
      <Link to={to}>{children}</Link>
    </div>
  );
}
