// import { gradient } from "global/animation.styles";
// import { LAYERS } from "global/layers.styles";
// import { COLORS } from "global/styles";
import { Header3 } from "./typography";
import styled from "styled-components";

interface IStyledButton {
}

export const StyledButton = styled.button<IStyledButton>`
    /* width: 100vw; */
    background: black;
    color: white;
    border: none;
    padding: 10px 19px;
    border-radius: 12px;
    box-shadow: 0px 0px 1px rgba(255,0,0,0), 0px 0px 1px rgba(0,0,255,0);
    transition: box-shadow 450ms ease-in-out, background-color 250ms ease;

    &:hover {
        background: rgba(0,0,0, 0.8);
        box-shadow: 3px 3px 1px rgba(255,0,0,1), -3px -3px 1px rgba(0,0,255,1);

    }
`;
