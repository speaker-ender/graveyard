import styled from "styled-components";

interface IStyledInput {
}

export const StyledInput = styled.input<IStyledInput>`
    /* width: 100vw; */
    background: var(--tertiary);
    color: var(--text);
    border: none;
    padding: 10px 19px;
    border-radius: 5px;
    box-shadow: 0px 0px 1px rgba(255,0,0,0), 0px 0px 1px rgba(0,0,255,0);
    transition: box-shadow 450ms ease-in-out, background-color 250ms ease;

    &:hover,
    &:active,
    &:focus {
        background: var(--tertiary--light);
        box-shadow: 2px 2px 1px rgba(255,0,0,1), -2px -2px 1px rgba(0,0,255,1);
    }
`;

export const StyledSelect = styled.select<IStyledInput>`
    /* width: 100vw; */
    background: var(--tertiary);
    color: var(--text);
    border: none;
    padding: 10px 19px;
    border-radius: 5px;
    box-shadow: 0px 0px 1px rgba(255,0,0,0), 0px 0px 1px rgba(0,0,255,0);
    transition: box-shadow 450ms ease-in-out, background-color 250ms ease;

    &:hover,
    &:active,
    &:focus {
        background: var(--tertiary--light);
        box-shadow: 2px 2px 1px rgba(255,0,0,1), -2px -2px 1px rgba(0,0,255,1);
    }
`;
