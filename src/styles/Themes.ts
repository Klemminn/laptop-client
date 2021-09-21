import Colors from './Colors';

export type ThemeTypes = 'default' | 'secondary';

type ColorType = {
  background: string;
  font: string;
};

type ColorTypes = {
  [key in ThemeTypes]: ColorType;
};

export const ColorThemes: ColorTypes = {
  default: {
    background: Colors.GreyDark,
    font: Colors.White,
  },
  secondary: {
    background: Colors.GreyDark,
    font: Colors.White,
  },
};
