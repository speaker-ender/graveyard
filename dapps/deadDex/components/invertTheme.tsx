import * as React from "react"
import { StyledInvertThemeButton } from "./invertTheme.styles";

export interface IInvertTheme {
    invertTheme: () => void;
}

const InvertTheme: React.FC<IInvertTheme> = ({ invertTheme }) => {

    return (
        <StyledInvertThemeButton onClick={() => invertTheme()}>
            Set
        </StyledInvertThemeButton>
    )
}

export default InvertTheme
