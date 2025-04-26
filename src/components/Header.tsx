import React from 'react';
import Logo from './Logo';

interface IProps {
  title: string;
}

function Header({ title }: IProps): React.JSX.Element {
  return (
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
}

export default Header;
