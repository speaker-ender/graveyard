import { css } from "styled-components";
import { COLORS } from "./styles"

export const theme = {
    colors: {
        skyBlue: '#30c2f7',
        greyBlue: '#016097',
        blood: '#d80000',
        green: '#0afc47',
        black: '#000000',
        white: '#ffffff',
        dust: '#303030',
        sand: '#ece8d1',
    }
};


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
  --background: ${({ theme }) => theme.colors.white};
  --primary: ${({ theme }) => theme.colors.skyBlue};
  --secondary: ${({ theme }) => theme.colors.greyBlue};
  --tertiary: ${({ theme }) => theme.colors.sand};
`;

// set up dark theme CSS variables
export const darkThemeProps = css`
  --text: ${({ theme }) => theme.colors.white};
  --background: ${({ theme }) => theme.colors.black};
  --primary: ${({ theme }) => theme.colors.blood};
  --secondary: ${({ theme }) => theme.colors.green};
  --tertiary: ${({ theme }) => theme.colors.dust};
`;
