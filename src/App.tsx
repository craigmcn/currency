import React, { Fragment } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Converter from "./containers/Converter";

const App = (): JSX.Element => (
    <Fragment>
        <Header title="Currency Converter" />

        <Main fixed>
            <h1>Convert a currency</h1>
            <Converter />
        </Main>
    </Fragment>
);

export default App;
