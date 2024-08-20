import { Flex, FormControl, IconButton, Input, Text } from '@chakra-ui/react';
import React from 'react';
import type { Control, ControllerRenderProps, FieldError } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { FormFields } from '../types';

import { ADDRESS_REGEXP } from 'lib/validations/address';
import IconSvg from 'ui/shared/IconSvg';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

const LIMIT = 10;

interface Props {
  control: Control<FormFields>;
  index: number;
  fieldsLength: number;
  error?: {
    name?: FieldError;
    address?: FieldError;
  };
  onAddFieldClick: (index: number) => void;
  onRemoveFieldClick: (index: number) => void;
  isDisabled?: boolean;
}

const ContractVerificationFieldLibraryItem = ({ control, index, fieldsLength, onAddFieldClick, onRemoveFieldClick, error, isDisabled }: Props) => {
  const { t } = useTranslation();
  const ref = React.useRef<HTMLDivElement>(null);

  const renderNameControl = React.useCallback(({ field }: {field: ControllerRenderProps<FormFields, `libraries.${ number }.name`>}) => {
    return (
      <FormControl variant="floating" id={ field.name } isRequired size={{ base: 'md', lg: 'lg' }}>
        <Input
          { ...field }
          required
          isInvalid={ Boolean(error?.name) }
          isDisabled={ isDisabled }
          maxLength={ 255 }
          autoComplete="off"
        />
        <InputPlaceholder text={ t('contractVerificationFieldLibraryItem.libraryNamePlaceholder') } error={ error?.name }/>
      </FormControl>
    );
  }, [ error?.name, isDisabled, t ]);

  const renderAddressControl = React.useCallback(({ field }: {field: ControllerRenderProps<FormFields, `libraries.${ number }.address`>}) => {
    return (
      <FormControl variant="floating" id={ field.name } isRequired size={{ base: 'md', lg: 'lg' }}>
        <Input
          { ...field }
          isInvalid={ Boolean(error?.address) }
          isDisabled={ isDisabled }
          required
          autoComplete="off"
        />
        <InputPlaceholder text={ t('contractVerificationFieldLibraryItem.libraryAddressPlaceholder') } error={ error?.address }/>
      </FormControl>
    );
  }, [ error?.address, isDisabled, t ]);

  const handleAddButtonClick = React.useCallback(() => {
    onAddFieldClick(index);
  }, [ index, onAddFieldClick ]);

  const handleRemoveButtonClick = React.useCallback(() => {
    onRemoveFieldClick(index);
  }, [ index, onRemoveFieldClick ]);

  React.useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <>
      <ContractVerificationFormRow>
        <Flex alignItems="center" justifyContent="space-between" ref={ ref } mt={ index !== 0 ? 6 : 0 }>
          <Text variant="secondary" fontSize="sm">
            { t('contractVerificationFieldLibraryItem.contractLibrary', { index: index + 1 }) }
          </Text>
          <Flex columnGap={ 5 }>
            { fieldsLength > 1 && (
              <IconButton
                aria-label={ t('contractVerificationFieldLibraryItem.delete') }
                variant="outline"
                w="30px"
                h="30px"
                onClick={ handleRemoveButtonClick }
                icon={ <IconSvg name="minus" w="20px" h="20px"/> }
                isDisabled={ isDisabled }
              />
            ) }
            { fieldsLength < LIMIT && (
              <IconButton
                aria-label={ t('contractVerificationFieldLibraryItem.add') }
                variant="outline"
                w="30px"
                h="30px"
                onClick={ handleAddButtonClick }
                icon={ <IconSvg name="plus" w="20px" h="20px"/> }
                isDisabled={ isDisabled }
              />
            ) }
          </Flex>
        </Flex>
      </ContractVerificationFormRow>
      <ContractVerificationFormRow>
        <Controller
          name={ `libraries.${ index }.name` }
          control={ control }
          render={ renderNameControl }
          rules={{ required: true }}
        />
        { index === 0 ? (
          <Text>{ t('contractVerificationFieldLibraryItem.libraryNameDescription') }</Text>
        ) : null }
      </ContractVerificationFormRow>
      <ContractVerificationFormRow>
        <Controller
          name={ `libraries.${ index }.address` }
          control={ control }
          render={ renderAddressControl }
          rules={{ required: true, pattern: ADDRESS_REGEXP }}
        />
        { index === 0 ? (
          <Text>{ t('contractVerificationFieldLibraryItem.libraryAddressDescription') }</Text>
        ) : null }
      </ContractVerificationFormRow>
    </>
  );
};

export default React.memo(ContractVerificationFieldLibraryItem);
