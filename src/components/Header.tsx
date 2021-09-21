import React from 'react';
import styled from 'styled-components';

import { Colors } from 'styles';

import LaptopLogo from 'assets/logo.png';
import { Link } from 'react-router-dom';

const HEIGHT = '5rem';

const Spacer = styled.div`
  height: ${HEIGHT};
`;

const HeaderContainer = styled.div`
  position: fixed;
  width: 100%;
  padding: 1rem;
  height: ${HEIGHT};
  background-color: ${Colors.GreyHeader};
  z-index: 1;
`;

const LogoImage = styled.img`
  height: 3rem;
  text-align: center;
`;

type HeaderProps = {
  showLogo?: boolean;
};

const Logo: React.FC<HeaderProps> = ({ showLogo }) => (
  <>
    <HeaderContainer>
      {showLogo && (
        <Link to="/">
          <LogoImage src={LaptopLogo} />
        </Link>
      )}
    </HeaderContainer>
    <Spacer />
  </>
);

export default Logo;
