import * as React from "react"
import { Web3ReactHooks, Web3ReactPriorityHooks } from "@web3-react/core";
import { useState } from "react";
import { Deployment } from "hardhat-deploy/types";
import { useCallback } from "react";
import { Web3ReactActiveHooks } from "hooks/connector.hooks";
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
