import { Alert, Skeleton, Spinner, chakra } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  isLoading?: boolean;
  className?: string;
}

const ServiceDegradationWarning = ({ isLoading, className }: Props) => {
  const { t } = useTranslation(); // useTranslationフックを使用

  return (
    <Skeleton className={ className } isLoaded={ !isLoading }>
      <Alert status="warning" colorScheme="gray" alignItems={{ base: 'flex-start', lg: 'center' }}>
        <Spinner size="sm" mr={ 2 } my={{ base: '3px', lg: 0 }} flexShrink={ 0 }/>
        { t('serviceDegradationWarning.message') } { /* 翻訳されたメッセージを表示 */ }
      </Alert>
    </Skeleton>
  );
};

export default React.memo(chakra(ServiceDegradationWarning));
