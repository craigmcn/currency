import React, { ChangeEvent } from "react";

interface IProps {
    label?: string;
    handleChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

type TProps = Partial<HTMLInputElement> & IProps;

export const TextField: React.FC<TProps> = ({ id, label, handleChange }) => (
    <div className="form__group">
        <label className="form__label" htmlFor={id}>
            {label}
        </label>
        <input
            id={id}
            name={id}
            className="form__control"
            type="text"
            onChange={handleChange}
        />
    </div>
);
