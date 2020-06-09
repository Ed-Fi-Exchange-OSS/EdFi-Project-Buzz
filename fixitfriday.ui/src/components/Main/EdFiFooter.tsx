import React from 'react';
import styled from 'styled-components';

let FooterStyle = styled.div`
  text-align: center;
`;

const EdFiFooter = () => (
  <FooterStyle>
    <div>
      &copy;2020 Ed-Fi Alliance, LLC. All Rights Reserved. For the latest information about Ed-Fi visit our website at
      Ed-Fi.org.
    </div>
  </FooterStyle>
);

export default EdFiFooter;
