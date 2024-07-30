import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { Transaction } from 'types/api/transaction';

import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import TextSeparator from 'ui/shared/TextSeparator';

type Props = Pick<Transaction, 'nonce' | 'type' | 'position'>

const TxDetailsOther = ({ nonce, type, position }: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <DetailsInfoItem.Label hint={ t('txDetailsOther.hint') }>
        { t('txDetailsOther.label') }
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        {
          [
            typeof type === 'number' && (
              <Box key="type">
                <Text as="span" fontWeight="500">{ t('txDetailsOther.txnType') }: </Text>
                <Text fontWeight="600" as="span">{ type }</Text>
                { type === 2 && <Text fontWeight="400" as="span" ml={ 1 } variant="secondary">{ t('txDetailsOther.eip1559') }</Text> }
                { type === 3 && <Text fontWeight="400" as="span" ml={ 1 } variant="secondary">{ t('txDetailsOther.eip4844') }</Text> }
              </Box>
            ),
            <Box key="nonce">
              <Text as="span" fontWeight="500">{ t('txDetailsOther.nonce') }: </Text>
              <Text fontWeight="600" as="span">{ nonce }</Text>
            </Box>,
            position !== null && position !== undefined && (
              <Box key="position">
                <Text as="span" fontWeight="500">{ t('txDetailsOther.position') }: </Text>
                <Text fontWeight="600" as="span">{ position }</Text>
              </Box>
            ),
          ]
            .filter(Boolean)
            .map((item, index) => (
              <React.Fragment key={ index }>
                { index !== 0 && <TextSeparator/> }
                { item }
              </React.Fragment>
            ))
        }
      </DetailsInfoItem.Value>
    </>
  );
};

export default TxDetailsOther;
