import React from 'react';
import { useTranslation } from 'react-i18next';

import type { FormFields } from '../types';

import { CONTRACT_LICENSES } from 'lib/contracts/licenses';
import FormFieldFancySelect from 'ui/shared/forms/fields/FormFieldFancySelect';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

const options = CONTRACT_LICENSES.map(({ label, title, type }) => ({ label: `${ title } (${ label })`, value: type }));

const ContractVerificationFieldLicenseType = () => {
  const { t } = useTranslation();

  return (
    <ContractVerificationFormRow>
      <FormFieldFancySelect<FormFields, 'license_type'>
        name="license_type"
        placeholder="Contract license"
        options={ options }
      />
      <span>
        { t('contractVerification.license_note') }
      </span>
    </ContractVerificationFormRow>
  );
};

export default React.memo(ContractVerificationFieldLicenseType);
