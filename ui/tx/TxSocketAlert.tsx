import { Alert } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  status: 'error' | 'close';
}

const TxSocketAlert = ({ status }: Props) => {
  const { t } = useTranslation();
  const text = status === 'close' ?
    'blocksContent.connectionLostUpdate' :
    'blocksContent.errorAlert';

  return <Alert status="warning" as="a" href={ window.document.location.href }>{ t(text) }</Alert>;
};

export default React.memo(TxSocketAlert);
