import { PanelStyles } from "global/panel.styles";
import { Header3Style } from "global/typography";
import styled from "styled-components";

export const StyledSwapper = styled.div`
    ${PanelStyles}
    background-color: var(--background-invert);
    color: var(--text-invert);
`

export const StyledSwapperHeader = styled.div`
    ${Header3Style}
`