import { Alert, Skeleton, chakra } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import config from 'configs/app';

interface Props {
  isLoading?: boolean;
  className?: string;
}

const TestnetWarning = ({ isLoading, className }: Props) => {
  const { t } = useTranslation();

  if (!config.chain.isTestnet) {
    return null;
  }

  return (
    <Skeleton className={ className } isLoaded={ !isLoading }>
      <Alert status="warning">{ t('testnetWarning.message') }</Alert>
    </Skeleton>
  );
};

export default React.memo(chakra(TestnetWarning));
