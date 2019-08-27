import React from 'react';

const Main = ({ layout, children }) => {
  const mainLayout = layout ? ` main--${layout}` : ''
  return (
    <main className={`main${mainLayout}`}>
      {children}
    </main>
  )
}

export default Main