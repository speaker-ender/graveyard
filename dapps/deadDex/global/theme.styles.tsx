import { css } from "styled-components";
import { COLORS } from "./styles"

export const theme = {
    colors: {
        skyBlue: '#30c2f7',
        skyBlueLight: '#80ddff',
        skyBlueDark: '#0e93c4',
        greyBlue: '#016097',
        blood: '#d80000',
        bloodLight: '#ff3e3e',
        bloodDark: '#6b0101',
        green: '#0afc47',
        black: '#000000',
        white: '#ffffff',
        dust: '#303030',
        dustLight: '#3f3f3f',
        dustDark: '#1a1919',
        sand: '#ece8d1',
        sandLight: '#f3f2ea',
        sandDark: '#afab91',
    },
    isInvert: false,
    rounding: {
        borderRadius: '25px',
    }
};

export type ThemeType = typeof theme;


export const LIGHT_THEME = {
    foreground: COLORS.black,
    background: COLORS.white,
    text: COLORS.black,
    primary: COLORS.skyBlue,
    secondary: COLORS.greyBlue,
}

export const DARK_THEME = {
    foreground: COLORS.white,
    background: COLORS.black,
    text: COLORS.white,
    primary: COLORS.blood,
    secondary: COLORS.green
}

export const lightThemeProps = css`
  --text: ${({ theme }) => theme.colors.black};
  --text-invert: ${({ theme }) => theme.colors.white};
  --background: ${({ theme }) => theme.colors.white};
  --background-invert: ${({ theme }) => theme.colors.black};
  --primary: ${({ theme }) => theme.colors.skyBlue};
  --primary--light: ${({ theme }) => theme.colors.skyBlueLight};
  --primary--dark: ${({ theme }) => theme.colors.skyBlueDark};
  --secondary: ${({ theme }) => theme.colors.greyBlue};
  --secondary--light: ${({ theme }) => theme.colors.greyBlue};
  --secondary--dark: ${({ theme }) => theme.colors.greyBlue};
  --tertiary: ${({ theme }) => theme.colors.sand};
  --tertiary--light: ${({ theme }) => theme.colors.sandLight};
  --tertiary--dark: ${({ theme }) => theme.colors.sandDark};
`;

// set up dark theme CSS variables
export const darkThemeProps = css`
  --text: ${({ theme }) => theme.colors.white};
  --text-invert: ${({ theme }) => theme.colors.black};
  --background: ${({ theme }) => theme.colors.black};
  --background-invert: ${({ theme }) => theme.colors.white};
  --primary: ${({ theme }) => theme.colors.blood};
  --primary--light: ${({ theme }) => theme.colors.bloodLight};
  --primary--dark: ${({ theme }) => theme.colors.bloodDark};
  --secondary: ${({ theme }) => theme.colors.green};
  --secondary--light: ${({ theme }) => theme.colors.green};
  --secondary--dark: ${({ theme }) => theme.colors.green};
  --tertiary: ${({ theme }) => theme.colors.dust};
  --tertiary--light: ${({ theme }) => theme.colors.dustLight};
  --tertiary--dark: ${({ theme }) => theme.colors.dustDark};
`;
