import React, { ChangeEvent } from "react";

interface IProps {
    label?: string;
    error?: string;
    handleChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

type TProps = Partial<HTMLInputElement> & IProps;

export const TextField = ({ id, label, error, handleChange }: TProps): JSX.Element => (
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
            className={ `form__control${ error ? " form__control--hasError" : ""}` }
            type="text"
            onChange={ handleChange }
        />
    </div>
);
