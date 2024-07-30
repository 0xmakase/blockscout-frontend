import { Alert, AlertDescription, chakra } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

const DataFetchAlert = ({ className }: { className?: string }) => {
  const { t } = useTranslation();

  return (
    <Alert status="warning" width="fit-content" className={ className }>
      <AlertDescription>
        { t('data_fetch_alert.description') }
      </AlertDescription>
    </Alert>
  );
};

export default chakra(DataFetchAlert);
