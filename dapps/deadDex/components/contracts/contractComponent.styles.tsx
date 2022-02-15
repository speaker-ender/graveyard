import { Header3Style } from "global/typography";
import styled from "styled-components";

export const StyledContract = styled.div`
    width: 85vw;
    margin: auto;
    margin-top: 85px;
    margin-bottom: 85px;
    padding: 15px;
    border-radius: 25px;
    box-shadow: 10px 10px 1px red, -10px -10px 1px blue;
    transition: background-color 250ms ease;
`

export const StyledContractHeader = styled.div`
        ${Header3Style}
        cursor: pointer;
        user-select: none;
`

export const StyledContractContent = styled.div`

`