import * as React from 'react';

interface IProps {
    fixed?: boolean;
    children?: React.ReactNode;
}

const Main: React.FC<IProps> = ({ fixed, children }) => {
    const mainFixed = fixed ? ' main--fixed' : '';

    return (
        <main className={ `main${mainFixed}` }>
            { children }
        </main>
    );
};

export default Main;
