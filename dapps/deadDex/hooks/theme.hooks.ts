import * as React from "react"
import { useCallback, useEffect, useState } from "react";
import { lightOrDark } from "../helpers/theme.helpers";

export const useGeneratedColorTheme = () => {
    const [backgroundColor, setBackgroundColor] = useState<string>(null!);
    const [textColor, setTextColor] = useState<string>(null!);


    const getAccountColor = (account: string) => {
        const color = account.substring(2).substring(0, 6);
        return `#${color}`;
    }

    const updateBackgroundColor = useCallback(async (newColorString: string) => {
        setBackgroundColor(getAccountColor(newColorString));
    }, [backgroundColor, setBackgroundColor]);

    const updateTextColor = useCallback(() => {
        const theme = lightOrDark(backgroundColor);
        setTextColor(theme == 'dark' ? 'white' : 'black');
    }, [backgroundColor, setTextColor]);

    useEffect(() => {
        !!backgroundColor && updateTextColor();
        return () => {
        }
    }, [backgroundColor])

    useEffect(() => {
        backgroundColor && updateBackgroundColor(backgroundColor);
        return () => {
        }
    }, [backgroundColor, setBackgroundColor])

    return { backgroundColor, updateBackgroundColor, textColor }
}

