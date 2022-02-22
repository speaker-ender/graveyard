import { css } from "styled-components";

export const PanelStyles = css`
    width: 85vw;
    margin: auto;
    margin-top: 85px;
    margin-bottom: 85px;
    padding: 15px;
    border-radius: ${props => props.theme.rounding.borderRadius};
    box-shadow: 10px 10px 1px red, -10px -10px 1px blue;
    transition: background-color 250ms ease;
`