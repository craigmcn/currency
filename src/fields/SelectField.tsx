import React from "react";
import Select, { ValueType } from "react-select";

export interface ISelectOption {
    label: string;
    value: string;
}

interface IProps {
    label?: string;
    selectedOption?: ISelectOption;
    options?: ISelectOption[];
    error?: string;
    handleChange?: (value: ValueType<ISelectOption, false>) => void;
    formatOptionLabel?: (value: ISelectOption) => JSX.Element;
}

type TProps = Partial<HTMLInputElement> & IProps;

// react-select override styles
const grey600: string = "#7a7a7a"; // AlbertCSS
const customStyles = {
    control: (provided: object) => ({ ...provided, borderColor: grey600 }),
    dropdownIndicator: (provided: object) => ({ ...provided, color: grey600 }),
    indicatorSeparator: (provided: object) => ({
        ...provided,
        backgroundColor: grey600,
    }),
    placeholder: (provided: object) => ({ ...provided, color: grey600 }),
    singleValue: (provided: object) => ({
        ...provided,
        overflow: "visible",
        paddingRight: "0.5em",
        width: "100%",
    }),
};

export const SelectField: React.FC<TProps> = ({
    id,
    label,
    selectedOption,
    options,
    error,
    handleChange,
    formatOptionLabel
}) => (
    <div className="form__group">
        <label className="form__label" htmlFor={id}>
            {label}
        </label>
        {
            error &&
            <div className="form__control-error">{ error }</div>
        }
        <Select
            id={id}
            name={id}
            options={options}
            styles={customStyles}
            onChange={handleChange}
            value={selectedOption}
            formatOptionLabel={ formatOptionLabel }
        />
    </div>
);
