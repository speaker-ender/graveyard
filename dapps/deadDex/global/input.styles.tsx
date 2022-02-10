// import { gradient } from "global/animation.styles";
// import { LAYERS } from "global/layers.styles";
// import { COLORS } from "global/styles";
import styled from "styled-components";

interface IStyledInput {
}

export const StyledInput = styled.input<IStyledInput>`
    /* width: 100vw; */
    background: black;
    color: white;
    border: none;
    padding: 10px 19px;
    border-radius: 5px;
    box-shadow: none;

    &:hover {
        background: darkgray;
    }
`;
