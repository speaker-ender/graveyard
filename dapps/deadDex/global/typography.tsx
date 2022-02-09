import styled from "styled-components";

export const FONTS = {
    main: `"Arial Black", Arial, Helvetica, sans-serif`,
    mainBold: `"Arial Black", Arial, Helvetica, sans-serif`,
    secondary: `"Arial Black", Arial, Helvetica, sans-serif`
};

export const Header1 = styled.h1`
    font-family: ${FONTS.mainBold};
    font-size: 6rem;
    text-transform: uppercase;
    letter-spacing: 0.1rem;
`;

export const Header2 = styled.h2`
    font-family: ${FONTS.main};
    font-size: 4rem;
    text-transform: uppercase;
`;

export const Header3 = styled.h3`
    font-family: ${FONTS.mainBold};
    font-size: 3rem;
    text-transform: uppercase;
`;

export const Header5 = styled.h5`
    font-family: ${FONTS.mainBold};
    font-size: 1.2rem;
`;

export const Paragraph = styled.p`
    font-family: ${FONTS.main};
    font-size: 1rem; 
`