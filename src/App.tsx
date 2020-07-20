import React, { Fragment } from 'react';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faSyncAlt, faExclamationTriangle, faPlayCircle } from '@fortawesome/pro-regular-svg-icons'

import Header from './components/Header';
import Main from './components/Main';
import Converter from './containers/Converter';

library.add(faSyncAlt, faExclamationTriangle, faPlayCircle)

const App: React.FC = () => (
  <Fragment>
    <Header title="Currency Converter" />

    <Main layout="fixed">
      <h1>Convert a currency</h1>
      <Converter />
    </Main>
  </Fragment>
);

export default App;
