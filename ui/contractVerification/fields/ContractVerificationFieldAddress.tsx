import { FormControl, Input, chakra } from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps } from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { FormFields } from '../types';

import { ADDRESS_REGEXP, ADDRESS_LENGTH } from 'lib/validations/address';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

interface Props {
  isReadOnly?: boolean;
}

const ContractVerificationFieldAddress = ({ isReadOnly }: Props) => {
  const { t } = useTranslation();
  const { formState, control } = useFormContext<FormFields>();

  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<FormFields, 'address'>}) => {
    const error = 'address' in formState.errors ? formState.errors.address : undefined;

    return (
      <FormControl variant="floating" id={ field.name } isRequired size={{ base: 'md', lg: 'lg' }}>
        <Input
          { ...field }
          required
          isInvalid={ Boolean(error) }
          maxLength={ ADDRESS_LENGTH }
          isDisabled={ formState.isSubmitting || isReadOnly }
          autoComplete="off"
        />
        <InputPlaceholder text={ t('contractVerification.smartContractAddressPlaceholder') } error={ error }/>
      </FormControl>
    );
  }, [ formState.errors, formState.isSubmitting, isReadOnly, t ]);

  return (
    <>
      <ContractVerificationFormRow>
        <chakra.span fontWeight={ 500 } fontSize="lg" fontFamily="heading">
          { t('contractVerification.contract_address_to_verify') }
        </chakra.span>
      </ContractVerificationFormRow>
      <ContractVerificationFormRow>
        <Controller
          name="address"
          control={ control }
          render={ renderControl }
          rules={{ required: true, pattern: ADDRESS_REGEXP }}
        />
      </ContractVerificationFormRow>
    </>
  );
};

export default React.memo(ContractVerificationFieldAddress);
