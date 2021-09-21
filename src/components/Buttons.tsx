import React from 'react';
import styled from 'styled-components';
import {
  Button as BootstrapButton,
  ButtonProps as BootstrapButtonProps,
} from 'reactstrap';
import { FaBars } from 'react-icons/fa';

import { Themes } from 'styles';
import Link from './Link';

type ButtonProps = BootstrapButtonProps & {
  color?: Themes.ThemeTypes;
  to?: string;
};

const StyledButton = styled(BootstrapButton)<ButtonProps>`
  border: none;
  ${({ color }) => `
    background-color: ${Themes.ColorThemes[color ?? 'default'].background};
    color: ${Themes.ColorThemes[color ?? 'default'].font}
  `}
}`;

export const Button: React.FC<ButtonProps> = ({ to, ...rest }) =>
  to ? (
    <Link to={to}>
      <StyledButton {...rest} />
    </Link>
  ) : (
    <StyledButton {...rest} />
  );

const IconButtonContainer = styled(Button)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  svg {
    margin-right: 0.5rem;
  }
`;

type IconButtonProps = ButtonProps & {
  icon: JSX.Element;
};

const IconButton: React.FC<IconButtonProps> = ({ icon, children, ...rest }) => (
  <IconButtonContainer {...rest}>
    {icon}
    {children}
  </IconButtonContainer>
);

const UnstyledMenuButton: React.FC<ButtonProps> = ({ ...rest }) => (
  <IconButton icon={<FaBars />} {...rest} />
);

export const MenuButton = styled(UnstyledMenuButton)`
  position: absolute;
  display: flex;
  background-color: transparent;
  justify-content: center;
  font-size: 2rem;
  height: 5rem;
  padding: 1.5rem;
  margin-left: 0.5rem;
  z-index: 2;
`;
