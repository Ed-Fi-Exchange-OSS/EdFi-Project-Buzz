import { MainContainer } from 'buzztheme';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { LeftArrowIcon } from '../../common/Icons';

export interface PrivacyProps {
  title: string;
}
const BackToHome = styled(Link)`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-content: center;
    width: 100%;
    height: 2rem;
    margin-bottom: 0.5rem;

    & > div {
      padding: 0.3rem;
      width: min-content;
      flex: 1;
      height: auto;
      justify-content: flex-start;
    }

    & > img {
      height: auto;
      width: auto;
      align-self: center;
      justify-self: center;
    }
  `;
const Privacy: React.FunctionComponent<PrivacyProps> = ({title}) => (
  <MainContainer role='main' className='container'>
    <BackToHome
      to={{
        pathname: '/'
      }}>
      <LeftArrowIcon />
      <div>Go back to Home</div>
    </BackToHome>
    <article>
      <section>
        <h2>{title}: Terms of Use and Privacy Policy</h2>
        <p>
          <em>Revised August 2015</em>
        </p>
        <h3>Introduction</h3>
        <p>This Website Terms of Use &amp; Privacy Policy (“Terms of Use”) describes the conditions under which users (“Users”)
          of the website (“Website”) owned and operated by the Ed-Fi Alliance, LLC (EFA) may use the Website.
          The Website is www.ed-fi.org.</p>
        <h3>Content</h3>
        <p>The Website has been created by EFA, a Texas limited liability corporation. The Website and its contents, including,
          without limitation, all text and images, are owned and/or licensed by EFA. Reproduction, distribution, republication
          or retransmission of any Website material is prohibited unless the prior written permission of EFA has been obtained.
          EFA reserves the right to prohibit linking to the Website for any reason in its sole discretion.</p>
        <h3>No Warranty</h3>
        <p>The content on the Website has been prepared by EFA for general informational purposes only. While reasonable efforts
          have been made to ensure the information in the Website is accurate, the information is not guaranteed to be correct,
          complete or up-to-date. ALL WEBSITE INFORMATION IS PROVIDED ON AN “AS-IS WHERE-IS” BASIS. No warranty is made as to
          the accuracy of the content on the Website. EFA reserves the right to change Website content as needed, with retroactive
          effect as designated, to correct any errors or other information that may have been posted.</p>
        <h3>Linking</h3>
        <p>Nothing in the Website (including links to other sites) should be interpreted as promoting, referring, recommending,
          endorsing, guaranteeing, or warranting, any particular organization, program, service, product, entity or provider.
          All links or references to other websites are provided as a convenience only. Users of the Website acknowledge that
          linked or referenced websites are not operated or controlled by EFA and are governed by the terms of use and privacy
          policies of the operators of such other websites. Any interactions a User may have with any websites other than the
          Website, including, without limitation, uploading or otherwise disclosing personal information to such other websites,
          is in the sole discretion and control of the User. EFA reserves the right upon notice to prohibit linking to the Website
          for any reason in its sole discretion.</p>
        <h3>Collection of Non-Personalized User Data</h3>
        <p>EFA may collect general, non-personally identifiable information regarding usage and Users of the Website,
          including, without limitation, the name of the domain of each User, the IP protocol number of each User, and the
          date and time each web page was visited. Some pages may use cookies to maintain sessions or to automate navigation.
          A cookie is a small text file that the EFA web server places on a User’s computer hard drive to be a unique identifier
          of that computer. Cookies enable EFA to track usage patterns and other statistics, but do not collect personally identifiable
           information. EFA may use usage tracking and clickstream tracking to track all Users with cookies enabled. EFA cookies may
           not expire. Any Users wishing to utilize the Website but not want data about their activity collected can disable cookies
           on their computers prior to interacting with the site. Disabling cookies may limit the functionality of the User experience
           with the Website.</p>
        <h3>Collection of Personally Identifiable Information</h3>
        <p>EFA may collect personally identifiable information via the Website from Users who voluntarily provide such information.
          Personally identifiable information will not be collected by any method that does not involve an affirmative action
          on the part of the User to submit such information to EFA. Examples of situations in which the Website may collect
          personally identifiable information include, but are not limited to: email addresses of Users who send email to EFA;
          mailing addresses of Users who sign up for notification of upcoming events; content of on-line license application
          submissions. Users acknowledge and agree that EFA may use such information in any manner reasonably related to its
          charitable purpose. Such charitable purpose may include disclosure of personally identifiable information to EFA’s
          employees and third party contractors working on behalf of EFA in support of EFA’s administrative functions.</p>
        <h3>No Selling of Information</h3>
        <p>EFA will not sell any non-personalized user data or personally identifiable information to any other party.</p>
        <h3>Security of Communications/Information</h3>
        <p>While EFA makes reasonable efforts to secure communications over the Website, which may vary depending on the
          content of the information transmitted, EFA does not provide secure transactions at all times. EFA also makes
          reasonable efforts to maintain security measures and tools to protect against the loss or theft of information
          collected through the Website. However, no security measures can ensure complete privacy and confidentiality of
          information, and EFA cannot guarantee, and makes no warranty regarding, the security of any information transmitted
          or collected.</p>
        <h3>Compliance with Law</h3>
        <p>EFA will fully cooperate with any law enforcement authorities and comply with any court orders requesting
          EFA to disclose personally identifiable or other information requested by such authorities.</p>
        <h3>User Actions and User-Provided Information</h3>
        <p>Users agree that any information provided to EFA shall be accurate and complete. Users agree not to provide
          information to EFA that relates to any individuals (other than themselves) or entities without the permission
          of the individual or entity referenced. Users agree not to send unsolicited commercial email, including but
          not limited to spam, chain emails, advertising solicitations and similar email solicitations, to any email
          address provided on the Website. Users agree not to use any device, software or routine that interferes with
          the proper functioning of the Website or servers or networks connected to the Website, or take any other
          action that interferes with other parties’ use of the Website. Users agree not to use any “robot”, “spider”
          or other automatic or manual device or process for the purpose of compiling information on the Website for
          purposes other than for a generally available search engine. Users agree not to use the Website in any manner
          that may be infringing, for a commercial/advertising purpose, threatening, false, misleading, libelous,
          defamatory, obscene, or give rise to any criminal or civil liability. Users agree to comply with all
          applicable laws and regulations relating to User’s use of the Website.</p>
        <h3>No Users Under 13</h3>
        <p>The Website is intended for use by individuals who are 13 years old or older. The Website is not directed at
          children, and any individuals who are under 13 years of age should not use the Website.</p>
        <h3>User Feedback</h3>
        <p>EFA welcomes feedback about the Website from Users. Users acknowledge and agree that any feedback, or any
          other information, provided shall become the sole property of EFA, and EFA may use such feedback or
          information in any manner in its sole discretion.</p>
        <h3>Unsubscribing</h3>
        <p>Users may receive EFA announcements via email or other methods based on prior interactions
          Users may have had with the Website. To unsubscribe to such announcements, Users should follow the “unsubscribe”
          instructions provided in the email sent, or contact&nbsp;
        <a href="mailto:communications@ed-fi.org" target="_blank" rel="noopener noreferrer">communications@ed-fi.org</a>.</p>
        <h3>User Assumption of Risk; Release and Indemnification</h3>
        <p>Users assume all risks related to use of the Website. Each User agrees to indemnify, defend,
          and hold EFA (including its owners, heirs, successors, assigns, affiliates
          (including but not limited to the Michael &amp; Susan Dell Foundation), officers, directors, members,
          employees, agents and representatives) harmless from and against any losses, damages, liabilities or costs of
          any nature related in any manner to the use of the Website by such User. EFA shall not be liable to Users or
          any other parties for any claims for damages, whether direct, indirect, special, consequential, incidental
          or punitive, based on any cause of action whatsoever relating to use of the Website by any person or entity.</p>
        <h3>Users Who are Governmental Employees of Officials</h3>
        <p>EFA welcomes governmental employees and officials to peruse the EFA Website.
          If you choose to contact EFA for further information, you acknowledge that you are contacting
          EFA on behalf of your governmental body/agency to request the input and expertise of EFA for technical
          assistance on a specific project.</p>
        <h3>Governing Law</h3>
        <p>
          These Terms of Use are governed by the laws of the State of Texas, United States of America,
          without regard to choice of law provisions.
          The courts located in Austin, Texas, USA, shall have exclusive jurisdiction over any disputes relating to the Website.</p>
        <h3>Amendment</h3>
        <p>These Terms of Use may be amended at any time by EFA in its sole discretion.
          These Terms of Use constitute the entire agreement between EFA and the User relating to use of the Website.
        </p>
        <h3>Acceptance of Terms of Use</h3>
        <p>YOUR USE AND VIEWING OF THE WEBSITE INDICATES YOUR AFFIRMATIVE AGREEMENT TO THESE TERMS OF USE.
          IF YOU DO NOT AGREE WITH THESE TERMS OF USE, PLEASE DO NOT USE THE WEBSITE.</p>
      </section>
    </article>
    <BackToHome
      to={{
        pathname: '/'
      }}>
      <LeftArrowIcon />
      <div>Go back to Home</div>
    </BackToHome>
  </MainContainer>
);
Privacy.propTypes = {
  title: PropTypes.string
};
export default Privacy;
