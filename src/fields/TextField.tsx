import React, { ChangeEvent, DetailedHTMLProps, InputHTMLAttributes, KeyboardEvent } from 'react';

interface IProps {
  label?: string;
  error?: string;
  handleChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  handleKeyPress?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

type TProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & IProps;

export function TextField({ id, label, inputMode, error, handleChange, handleKeyPress }: TProps): React.JSX.Element {
  return (
    <div className="form__group">
      <label className="form__label" htmlFor={ id }>
        { label }
      </label>

      { error &&
      <div className="form__control-error">{ error }</div>
      }

      <input
        id={ id }
        name={ id }
        className={ `form__control${ error ? ' form__control--hasError' : ''}` }
        type="text"
        inputMode={ inputMode }
        onChange={ handleChange }
        onKeyPress={ handleKeyPress }
      />
    </div>
  );
}
