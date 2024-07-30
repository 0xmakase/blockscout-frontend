import React from 'react';
import type { ControllerRenderProps } from 'react-hook-form';
import { useFormContext, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { FormFields } from '../types';

import { CONTRACT_LICENSES } from 'lib/contracts/licenses';
import useIsMobile from 'lib/hooks/useIsMobile';
import FancySelect from 'ui/shared/FancySelect/FancySelect';

const options = CONTRACT_LICENSES.map(({ label, title, type }) => ({ label: `${ title } (${ label })`, value: type }));

import ContractVerificationFormRow from '../ContractVerificationFormRow';

const ContractVerificationFieldLicenseType = () => {
  const { t } = useTranslation();
  const { formState, control } = useFormContext<FormFields>();
  const isMobile = useIsMobile();

  const renderControl = React.useCallback(({ field }: { field: ControllerRenderProps<FormFields, 'license_type'> }) => {
    const error = 'license_type' in formState.errors ? formState.errors.license_type : undefined;

    return (
      <FancySelect
        { ...field }
        options={ options }
        size={ isMobile ? 'md' : 'lg' }
        placeholder="Contract license"
        isDisabled={ formState.isSubmitting }
        error={ error }
      />
    );
  }, [ formState.errors, formState.isSubmitting, isMobile ]);

  return (
    <ContractVerificationFormRow>
      <Controller
        name="license_type"
        control={ control }
        render={ renderControl }
      />
      <span>
        { t('contractVerification.license_note') }
      </span>
    </ContractVerificationFormRow>
  );
};

export default React.memo(ContractVerificationFieldLicenseType);
