import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ReactMultiSelect from '@khanacademy/react-multi-select';
import ReactSlider from 'react-slider';
import { Input } from 'reactstrap';

import { Colors } from 'styles';

const INPUT_HEIGHT = '2rem';

type LabelType = string;

const Label = styled.label`
  font-weight: bold;
`;

const Container = styled.div`
  margin-bottom: 1.5rem;

  .react-select {
    > div {
      min-height: ${INPUT_HEIGHT};
    }
  }
  .react-slider {
    display: flex;
    align-items: center;
  }
`;

type OptionValue = string | number;

type Option = {
  label: string;
  value: OptionValue;
};

type InputWrapperProps = {
  label?: LabelType;
};

const InputWrapper: React.FC<InputWrapperProps> = ({
  label,
  children,
  ...rest
}) => (
  <Container {...rest}>
    {label && <Label>{label}</Label>}
    {children}
  </Container>
);

type SelectProps = {
  options: Option[];
  placeholder?: string;
  defaultValue?: string[] | number[];
  onChange?(selected: string[]): void;
  label?: string;
};

export const Select: React.FC<SelectProps> = ({
  options,
  placeholder,
  defaultValue = [],
  onChange,
  label,
  ...rest
}) => {
  const [value, setValue] = useState<string[] | number[]>([]);
  useEffect(() => {
    setValue(defaultValue);
    // eslint-disable-next-line
  }, [JSON.stringify(defaultValue)]);

  return (
    <InputWrapper label={label}>
      <ReactMultiSelect
        options={options}
        selected={value}
        onSelectedChanged={(selectedOptions: string[]) => {
          setValue(selectedOptions);
          onChange?.(selectedOptions);
        }}
        disableSearch
        hasSelectAll={false}
        overrideStrings={{
          selectSomeItems: placeholder,
          allItemsAreSelected: 'Allt valið',
        }}
        {...rest}
      />
    </InputWrapper>
  );
};

const INPUT_DEBOUNCE = 1000;

let inputValue = '';

type TextInputProps = {
  onChange?(value: string): void;
  defaultValue?: string;
  placeholder?: string;
  label?: string;
};

export const TextInput: React.FC<TextInputProps> = ({
  onChange,
  label,
  ...rest
}) => {
  const handleChange = (text: string) => {
    inputValue = text;
    setTimeout(() => {
      if (text === inputValue) {
        onChange?.(text);
      }
    }, INPUT_DEBOUNCE);
  };

  return (
    <InputWrapper label={label}>
      <Input
        onChange={(event) => handleChange(event?.target?.value ?? '')}
        {...rest}
      />
    </InputWrapper>
  );
};

/* Slider */

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StyledSlider = styled(ReactSlider)`
  height: ${INPUT_HEIGHT};
  flex: 2;
`;

const StyledThumb = styled.div`
  height: ${INPUT_HEIGHT};
  width: ${INPUT_HEIGHT};
  background-color: orange;
  cursor: grab;
  border-radius: 50%;
  z-index: 0 !important;
`;

const Thumb = (props: any) => <StyledThumb {...props} />;

const StyledTrack = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60%;
  background-color: ${({ index }: { index: number }) =>
    index !== 1 ? Colors.GreyDarker : Colors.GreyDark};
  border-radius: 1rem;
  padding: 0 1rem;
`;

const Track = (props: any, state: any) => (
  <StyledTrack {...props} index={state.index} />
);

const ValueLabel = styled.div`
  flex: 1;
  font-size: 0.8rem;
  text-align: center;
`;

type SliderProps = {
  label?: LabelType;
  defaultValue?: OptionValue | OptionValue[];
  options: Option[];
  onChange?(selected: OptionValue | OptionValue[]): void;
};

export const Slider: React.FC<SliderProps> = ({
  label,
  options,
  defaultValue,
  onChange,
}) => {
  const lastIndex = options.length - 1;
  const isMultiple = Array.isArray(defaultValue);
  let defaultValueIndexes: number | number[];
  if (isMultiple) {
    defaultValueIndexes = (defaultValue as OptionValue[])
      .map((dv) => options.findIndex((option) => option.value === dv) ?? 0)
      .map((dv, idx) => (dv < 0 ? (idx === 0 ? 0 : options.length - 1) : dv));
  } else {
    defaultValueIndexes = options.findIndex(
      (option) => option.value === defaultValue,
    );
    defaultValueIndexes = defaultValueIndexes < 0 ? 0 : defaultValueIndexes;
  }
  const [value, setValue] = useState<number | number[]>(defaultValueIndexes);
  useEffect(() => {
    setValue(defaultValueIndexes);
    // eslint-disable-next-line
  }, [JSON.stringify(defaultValue)]);

  if (!options.length) {
    return <InputWrapper label={label} />;
  }

  const lowerLabel = (
    isMultiple ? options[(value as number[])[0]] : options[value as number]
  )?.label;
  const upperLabel = (
    isMultiple ? options[(value as number[])[1]] : options[lastIndex]
  )?.label;

  const handleChange = (value: number | number[]) => {
    onChange?.(
      isMultiple
        ? (value as number[]).map((v) => options[v].value)
        : options[value as number].value,
    );
  };

  return (
    <InputWrapper label={label}>
      <SliderContainer>
        <ValueLabel>{lowerLabel}</ValueLabel>
        <StyledSlider
          className="react-slider"
          renderTrack={Track}
          renderThumb={Thumb}
          min={0}
          max={lastIndex}
          defaultValue={defaultValueIndexes}
          onChange={(value) => setValue(value as number | number[])}
          onAfterChange={(value) => handleChange(value as number | number[])}
        />
        <ValueLabel>{upperLabel}</ValueLabel>
      </SliderContainer>
    </InputWrapper>
  );
};
