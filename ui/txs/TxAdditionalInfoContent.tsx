import { Box, Heading, Text, Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { Transaction } from 'types/api/transaction';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import getValueWithUnit from 'lib/getValueWithUnit';
import { currencyUnits } from 'lib/units';
import BlobEntity from 'ui/shared/entities/blob/BlobEntity';
import LinkInternal from 'ui/shared/links/LinkInternal';
import TextSeparator from 'ui/shared/TextSeparator';
import TxFee from 'ui/shared/tx/TxFee';
import Utilization from 'ui/shared/Utilization/Utilization';

const TxAdditionalInfoContent = ({ tx }: { tx: Transaction }) => {
  const { t } = useTranslation();

  const sectionProps = {
    borderBottom: '1px solid',
    borderColor: 'divider',
    paddingBottom: 4,
  };

  const sectionTitleProps = {
    color: 'gray.500',
    fontWeight: 600,
    marginBottom: 3,
  };

  return (
    <>
      <Heading as="h4" size="sm" mb={ 6 }>{ t('txAdditionalInfoContent.heading') }</Heading>
      { tx.blob_versioned_hashes && tx.blob_versioned_hashes.length > 0 && (
        <Box { ...sectionProps } mb={ 4 }>
          <Flex alignItems="center" justifyContent="space-between">
            <Text { ...sectionTitleProps }>{ t('txAdditionalInfoContent.blobs', { count: tx.blob_versioned_hashes.length }) }</Text>
            { tx.blob_versioned_hashes.length > 3 && (
              <LinkInternal
                href={ route({ pathname: '/tx/[hash]', query: { hash: tx.hash, tab: 'blobs' } }) }
                mb={ 3 }
              >
                { t('txAdditionalInfoContent.view_all') }
              </LinkInternal>
            ) }
          </Flex>
          <Flex flexDir="column" rowGap={ 3 }>
            { tx.blob_versioned_hashes.slice(0, 3).map((hash, index) => (
              <Flex key={ hash } columnGap={ 2 }>
                <Box fontWeight={ 500 }>{ index + 1 }</Box>
                <BlobEntity hash={ hash } noIcon/>
              </Flex>
            )) }
          </Flex>
        </Box>
      ) }
      { !config.UI.views.tx.hiddenFields?.tx_fee && (
        <Box { ...sectionProps } mb={ 4 }>
          { (tx.stability_fee !== undefined || tx.fee.value !== null) && (
            <>
              <Text { ...sectionTitleProps }>{ t('txAdditionalInfoContent.transaction_fee') }</Text>
              <TxFee tx={ tx } withUsd accuracyUsd={ 2 } rowGap={ 0 }/>
            </>
          ) }
        </Box>
      ) }
      { tx.gas_used !== null && (
        <Box { ...sectionProps } mb={ 4 }>
          <Text { ...sectionTitleProps }>{ t('txAdditionalInfoContent.gas_limit_usage') }</Text>
          <Flex>
            <Text>{ BigNumber(tx.gas_used).toFormat() }</Text>
            <TextSeparator/>
            <Text>{ BigNumber(tx.gas_limit).toFormat() }</Text>
            <Utilization ml={ 4 } value={ Number(BigNumber(tx.gas_used).dividedBy(BigNumber(tx.gas_limit)).toFixed(2)) }/>
          </Flex>
        </Box>
      ) }
      { !config.UI.views.tx.hiddenFields?.gas_fees &&
        (tx.base_fee_per_gas !== null || tx.max_fee_per_gas !== null || tx.max_priority_fee_per_gas !== null) && (
        <Box { ...sectionProps } mb={ 4 }>
          <Text { ...sectionTitleProps }>{ t('txAdditionalInfoContent.gas_fees', { unit: currencyUnits.gwei }) }</Text>
          { tx.base_fee_per_gas !== null && (
            <Box>
              <Text as="span" fontWeight="500">{ t('txAdditionalInfoContent.base') }: </Text>
              <Text fontWeight="700" as="span">{ getValueWithUnit(tx.base_fee_per_gas, 'gwei').toFormat() }</Text>
            </Box>
          ) }
          { tx.max_fee_per_gas !== null && (
            <Box mt={ 1 }>
              <Text as="span" fontWeight="500">{ t('txAdditionalInfoContent.max') }: </Text>
              <Text fontWeight="700" as="span">{ getValueWithUnit(tx.max_fee_per_gas, 'gwei').toFormat() }</Text>
            </Box>
          ) }
          { tx.max_priority_fee_per_gas !== null && (
            <Box mt={ 1 }>
              <Text as="span" fontWeight="500">{ t('txAdditionalInfoContent.max_priority') }: </Text>
              <Text fontWeight="700" as="span">{ getValueWithUnit(tx.max_priority_fee_per_gas, 'gwei').toFormat() }</Text>
            </Box>
          ) }
        </Box>
      ) }
      { !(tx.blob_versioned_hashes && tx.blob_versioned_hashes.length > 0) && (
        <Box { ...sectionProps } mb={ 4 }>
          <Text { ...sectionTitleProps }>{ t('txAdditionalInfoContent.others') }</Text>
          <Box>
            <Text as="span" fontWeight="500">{ t('txAdditionalInfoContent.txn_type') }: </Text>
            <Text fontWeight="600" as="span">{ tx.type }</Text>
            { tx.type === 2 && <Text fontWeight="400" as="span" ml={ 1 } color="gray.500">(EIP-1559)</Text> }
          </Box>
          <Box mt={ 1 }>
            <Text as="span" fontWeight="500">{ t('txAdditionalInfoContent.nonce') }: </Text>
            <Text fontWeight="600" as="span">{ tx.nonce }</Text>
          </Box>
          <Box mt={ 1 }>
            <Text as="span" fontWeight="500">{ t('txAdditionalInfoContent.position') }: </Text>
            <Text fontWeight="600" as="span">{ tx.position }</Text>
          </Box>
        </Box>
      ) }
      <LinkInternal href={ route({ pathname: '/tx/[hash]', query: { hash: tx.hash } }) }>{ t('txAdditionalInfoContent.more_details') }</LinkInternal>
    </>
  );
};

export default React.memo(TxAdditionalInfoContent);
