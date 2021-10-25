import React from 'react'
import Select, { OptionProps, SingleValue } from 'react-select'
import { FormatOptionLabelMeta } from 'react-select/dist/declarations/src/Select'

export interface ISelectOption {
    label: string;
    value: string;
}

interface IProps {
    label?: string;
    selectedOption?: ISelectOption;
    options?: ISelectOption[];
    error?: string;
    searchable?: boolean;
    handleChange?: (value: SingleValue<ISelectOption>) => void;
    formatOptionLabel?: (value: ISelectOption, meta: FormatOptionLabelMeta<ISelectOption>) => JSX.Element;
}

type TProps = Partial<HTMLInputElement> & IProps;

// react-select override styles
const grey600 = '#727276' // AlbertCSS
const customStyles = {
    control: (provided: Record<string, unknown>) => ({ ...provided, borderColor: grey600 }),
    dropdownIndicator: (provided: Record<string, unknown>) => ({ ...provided, color: grey600 }),
    indicatorSeparator: (provided: Record<string, unknown>) => ({
        ...provided,
        backgroundColor: grey600,
    }),
    option: (provided: Record<string, unknown>, state: OptionProps<ISelectOption, false>) => ({
        ...provided,
        backgroundColor: state.isSelected
            ? '#005b99'
            : state.isFocused
                ? 'rgba(0, 91, 153, 0.1)'
                : '',
    }),
    placeholder: (provided: Record<string, unknown>) => ({ ...provided, color: grey600 }),
    singleValue: (provided: Record<string, unknown>) => ({
        ...provided,
        overflow: 'visible',
        paddingRight: '0.5em',
        width: '100%',
    }),
}

export const SelectField = (props: TProps): JSX.Element => {
    const {
        id,
        label,
        selectedOption,
        options,
        error,
        searchable,
        handleChange,
        formatOptionLabel,
    } = props

    return (
        <div className="form__group">
            <label className="form__label" htmlFor={ id }>
                { label }
            </label>
            { error &&
                <div className="form__control-error">{ error }</div>
            }
            <Select
                id={ id }
                name={ id }
                options={ options }
                styles={ customStyles }
                onChange={ handleChange }
                value={ selectedOption }
                formatOptionLabel={ formatOptionLabel }
                isSearchable={ searchable }
            />
        </div>
    )
}
