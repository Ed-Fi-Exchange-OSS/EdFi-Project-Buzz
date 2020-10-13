import * as React from 'react';
import { FunctionComponent, ReactFragment } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
import UserGroupIcon from 'assets/user-group.svg';
import SurveyIcon from 'assets/graph-pie.svg';

interface CustomTabLinkComponentProps {
  children: ReactFragment;
  to: string;
  activeOnlyWhenExact?: boolean;
  src: string;
}

function CustomTabLink({
  to,
  activeOnlyWhenExact,
  children,
  src
}: CustomTabLinkComponentProps) {
  const match = useRouteMatch({
    path: to,
    exact: activeOnlyWhenExact
  });
  const CustomTabLinkStyle = styled.div`
    display: inline-block;
	  padding: 1.0em 0.5em;
    height: 100%;
    width: 100%;
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: var(--dark-grey);
    background-color: #FFFFFF;
    &.active {
      background-color: #ebf1f3;
    }
  `;

  const IconStyle = styled.img`
    width: 22px;
    height: 22px;
    object-fit: contain;
  `;
  return (
    <CustomTabLinkStyle className={match ? 'active' : ''}>
      <Link to={to}>
        <IconStyle src={src} /><br />
        {children}
      </Link>
    </CustomTabLinkStyle>
  );
}

export interface FooterComponentProps {
  title?: string;
  height: number;
}

export const Footer: FunctionComponent<FooterComponentProps> = (props: FooterComponentProps
) => {
  const {height} = props;
  const MobileFooter = styled.div`
    display: none;
    @media(max-width:768px){
      display: flex;
      height: ${height}px;
      width: 100vw;
      max-width: 100vw;
      overflow-x: hidden;
      border-bottom: 1px solid #D7DBDD;
      position:fixed;
      bottom:0px;
      align-items: flex-end;
    }
  `;

  const FooterTab = styled.div`
    cursor: pointer;
    width:100%;
    height: ${height}px;
    padding: 0px 0px;
    border-top: solid 2px #ced5d8;
    text-align: center;
    bottom:0px;
    a{
      color: var(--dark-grey);
    };
`;
  return <MobileFooter>
    <FooterTab>
      <CustomTabLink src={UserGroupIcon} to="/" activeOnlyWhenExact={true}>Class Roster</CustomTabLink>
    </FooterTab>
    <FooterTab>
      <CustomTabLink src={SurveyIcon} to="/surveyAnalytics" >Surveys</CustomTabLink>
    </FooterTab>
  </MobileFooter>;
};
