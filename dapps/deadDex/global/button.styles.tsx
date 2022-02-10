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

    &:hover {
        background: darkgray;
    }
`;
