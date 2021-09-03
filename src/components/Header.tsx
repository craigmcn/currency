import React from "react";
import Logo from "./Logo";

interface IProps {
    title: string;
}

const Header = ({ title }: IProps): JSX.Element => (
    <header className="header">
        <div className="brand">
            <a href="/">
                <Logo />
                craigmcn
            </a>
        </div>
        <h1>{ title }</h1>
    </header>
);

export default Header;
