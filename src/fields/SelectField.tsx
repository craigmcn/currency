import React from 'react';
import Select, { OptionProps, SingleValue } from 'react-select';
import { FormatOptionLabelMeta } from 'react-select/dist/declarations/src/Select';

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
  formatOptionLabel?: (value: ISelectOption, meta: FormatOptionLabelMeta<ISelectOption>) => React.JSX.Element;
}

type TProps = Partial<HTMLInputElement> & IProps;

// react-select override styles
const customStyles = {
  control: (provided: Record<string, unknown>) => ({ ...provided, backgroundColor: 'var(--white)', borderColor: 'var(--grey600)', color: 'var(--black)' }),
  dropdownIndicator: (provided: Record<string, unknown>) => ({ ...provided, color: 'var(--grey600)' }),
  indicatorSeparator: (provided: Record<string, unknown>) => ({
    ...provided,
    backgroundColor: 'var(--grey600)',
  }),
  menu: (provided: Record<string, unknown>) => ({
    ...provided,
    backgroundColor: 'var(--white)',
  }),
  option: (provided: Record<string, unknown>, state: OptionProps<ISelectOption, false>) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? 'var(--primary)'
      : state.isFocused
        ? 'var(--primaryTransparent)'
        : '',
    color: state.isSelected ? 'var(--primaryContrast)' : 'var(--black)',
  }),
  placeholder: (provided: Record<string, unknown>) => ({ ...provided, color: 'var(--grey600)' }),
  singleValue: (provided: Record<string, unknown>) => ({
    ...provided,
    color: 'var(--black)',
    overflow: 'visible',
    paddingRight: '0.5em',
    width: '100%',
  }),
};

export function SelectField(props: TProps): React.JSX.Element {
  const {
    id,
    label,
    selectedOption,
    options,
    error,
    searchable,
    handleChange,
    formatOptionLabel,
  } = props;

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
  );
}
