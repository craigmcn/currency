import * as React from 'react';

interface IProps {
    title: string;
}

const Header: React.FC<IProps> = ({ title }) => (
  <header className="header">
    <div className="brand">
        <img src="/nameplate.2020-01-19.png" alt="" width="40" />
        craigmcn
    </div>
    <h1>{ title }</h1>
  </header>
)

export default Header
