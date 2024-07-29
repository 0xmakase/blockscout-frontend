import {
  Box,
  Grid,
  GridItem,
  Text,
  Link,
  Spinner,
  Flex,
  Tooltip,
  chakra,
  useColorModeValue,
  Skeleton,
} from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { scroller, Element } from 'react-scroll';

import { ARBITRUM_L2_TX_BATCH_STATUSES } from 'types/api/arbitrumL2';
import type { Transaction } from 'types/api/transaction';
import { ZKEVM_L2_TX_STATUSES } from 'types/api/transaction';
import { ZKSYNC_L2_TX_BATCH_STATUSES } from 'types/api/zkSyncL2';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import { WEI, WEI_IN_GWEI } from 'lib/consts';
import getArbitrumVerificationStepStatus from 'lib/getArbitrumVerificationStepStatus';
import getNetworkValidatorTitle from 'lib/networks/getNetworkValidatorTitle';
import getConfirmationDuration from 'lib/tx/getConfirmationDuration';
import { currencyUnits } from 'lib/units';
import Tag from 'ui/shared/chakra/Tag';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import CurrencyValue from 'ui/shared/CurrencyValue';
import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import DetailsInfoItemDivider from 'ui/shared/DetailsInfoItemDivider';
import DetailsSponsoredItem from 'ui/shared/DetailsSponsoredItem';
import DetailsTimestamp from 'ui/shared/DetailsTimestamp';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BatchEntityL2 from 'ui/shared/entities/block/BatchEntityL2';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import IconSvg from 'ui/shared/IconSvg';
import LogDecodedInputData from 'ui/shared/logs/LogDecodedInputData';
import RawInputData from 'ui/shared/RawInputData';
import StatusTag from 'ui/shared/statusTag/StatusTag';
import TxStatus from 'ui/shared/statusTag/TxStatus';
import TextSeparator from 'ui/shared/TextSeparator';
import TxFee from 'ui/shared/tx/TxFee';
import Utilization from 'ui/shared/Utilization/Utilization';
import VerificationSteps from 'ui/shared/verificationSteps/VerificationSteps';
import TxDetailsActions from 'ui/tx/details/txDetailsActions/TxDetailsActions';
import TxDetailsBurntFees from 'ui/tx/details/TxDetailsBurntFees';
import TxDetailsFeePerGas from 'ui/tx/details/TxDetailsFeePerGas';
import TxDetailsGasPrice from 'ui/tx/details/TxDetailsGasPrice';
import TxDetailsOther from 'ui/tx/details/TxDetailsOther';
import TxDetailsTokenTransfers from 'ui/tx/details/TxDetailsTokenTransfers';
import TxDetailsWithdrawalStatus from 'ui/tx/details/TxDetailsWithdrawalStatus';
import TxRevertReason from 'ui/tx/details/TxRevertReason';
import TxAllowedPeekers from 'ui/tx/TxAllowedPeekers';
import TxSocketAlert from 'ui/tx/TxSocketAlert';
import ZkSyncL2TxnBatchHashesInfo from 'ui/txnBatches/zkSyncL2/ZkSyncL2TxnBatchHashesInfo';

const rollupFeature = config.features.rollup;

interface Props {
  data: Transaction | undefined;
  isLoading: boolean;
  socketStatus?: 'close' | 'error';
}

const TxInfo = ({ data, isLoading, socketStatus }: Props) => {
  const { t } = useTranslation();
  const [ isExpanded, setIsExpanded ] = React.useState(false);

  const handleCutClick = React.useCallback(() => {
    setIsExpanded((flag) => !flag);
    scroller.scrollTo('TxInfo__cutLink', {
      duration: 500,
      smooth: true,
    });
  }, []);
  const executionSuccessIconColor = useColorModeValue('blackAlpha.800', 'whiteAlpha.800');

  if (!data) {
    return null;
  }

  const addressFromTags = [
    ...data.from.private_tags || [],
    ...data.from.public_tags || [],
    ...data.from.watchlist_names || [],
  ].map((tag) => <Tag key={ tag.label }>{ tag.display_name }</Tag>);

  const toAddress = data.to ? data.to : data.created_contract;
  const addressToTags = [
    ...toAddress?.private_tags || [],
    ...toAddress?.public_tags || [],
    ...toAddress?.watchlist_names || [],
  ].map((tag) => <Tag key={ tag.label }>{ tag.display_name }</Tag>);

  const executionSuccessBadge = toAddress?.is_contract && data.result === 'success' ? (
    <Tooltip label="Contract execution completed">
      <chakra.span display="inline-flex" ml={ 2 } mr={ 1 }>
        <IconSvg name="status/success" boxSize={ 4 } color={ executionSuccessIconColor } cursor="pointer"/>
      </chakra.span>
    </Tooltip>
  ) : null;
  const executionFailedBadge = toAddress?.is_contract && Boolean(data.status) && data.result !== 'success' ? (
    <Tooltip label="Error occurred during contract execution">
      <chakra.span display="inline-flex" ml={ 2 } mr={ 1 }>
        <IconSvg name="status/error" boxSize={ 4 } color="error" cursor="pointer"/>
      </chakra.span>
    </Tooltip>
  ) : null;

  return (
    <Grid columnGap={ 8 } rowGap={{ base: 3, lg: 3 }} templateColumns={{ base: 'minmax(0, 1fr)', lg: 'max-content minmax(728px, auto)' }}>

      { config.features.metasuites.isEnabled && (
        <>
          <Box display="none" id="meta-suites__tx-info-label" data-status={ data.status } data-ready={ !isLoading }/>
          <Box display="none" id="meta-suites__tx-info-value"/>
          <DetailsInfoItemDivider display="none" id="meta-suites__details-info-item-divider"/>
        </>
      ) }

      { socketStatus && (
        <GridItem colSpan={{ base: undefined, lg: 2 }} mb={ 2 }>
          <TxSocketAlert status={ socketStatus }/>
        </GridItem>
      ) }

      <DetailsInfoItem.Label
        hint={ t('txInfo.transaction_hash_hint') }
        isLoading={ isLoading }
      >
        { t('txInfo.transaction_hash') }
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value flexWrap="nowrap">
        { data.status === null && <Spinner mr={ 2 } size="sm" flexShrink={ 0 }/> }
        <Skeleton isLoaded={ !isLoading } overflow="hidden">
          <HashStringShortenDynamic hash={ data.hash }/>
        </Skeleton>
        <CopyToClipboard text={ data.hash } isLoading={ isLoading }/>

        { config.features.metasuites.isEnabled && (
          <>
            <TextSeparator color="gray.500" flexShrink={ 0 } display="none" id="meta-suites__tx-explorer-separator"/>
            <Box display="none" flexShrink={ 0 } id="meta-suites__tx-explorer-link"/>
          </>
        ) }
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        hint={ t('txInfo.status_and_method_hint') }
        isLoading={ isLoading }
      >
        {
          rollupFeature.isEnabled && (rollupFeature.type === 'zkEvm' || rollupFeature.type === 'zkSync' || rollupFeature.type === 'arbitrum') ?
            t('txInfo.l2_status_and_method') :
            t('txInfo.status_and_method')
        }
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <TxStatus status={ data.status } errorText={ data.status === 'error' ? data.result : undefined } isLoading={ isLoading }/>
        { data.method && (
          <Tag colorScheme={ data.method === 'Multicall' ? 'teal' : 'gray' } isLoading={ isLoading } isTruncated ml={ 3 }>
            { data.method }
          </Tag>
        ) }
        { data.arbitrum?.contains_message && (
          <Tag isLoading={ isLoading } isTruncated ml={ 3 }>
            { data.arbitrum?.contains_message === 'incoming' ? t('txInfo.incoming_message') : t('txInfo.outgoing_message') }
          </Tag>
        ) }
      </DetailsInfoItem.Value>

      { rollupFeature.isEnabled && rollupFeature.type === 'optimistic' && data.op_withdrawals && data.op_withdrawals.length > 0 &&
      !config.UI.views.tx.hiddenFields?.L1_status && (
        <>
          <DetailsInfoItem.Label
            hint={ t('txInfo.withdrawal_status_hint') }
          >
            { t('txInfo.withdrawal_status') }
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <Flex flexDir="column" rowGap={ 2 }>
              { data.op_withdrawals.map((withdrawal) => (
                <Box key={ withdrawal.nonce }>
                  <Box mb={ 2 }>
                    <span>{ t('txInfo.nonce') }:</span>
                    <chakra.span fontWeight={ 600 }>{ withdrawal.nonce }</chakra.span>
                  </Box>
                  <TxDetailsWithdrawalStatus
                    status={ withdrawal.status }
                    l1TxHash={ withdrawal.l1_transaction_hash }
                  />
                </Box>
              )) }
            </Flex>
          </DetailsInfoItem.Value>
        </>
      ) }

      { data.zkevm_status && !config.UI.views.tx.hiddenFields?.L1_status && (
        <>
          <DetailsInfoItem.Label
            hint={ t('txInfo.confirmation_status_hint') }
            isLoading={ isLoading }
          >
            { t('txInfo.confirmation_status') }
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <VerificationSteps currentStep={ data.zkevm_status } steps={ ZKEVM_L2_TX_STATUSES } isLoading={ isLoading }/>
          </DetailsInfoItem.Value>
        </>
      ) }

      { data.arbitrum?.status && !config.UI.views.tx.hiddenFields?.L1_status && (
        <>
          <DetailsInfoItem.Label
            hint={ t('txInfo.l1_status_hint') }
            isLoading={ isLoading }
          >
            { t('txInfo.l1_status') }
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <VerificationSteps
              currentStep={ data.arbitrum.status }
              currentStepPending={ getArbitrumVerificationStepStatus(data.arbitrum) === 'pending' }
              steps={ ARBITRUM_L2_TX_BATCH_STATUSES }
              isLoading={ isLoading }
            />
          </DetailsInfoItem.Value>
        </>
      ) }

      { data.revert_reason && (
        <>
          <DetailsInfoItem.Label
            hint={ t('txInfo.revert_reason_hint') }
          >
            { t('txInfo.revert_reason') }
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <TxRevertReason { ...data.revert_reason }/>
          </DetailsInfoItem.Value>
        </>
      ) }

      { data.zksync && !config.UI.views.tx.hiddenFields?.L1_status && (
        <>
          <DetailsInfoItem.Label
            hint={ t('txInfo.l1_status_hint') }
            isLoading={ isLoading }
          >
            { t('txInfo.l1_status') }
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <VerificationSteps steps={ ZKSYNC_L2_TX_BATCH_STATUSES } currentStep={ data.zksync.status } isLoading={ isLoading }/>
          </DetailsInfoItem.Value>
        </>
      ) }

      <DetailsInfoItem.Label
        hint={ t('txInfo.block_hint') }
        isLoading={ isLoading }
      >
        { t('txInfo.block') }
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        { data.block === null ?
          <Text>{ t('txInfo.pending') }</Text> : (
            <BlockEntity
              isLoading={ isLoading }
              number={ data.block }
              noIcon
            />
          ) }
        { Boolean(data.confirmations) && (
          <>
            <TextSeparator color="gray.500"/>
            <Skeleton isLoaded={ !isLoading } color="text_secondary">
              <span>{ t('txInfo.block_confirmations', { count: data.confirmations }) }</span>
            </Skeleton>
          </>
        ) }
      </DetailsInfoItem.Value>

      { data.zkevm_batch_number && !config.UI.views.tx.hiddenFields?.batch && (
        <>
          <DetailsInfoItem.Label
            hint={ t('txInfo.tx_batch_hint') }
            isLoading={ isLoading }
          >
            { t('txInfo.tx_batch') }
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <BatchEntityL2
              isLoading={ isLoading }
              number={ data.zkevm_batch_number }
            />
          </DetailsInfoItem.Value>
        </>
      ) }

      { data.zksync && !config.UI.views.tx.hiddenFields?.batch && (
        <>
          <DetailsInfoItem.Label
            hint={ t('txInfo.batch_hint') }
            isLoading={ isLoading }
          >
            { t('txInfo.batch') }
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            { data.zksync.batch_number ? (
              <BatchEntityL2
                isLoading={ isLoading }
                number={ data.zksync.batch_number }
              />
            ) : <Skeleton isLoaded={ !isLoading }>{ t('txInfo.pending') }</Skeleton> }
          </DetailsInfoItem.Value>
        </>
      ) }

      { data.arbitrum && !config.UI.views.tx.hiddenFields?.batch && (
        <>
          <DetailsInfoItem.Label
            hint={ t('txInfo.batch_hint') }
            isLoading={ isLoading }
          >
            { t('txInfo.batch') }
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            { data.arbitrum.batch_number ?
              <BatchEntityL2 isLoading={ isLoading } number={ data.arbitrum.batch_number }/> :
              <Skeleton isLoaded={ !isLoading }>{ t('txInfo.pending') }</Skeleton> }
          </DetailsInfoItem.Value>
        </>
      ) }

      { data.timestamp && (
        <>
          <DetailsInfoItem.Label
            hint={ t('txInfo.timestamp_hint') }
            isLoading={ isLoading }
          >
            { t('txInfo.timestamp') }
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <DetailsTimestamp timestamp={ data.timestamp } isLoading={ isLoading }/>
            { data.confirmation_duration && (
              <>
                <TextSeparator color="gray.500"/>
                <Skeleton isLoaded={ !isLoading } color="text_secondary">
                  <span>{ getConfirmationDuration(data.confirmation_duration) }</span>
                </Skeleton>
              </>
            ) }
          </DetailsInfoItem.Value>
        </>
      ) }

      { data.execution_node && (
        <>
          <DetailsInfoItem.Label
            hint={ t('txInfo.execution_node_hint') }
            isLoading={ isLoading }
          >
            { t('txInfo.execution_node') }
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <AddressEntity
              address={ data.execution_node }
              href={ route({ pathname: '/txs/kettle/[hash]', query: { hash: data.execution_node.hash } }) }
            />
          </DetailsInfoItem.Value>
        </>
      ) }

      { data.allowed_peekers && data.allowed_peekers.length > 0 && (
        <TxAllowedPeekers items={ data.allowed_peekers }/>
      ) }

      <DetailsSponsoredItem isLoading={ isLoading }/>

      <DetailsInfoItemDivider/>

      <TxDetailsActions hash={ data.hash } actions={ data.actions } isTxDataLoading={ isLoading }/>

      <DetailsInfoItem.Label
        hint={ t('txInfo.from_hint') }
        isLoading={ isLoading }
      >
        { t('txInfo.from') }
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value columnGap={ 3 }>
        <AddressEntity
          address={ data.from }
          isLoading={ isLoading }
        />
        { data.from.name && <Text>{ data.from.name }</Text> }
        { addressFromTags.length > 0 && (
          <Flex columnGap={ 3 }>
            { addressFromTags }
          </Flex>
        ) }
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        hint={ t('txInfo.to_hint') }
        isLoading={ isLoading }
      >
        { data.to?.is_contract ? t('txInfo.interacted_with_contract') : t('txInfo.to') }
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value
        flexWrap={{ base: 'wrap', lg: 'nowrap' }}
        columnGap={ 3 }
      >
        { toAddress ? (
          <>
            { data.to && data.to.hash ? (
              <Flex flexWrap="nowrap" alignItems="center" maxW="100%">
                <AddressEntity
                  address={ toAddress }
                  isLoading={ isLoading }
                />
                { executionSuccessBadge }
                { executionFailedBadge }
              </Flex>
            ) : (
              <Flex width="100%" whiteSpace="pre" alignItems="center" flexShrink={ 0 }>
                <span>{ t('txInfo.contract') }</span>
                <AddressEntity
                  address={ toAddress }
                  isLoading={ isLoading }
                  noIcon
                />
                <span>{ t('txInfo.created') }</span>
                { executionSuccessBadge }
                { executionFailedBadge }
              </Flex>
            ) }
            { addressToTags.length > 0 && (
              <Flex columnGap={ 3 }>
                { addressToTags }
              </Flex>
            ) }
          </>
        ) : (
          <span>{ t('txInfo.contract_creation') }</span>
        ) }
      </DetailsInfoItem.Value>

      { data.token_transfers && <TxDetailsTokenTransfers data={ data.token_transfers } txHash={ data.hash } isOverflow={ data.token_transfers_overflow }/> }

      <DetailsInfoItemDivider/>

      { (data.arbitrum?.commitment_transaction.hash || data.arbitrum?.confirmation_transaction.hash) &&
      (
        <>
          { data.arbitrum?.commitment_transaction.hash && (
            <>
              <DetailsInfoItem.Label
                hint={ t('txInfo.commitment_tx_hint') }
                isLoading={ isLoading }
              >
                { t('txInfo.commitment_tx') }
              </DetailsInfoItem.Label>
              <DetailsInfoItem.Value>
                <TxEntityL1 hash={ data.arbitrum?.commitment_transaction.hash } isLoading={ isLoading }/>
                { data.arbitrum?.commitment_transaction.status === 'finalized' && <StatusTag type="ok" text={ t('txInfo.finalized') } ml={ 2 }/> }
              </DetailsInfoItem.Value>
            </>
          ) }
          { data.arbitrum?.confirmation_transaction.hash && (
            <>
              <DetailsInfoItem.Label
                hint={ t('txInfo.confirmation_tx_hint') }
                isLoading={ isLoading }
              >
                { t('txInfo.confirmation_tx') }
              </DetailsInfoItem.Label>
              <DetailsInfoItem.Value>
                <TxEntityL1 hash={ data.arbitrum?.confirmation_transaction.hash } isLoading={ isLoading }/>
                { data.arbitrum?.commitment_transaction.status === 'finalized' && <StatusTag type="ok" text={ t('txInfo.finalized') } ml={ 2 }/> }
              </DetailsInfoItem.Value>
            </>
          ) }
          <DetailsInfoItemDivider/>
        </>
      ) }

      { data.zkevm_sequence_hash && (
        <>
          <DetailsInfoItem.Label
            isLoading={ isLoading }
          >
            { t('txInfo.sequence_tx_hash') }
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value flexWrap="nowrap">
            <Skeleton isLoaded={ !isLoading } overflow="hidden">
              <HashStringShortenDynamic hash={ data.zkevm_sequence_hash }/>
            </Skeleton>
            <CopyToClipboard text={ data.zkevm_sequence_hash } isLoading={ isLoading }/>
          </DetailsInfoItem.Value>
        </>

      ) }

      { data.zkevm_verify_hash && (
        <>
          <DetailsInfoItem.Label
            isLoading={ isLoading }
          >
            { t('txInfo.verify_tx_hash') }
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value flexWrap="nowrap">
            <Skeleton isLoaded={ !isLoading } overflow="hidden">
              <HashStringShortenDynamic hash={ data.zkevm_verify_hash }/>
            </Skeleton>
            <CopyToClipboard text={ data.zkevm_verify_hash } isLoading={ isLoading }/>
          </DetailsInfoItem.Value>
        </>
      ) }

      { (data.zkevm_batch_number || data.zkevm_verify_hash) && <DetailsInfoItemDivider/> }

      { !config.UI.views.tx.hiddenFields?.value && (
        <>
          <DetailsInfoItem.Label
            hint={ t('txInfo.value_hint') }
            isLoading={ isLoading }
          >
            { t('txInfo.value') }
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <CurrencyValue
              value={ data.value }
              currency={ currencyUnits.ether }
              exchangeRate={ data.exchange_rate }
              isLoading={ isLoading }
              flexWrap="wrap"
            />
          </DetailsInfoItem.Value>
        </>
      ) }

      { !config.UI.views.tx.hiddenFields?.tx_fee && (
        <>
          <DetailsInfoItem.Label
            hint={ data.blob_gas_used ? t('txInfo.transaction_fee_without_blob_hint') : t('txInfo.transaction_fee_hint') }
            isLoading={ isLoading }
          >
            { t('txInfo.transaction_fee') }
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <TxFee tx={ data } isLoading={ isLoading } withUsd/>
          </DetailsInfoItem.Value>
        </>
      ) }

      { rollupFeature.isEnabled && rollupFeature.type === 'arbitrum' && data.arbitrum && (
        <>
          <DetailsInfoItem.Label
            hint={ t('txInfo.poster_fee_hint') }
            isLoading={ isLoading }
          >
            { t('txInfo.poster_fee') }
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <CurrencyValue
              value={ data.arbitrum.poster_fee }
              currency={ currencyUnits.ether }
              exchangeRate={ data.exchange_rate }
              flexWrap="wrap"
              isLoading={ isLoading }
            />
          </DetailsInfoItem.Value>

          <DetailsInfoItem.Label
            hint={ t('txInfo.network_fee_hint') }
            isLoading={ isLoading }
          >
            { t('txInfo.network_fee') }
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <CurrencyValue
              value={ data.arbitrum.network_fee }
              currency={ currencyUnits.ether }
              exchangeRate={ data.exchange_rate }
              flexWrap="wrap"
              isLoading={ isLoading }
            />
          </DetailsInfoItem.Value>
        </>
      ) }

      <TxDetailsGasPrice gasPrice={ data.gas_price } gasToken={ data.celo?.gas_token } isLoading={ isLoading }/>

      <TxDetailsFeePerGas txFee={ data.fee.value } gasUsed={ data.gas_used } isLoading={ isLoading }/>

      <DetailsInfoItem.Label
        hint={ t('txInfo.gas_usage_limit_hint') }
        isLoading={ isLoading }
      >
        { t('txInfo.gas_usage_limit') }
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <Skeleton isLoaded={ !isLoading }>{ BigNumber(data.gas_used || 0).toFormat() }</Skeleton>
        <TextSeparator/>
        <Skeleton isLoaded={ !isLoading }>{ BigNumber(data.gas_limit).toFormat() }</Skeleton>
        <Utilization ml={ 4 } value={ BigNumber(data.gas_used || 0).dividedBy(BigNumber(data.gas_limit)).toNumber() } isLoading={ isLoading }/>
      </DetailsInfoItem.Value>

      { rollupFeature.isEnabled && rollupFeature.type === 'arbitrum' && data.arbitrum && data.gas_used && (
        <>
          <DetailsInfoItem.Label
            hint={ t('txInfo.gas_used_for_l1_hint') }
            isLoading={ isLoading }
          >
            { t('txInfo.gas_used_for_l1') }
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <Skeleton isLoaded={ !isLoading }>{ BigNumber(data.arbitrum.gas_used_for_l1 || 0).toFormat() }</Skeleton>
            <TextSeparator/>
            <Utilization
              ml={ 4 }
              value={ BigNumber(data.arbitrum.gas_used_for_l1 || 0).dividedBy(BigNumber(data.gas_used)).toNumber() }
              isLoading={ isLoading }
            />
          </DetailsInfoItem.Value>

          <DetailsInfoItem.Label
            hint={ t('txInfo.gas_used_for_l2_hint') }
            isLoading={ isLoading }
          >
            { t('txInfo.gas_used_for_l2') }
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <Skeleton isLoaded={ !isLoading }>{ BigNumber(data.arbitrum.gas_used_for_l2 || 0).toFormat() }</Skeleton>
            <TextSeparator/>
            <Utilization
              ml={ 4 }
              value={ BigNumber(data.arbitrum.gas_used_for_l2 || 0).dividedBy(BigNumber(data.gas_used)).toNumber() }
              isLoading={ isLoading }
            />
          </DetailsInfoItem.Value>
        </>
      ) }

      { !config.UI.views.tx.hiddenFields?.gas_fees &&
            (data.base_fee_per_gas || data.max_fee_per_gas || data.max_priority_fee_per_gas) && (
        <>
          <DetailsInfoItem.Label
            hint={ t('txInfo.gas_fees_hint', { validatorTitle: getNetworkValidatorTitle() }) }
            isLoading={ isLoading }
          >
            { t('txInfo.gas_fees', { currency: currencyUnits.gwei }) }
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            { data.base_fee_per_gas && (
              <Skeleton isLoaded={ !isLoading }>
                <Text as="span" fontWeight="500">{ t('txInfo.base') }:</Text>
                <Text fontWeight="600" as="span">{ BigNumber(data.base_fee_per_gas).dividedBy(WEI_IN_GWEI).toFixed() }</Text>
                { (data.max_fee_per_gas || data.max_priority_fee_per_gas) && <TextSeparator/> }
              </Skeleton>
            ) }
            { data.max_fee_per_gas && (
              <Skeleton isLoaded={ !isLoading }>
                <Text as="span" fontWeight="500">{ t('txInfo.max') }:</Text>
                <Text fontWeight="600" as="span">{ BigNumber(data.max_fee_per_gas).dividedBy(WEI_IN_GWEI).toFixed() }</Text>
                { data.max_priority_fee_per_gas && <TextSeparator/> }
              </Skeleton>
            ) }
            { data.max_priority_fee_per_gas && (
              <Skeleton isLoaded={ !isLoading }>
                <Text as="span" fontWeight="500">{ t('txInfo.max_priority') }:</Text>
                <Text fontWeight="600" as="span">{ BigNumber(data.max_priority_fee_per_gas).dividedBy(WEI_IN_GWEI).toFixed() }</Text>
              </Skeleton>
            ) }
          </DetailsInfoItem.Value>
        </>
      ) }

      <TxDetailsBurntFees data={ data } isLoading={ isLoading }/>

      { rollupFeature.isEnabled && rollupFeature.type === 'optimistic' && (
        <>
          { data.l1_gas_used && (
            <>
              <DetailsInfoItem.Label
                hint={ t('txInfo.l1_gas_used_hint') }
                isLoading={ isLoading }
              >
                { t('txInfo.l1_gas_used') }
              </DetailsInfoItem.Label>
              <DetailsInfoItem.Value>
                <Text>{ BigNumber(data.l1_gas_used).toFormat() }</Text>
              </DetailsInfoItem.Value>
            </>
          ) }

          { data.l1_gas_price && (
            <>
              <DetailsInfoItem.Label
                hint={ t('txInfo.l1_gas_price_hint') }
                isLoading={ isLoading }
              >
                { t('txInfo.l1_gas_price') }
              </DetailsInfoItem.Label>
              <DetailsInfoItem.Value>
                <Text mr={ 1 }>{ BigNumber(data.l1_gas_price).dividedBy(WEI).toFixed() } { currencyUnits.ether }</Text>
                <Text variant="secondary">({ BigNumber(data.l1_gas_price).dividedBy(WEI_IN_GWEI).toFixed() } { currencyUnits.gwei })</Text>
              </DetailsInfoItem.Value>
            </>
          ) }

          { data.l1_fee && (
            <>
              <DetailsInfoItem.Label
                hint={ t('txInfo.l1_fee_hint') }
                isLoading={ isLoading }
              >
                { t('txInfo.l1_fee') }
              </DetailsInfoItem.Label>
              <DetailsInfoItem.Value>
                <CurrencyValue
                  value={ data.l1_fee }
                  currency={ currencyUnits.ether }
                  exchangeRate={ data.exchange_rate }
                  flexWrap="wrap"
                />
              </DetailsInfoItem.Value>
            </>
          ) }

          { data.l1_fee_scalar && (
            <>
              <DetailsInfoItem.Label
                hint={ t('txInfo.l1_fee_scalar_hint') }
                isLoading={ isLoading }
              >
                { t('txInfo.l1_fee_scalar') }
              </DetailsInfoItem.Label>
              <DetailsInfoItem.Value>
                <Text>{ data.l1_fee_scalar }</Text>
              </DetailsInfoItem.Value>
            </>
          ) }
        </>
      ) }

      <GridItem colSpan={{ base: undefined, lg: 2 }}>
        <Element name="TxInfo__cutLink">
          <Skeleton isLoaded={ !isLoading } mt={ 6 } display="inline-block">
            <Link
              display="inline-block"
              fontSize="sm"
              textDecorationLine="underline"
              textDecorationStyle="dashed"
              onClick={ handleCutClick }
            >
              { isExpanded ? t('txInfo.hide_details') : t('txInfo.view_details') }
            </Link>
          </Skeleton>
        </Element>
      </GridItem>

      { isExpanded && (
        <>
          <GridItem colSpan={{ base: undefined, lg: 2 }} mt={{ base: 1, lg: 4 }}/>
          { (data.blob_gas_used || data.max_fee_per_blob_gas || data.blob_gas_price) && (
            <>
              { data.blob_gas_used && data.blob_gas_price && (
                <>
                  <DetailsInfoItem.Label
                    hint={ t('txInfo.blob_fee_hint') }
                  >
                    { t('txInfo.blob_fee') }
                  </DetailsInfoItem.Label>
                  <DetailsInfoItem.Value>
                    <CurrencyValue
                      value={ BigNumber(data.blob_gas_used).multipliedBy(data.blob_gas_price).toString() }
                      currency={ config.UI.views.tx.hiddenFields?.fee_currency ? '' : currencyUnits.ether }
                      exchangeRate={ data.exchange_rate }
                      flexWrap="wrap"
                      isLoading={ isLoading }
                    />
                  </DetailsInfoItem.Value>
                </>
              ) }

              { data.blob_gas_used && (
                <>
                  <DetailsInfoItem.Label
                    hint={ t('txInfo.blob_gas_usage_hint') }
                  >
                    { t('txInfo.blob_gas_usage') }
                  </DetailsInfoItem.Label>
                  <DetailsInfoItem.Value>
                    { BigNumber(data.blob_gas_used).toFormat() }
                  </DetailsInfoItem.Value>
                </>
              ) }

              { (data.max_fee_per_blob_gas || data.blob_gas_price) && (
                <>
                  <DetailsInfoItem.Label
                    hint={ t('txInfo.blob_gas_fees_hint', { currency: currencyUnits.ether }) }
                  >
                    { t('txInfo.blob_gas_fees', { currency: currencyUnits.gwei }) }
                  </DetailsInfoItem.Label>
                  <DetailsInfoItem.Value>
                    { data.blob_gas_price && (
                      <Text fontWeight="600" as="span">{ BigNumber(data.blob_gas_price).dividedBy(WEI_IN_GWEI).toFixed() }</Text>
                    ) }
                    { (data.max_fee_per_blob_gas && data.blob_gas_price) && <TextSeparator/> }
                    { data.max_fee_per_blob_gas && (
                      <>
                        <Text as="span" fontWeight="500" whiteSpace="pre">{ t('txInfo.max') }:</Text>
                        <Text fontWeight="600" as="span">{ BigNumber(data.max_fee_per_blob_gas).dividedBy(WEI_IN_GWEI).toFixed() }</Text>
                      </>
                    ) }
                  </DetailsInfoItem.Value>
                </>
              ) }
              <DetailsInfoItemDivider/>
            </>
          ) }

          <TxDetailsOther nonce={ data.nonce } type={ data.type } position={ data.position }/>

          <DetailsInfoItem.Label
            hint={ t('txInfo.raw_input_hint') }
          >
            { t('txInfo.raw_input') }
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <RawInputData hex={ data.raw_input }/>
          </DetailsInfoItem.Value>

          { data.decoded_input && (
            <>
              <DetailsInfoItem.Label
                hint={ t('txInfo.decoded_input_hint') }
              >
                { t('txInfo.decoded_input') }
              </DetailsInfoItem.Label>
              <DetailsInfoItem.Value>
                <LogDecodedInputData data={ data.decoded_input }/>
              </DetailsInfoItem.Value>
            </>
          ) }

          { data.zksync && <ZkSyncL2TxnBatchHashesInfo data={ data.zksync } isLoading={ isLoading }/> }
        </>
      ) }
    </Grid>
  );
};

export default TxInfo;
