import React, { Fragment } from 'react';
import './App.css';
import Header from './components/Header';
import Main from './components/Main';
import Converter from './components/Converter';

function App() {
  return (
    <Fragment>
      <Header title="Currency Converter" />

      <Main layout="fixed">
        <h1>Convert a currency</h1>
        <Converter />
      </Main>
    </Fragment>
  );
}

export default App;
