import * as React from 'react';

interface IProps {
  fixed?: boolean;
  children?: React.ReactNode;
}

function Main({ fixed, children }: IProps): React.JSX.Element {
  const mainFixed = fixed ? ' main--fixed' : '';

  return (
    <main className={ `main${mainFixed}` }>
      { children }
    </main>
  );
};

export default Main;
