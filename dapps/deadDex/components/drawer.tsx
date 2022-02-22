import * as React from "react"
import { useState } from "react";
import { useCallback } from "react";
import { StyledDrawer, StyledDrawerContent, StyledDrawerTitle } from "./drawer.styles";

export interface IDrawer {
    title?: string;
    defaultOpen?: boolean;
    children?: React.ReactChild;
}

const Drawer: React.FC<IDrawer> = (props) => {
    const [open, setOpen] = useState(props.defaultOpen);

    const visibilityToggle = useCallback(() => {
        setOpen(!open);
    }, [open, setOpen]);

    return (
        <StyledDrawer open={!!open}>
            <StyledDrawerTitle open={!!open} onClick={() => visibilityToggle()}>{props.title}</StyledDrawerTitle>

            <StyledDrawerContent open={!!open}>
                {props.children}
            </StyledDrawerContent>
        </StyledDrawer>
    )
}

export default Drawer
