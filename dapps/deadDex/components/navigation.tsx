import Link from 'next/link';
import * as React from "react";
import { StyledNavigation, StyledNavigationLink } from './navigation.styles';

interface INavigation {
    open: boolean;
    updateNavOpen: (navState?: boolean) => void;
}

const Navigation: React.FC<INavigation> = (props) => {

    const handleClick = () => {
        props.updateNavOpen()
    }

    return (
        <StyledNavigation open={!!props.open} onClick={() => props.updateNavOpen()}>
            <StyledNavigationLink><Link href={'/'}>Home</Link></StyledNavigationLink>
            <StyledNavigationLink><Link href={'/swapper'}>Swapper</Link></StyledNavigationLink>
            <StyledNavigationLink><Link href={'/debug'}>Debug</Link></StyledNavigationLink>
        </StyledNavigation>
    )
}

export default Navigation;