import React from 'react';
import { useTranslation } from 'react-i18next';

import type { FormFields } from '../types';

import FormFieldText from 'ui/shared/forms/fields/FormFieldText';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

interface Props {
  isVyper?: boolean;
}

const ContractVerificationFieldCode = ({ isVyper }: Props) => {
  const { t } = useTranslation();
  return (
    <ContractVerificationFormRow>
      <FormFieldText<FormFields>
        name="code"
        isRequired
        placeholder="Contract code"
        size={{ base: 'md', lg: 'lg' }}
        asComponent="Textarea"
      />
      { !isVyper && (
        <span>{ t('contractVerificationFieldCode.codeRecommendation') }</span>
      ) }
    </ContractVerificationFormRow>
  );
};

export default React.memo(ContractVerificationFieldCode);
