import React, { useCallback, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSwap } from '@fortawesome/duotone-light-svg-icons';
import ConverterContext from '../hooks/context';
import '../styles/switchButton.scss';

function SwitchButton(): React.JSX.Element {
  const {
    state: { data: { currencyFrom, currencyTo } },
    dispatch,
  } = useContext(ConverterContext);

  const handleCurrencySwitch = useCallback((): void => {
    if (currencyFrom && currencyTo) {
      dispatch({ type: 'SWITCH_CURRENCIES' });
    }
  }, [
    currencyFrom,
    currencyTo,
    dispatch,
  ]);

  return (
    <div className="switch-currencies">
      <button type="button"
        className="switch-currencies__button"
        title="Switch currencies"
        onClick={ handleCurrencySwitch }
        disabled={ !currencyFrom || !currencyTo }
        aria-label="Switch currencies"
      >
        <span aria-hidden="true">
          <FontAwesomeIcon icon={ faSwap } />
        </span>
      </button>
    </div>
  );
}

export default SwitchButton;
