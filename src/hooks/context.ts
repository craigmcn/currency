import { createContext } from 'react';
import { IConversionState } from '../types';
import { defaultState } from '../hooks/reducers';

interface IContextProps {
  state: IConversionState;
  dispatch: React.Dispatch<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const ConverterContext = createContext<IContextProps>({
  state: defaultState,
  dispatch: () => null,
});

export { ConverterContext as default };
