import { chakra, Checkbox, Code } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import type { ControllerRenderProps } from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next'; // 追加

import type { FormFields } from '../types';
import type { SmartContractVerificationConfig } from 'types/client/contract';

import { getResourceKey } from 'lib/api/useApiQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import FancySelect from 'ui/shared/FancySelect/FancySelect';
import IconSvg from 'ui/shared/IconSvg';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

const OPTIONS_LIMIT = 50;

interface Props {
  isVyper?: boolean;
}

const ContractVerificationFieldCompiler = ({ isVyper }: Props) => {
  const [ isNightly, setIsNightly ] = React.useState(false);
  const { t } = useTranslation(); // 追加
  const { formState, control, getValues, resetField } = useFormContext<FormFields>();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const config = queryClient.getQueryData<SmartContractVerificationConfig>(getResourceKey('contract_verification_config'));

  const handleCheckboxChange = React.useCallback(() => {
    if (isNightly) {
      const field = getValues('compiler');
      field?.value.includes('nightly') && resetField('compiler', { defaultValue: null });
    }
    setIsNightly(prev => !prev);
  }, [ getValues, isNightly, resetField ]);

  const options = React.useMemo(() => (
    (isVyper ? config?.vyper_compiler_versions : config?.solidity_compiler_versions)?.map((option) => ({ label: option, value: option })) || []
  ), [ config?.solidity_compiler_versions, config?.vyper_compiler_versions, isVyper ]);

  const loadOptions = React.useCallback(async(inputValue: string) => {
    return options
      .filter(({ label }) => !inputValue || label.toLowerCase().includes(inputValue.toLowerCase()))
      .filter(({ label }) => isNightly ? true : !label.includes('nightly'))
      .slice(0, OPTIONS_LIMIT);
  }, [ isNightly, options ]);

  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<FormFields, 'compiler'>}) => {
    const error = 'compiler' in formState.errors ? formState.errors.compiler : undefined;

    return (
      <FancySelect
        { ...field }
        loadOptions={ loadOptions }
        defaultOptions
        size={ isMobile ? 'md' : 'lg' }
        placeholder={ t('contractVerificationFieldCompiler.placeholder') }
        placeholderIcon={ <IconSvg name="search"/> }
        isDisabled={ formState.isSubmitting }
        error={ error }
        isRequired
        isAsync
      />
    );
  },
  [ formState.errors, formState.isSubmitting, isMobile, loadOptions, t ], // t を依存関係に追加
  );

  return (
    <ContractVerificationFormRow>
      <>
        { !isVyper && (
          <Checkbox
            size="lg"
            mb={ 2 }
            onChange={ handleCheckboxChange }
            isDisabled={ formState.isSubmitting }
          >
            { t('contractVerificationFieldCompiler.includeNightlyBuilds') }
          </Checkbox>
        ) }
        <Controller
          name="compiler"
          control={ control }
          render={ renderControl }
          rules={{ required: true }}
        />
      </>
      { isVyper ? null : (
        <chakra.div mt={{ base: 0, lg: 8 }}>
          <span>{ t('contractVerificationFieldCompiler.compilerVersionInfo') } </span>
          <Code color="text_secondary">{ t('contractVerificationFieldCompiler.pragmaSolidity') }</Code>
          <span>. { t('contractVerificationFieldCompiler.useCompilerVersion') } </span>
          <Code color="text_secondary">{ t('contractVerificationFieldCompiler.solcVersionCommand') }</Code>
          <span> { t('contractVerificationFieldCompiler.checkCompilerVersion') }</span>
        </chakra.div>
      ) }
    </ContractVerificationFormRow>
  );
};

export default React.memo(ContractVerificationFieldCompiler);
