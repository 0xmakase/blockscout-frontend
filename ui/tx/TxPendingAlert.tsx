import { Alert, Spinner } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

const TxPendingAlert = () => {
  const { t } = useTranslation();

  return (
    <Alert>
      <Spinner size="sm" mr={ 2 }/>
      { t('txPendingAlert.message') }
    </Alert>
  );
};

export default TxPendingAlert;
