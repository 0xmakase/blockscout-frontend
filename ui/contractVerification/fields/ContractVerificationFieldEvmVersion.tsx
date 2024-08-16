import { Link } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import type { ControllerRenderProps } from 'react-hook-form';
import { useFormContext, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { FormFields } from '../types';
import type { SmartContractVerificationConfig } from 'types/client/contract';

import { getResourceKey } from 'lib/api/useApiQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import FancySelect from 'ui/shared/FancySelect/FancySelect';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

interface Props {
  isVyper?: boolean;
}

const ContractVerificationFieldEvmVersion = ({ isVyper }: Props) => {
  const { t } = useTranslation();
  const { formState, control } = useFormContext<FormFields>();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const config = queryClient.getQueryData<SmartContractVerificationConfig>(getResourceKey('contract_verification_config'));

  const options = React.useMemo(() => (
    (isVyper ? config?.vyper_evm_versions : config?.solidity_evm_versions)?.map((option) => ({ label: option, value: option })) || []
  ), [ config?.solidity_evm_versions, config?.vyper_evm_versions, isVyper ]);

  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<FormFields, 'evm_version'>}) => {
    const error = 'evm_version' in formState.errors ? formState.errors.evm_version : undefined;

    return (
      <FancySelect
        { ...field }
        options={ options }
        size={ isMobile ? 'md' : 'lg' }
        placeholder={ t('contractVerificationFieldEvmVersion.evmVersionPlaceholder') }
        isDisabled={ formState.isSubmitting }
        error={ error }
        isRequired
      />
    );
  }, [ formState.errors, formState.isSubmitting, isMobile, options, t ]);

  return (
    <ContractVerificationFormRow>
      <Controller
        name="evm_version"
        control={ control }
        render={ renderControl }
        rules={{ required: true }}
      />
      <>
        <span>{ t('contractVerificationFieldEvmVersion.evmVersionDescription') }</span>
        <Link
          href={ isVyper ?
            'https://docs.vyperlang.org/en/stable/compiling-a-contract.html#target-options' :
            'https://docs.soliditylang.org/en/latest/using-the-compiler.html#target-options'
          }
          target="_blank"
        >
          { t('contractVerificationFieldEvmVersion.evmVersionDetailsLink') }
        </Link>
      </>
    </ContractVerificationFormRow>
  );
};

export default React.memo(ContractVerificationFieldEvmVersion);
