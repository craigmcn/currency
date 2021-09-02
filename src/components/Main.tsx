import * as React from "react";

interface IProps {
    layout?: string;
}

const Main: React.FC<IProps> = ({ layout, children }) => {
    const mainLayout = layout ? ` main--${layout}` : "";

    return (
        <main className={ `main${mainLayout}` }>
            { children }
        </main>
    );
};

export default Main;
