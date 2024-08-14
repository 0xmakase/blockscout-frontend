import { Grid, GridItem, Text, Link, Box, Tooltip, Skeleton } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import capitalize from 'lodash/capitalize';
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { scroller, Element } from 'react-scroll';

import { ARBITRUM_L2_TX_BATCH_STATUSES } from 'types/api/arbitrumL2';
import { ZKSYNC_L2_TX_BATCH_STATUSES } from 'types/api/zkSyncL2';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import getBlockReward from 'lib/block/getBlockReward';
import { GWEI, WEI, WEI_IN_GWEI, ZERO } from 'lib/consts';
import getArbitrumVerificationStepStatus from 'lib/getArbitrumVerificationStepStatus';
import { space } from 'lib/html-entities';
import getNetworkValidatorTitle from 'lib/networks/getNetworkValidatorTitle';
import getQueryParamString from 'lib/router/getQueryParamString';
import { currencyUnits } from 'lib/units';
import BlockGasUsed from 'ui/shared/block/BlockGasUsed';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import DetailsInfoItemDivider from 'ui/shared/DetailsInfoItemDivider';
import DetailsTimestamp from 'ui/shared/DetailsTimestamp';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BatchEntityL2 from 'ui/shared/entities/block/BatchEntityL2';
import BlockEntityL1 from 'ui/shared/entities/block/BlockEntityL1';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import IconSvg from 'ui/shared/IconSvg';
import LinkInternal from 'ui/shared/links/LinkInternal';
import PrevNext from 'ui/shared/PrevNext';
import RawDataSnippet from 'ui/shared/RawDataSnippet';
import StatusTag from 'ui/shared/statusTag/StatusTag';
import Utilization from 'ui/shared/Utilization/Utilization';
import VerificationSteps from 'ui/shared/verificationSteps/VerificationSteps';
import ZkSyncL2TxnBatchHashesInfo from 'ui/txnBatches/zkSyncL2/ZkSyncL2TxnBatchHashesInfo';

import BlockDetailsBlobInfo from './details/BlockDetailsBlobInfo';
import type { BlockQuery } from './useBlockQuery';

interface Props {
  query: BlockQuery;
}

const rollupFeature = config.features.rollup;

const BlockDetails = ({ query }: Props) => {
  const { t } = useTranslation();
  const [ isExpanded, setIsExpanded ] = React.useState(false);
  const router = useRouter();
  const heightOrHash = getQueryParamString(router.query.height_or_hash);

  const { data, isPlaceholderData } = query;

  const handleCutClick = React.useCallback(() => {
    setIsExpanded((flag) => !flag);
    scroller.scrollTo('BlockDetails__cutLink', {
      duration: 500,
      smooth: true,
    });
  }, []);

  const handlePrevNextClick = React.useCallback((direction: 'prev' | 'next') => {
    if (!data) {
      return;
    }

    const increment = direction === 'next' ? +1 : -1;
    const nextId = String(data.height + increment);

    router.push({ pathname: '/block/[height_or_hash]', query: { height_or_hash: nextId } }, undefined);
  }, [ data, router ]);

  if (!data) {
    return null;
  }

  const { totalReward, staticReward, burntFees, txFees } = getBlockReward(data);

  const validatorTitle = t(getNetworkValidatorTitle());

  const rewardBreakDown = (() => {
    if (rollupFeature.isEnabled || totalReward.isEqualTo(ZERO) || txFees.isEqualTo(ZERO) || burntFees.isEqualTo(ZERO)) {
      return null;
    }

    if (isPlaceholderData) {
      return <Skeleton w="525px" h="20px"/>;
    }

    return (
      <Text variant="secondary" whiteSpace="break-spaces">
        <Tooltip label={ t('blockDetails.staticBlockReward') }>
          <span>{ staticReward.dividedBy(WEI).toFixed() }</span>
        </Tooltip>
        { !txFees.isEqualTo(ZERO) && (
          <>
            { space }+{ space }
            <Tooltip label={ t('blockDetails.txnFees') }>
              <span>{ txFees.dividedBy(WEI).toFixed() }</span>
            </Tooltip>
          </>
        ) }
        { !burntFees.isEqualTo(ZERO) && (
          <>
            { space }-{ space }
            <Tooltip label={ t('blockDetails.burntFees') }>
              <span>{ burntFees.dividedBy(WEI).toFixed() }</span>
            </Tooltip>
          </>
        ) }
      </Text>
    );
  })();

  const verificationTitle = (() => {
    if (rollupFeature.isEnabled && rollupFeature.type === 'zkEvm') {
      return t('blockDetails.sequencedBy');
    }

    return config.chain.verificationType === 'validation' ? t('blockDetails.validatedBy') : t('blockDetails.minedBy');
  })();

  const txsNum = (() => {
    const blockTxsNum = (
      <LinkInternal href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: heightOrHash, tab: 'txs' } }) }>
        { data.tx_count } { t('blockDetails.transactions') }
      </LinkInternal>
    );

    const blockBlobTxsNum = (config.features.dataAvailability.isEnabled && data.blob_tx_count) ? (
      <>
        <span> { t('blockDetails.including') } </span>
        <LinkInternal href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: heightOrHash, tab: 'blob_txs' } }) }>
          { data.blob_tx_count } { t('blockDetails.blobTxns') }
        </LinkInternal>
      </>
    ) : null;

    return (
      <>
        { blockTxsNum }
        { blockBlobTxsNum }
        <span> { t('blockDetails.inThisBlock') }</span>
      </>
    );
  })();

  const blockTypeLabel = (() => {
    switch (data.type) {
      case 'reorg':
        return t('blockDetails.reorg');
      case 'uncle':
        return t('blockDetails.uncle');
      default:
        return t('blockDetails.block');
    }
  })();

  return (
    <Grid
      columnGap={ 8 }
      rowGap={{ base: 3, lg: 3 }}
      templateColumns={{ base: 'minmax(0, 1fr)', lg: 'minmax(min-content, 200px) minmax(0, 1fr)' }}
      overflow="hidden"
    >
      <DetailsInfoItem.Label
        hint={ t('blockDetails.blockHeightHint') }
        isLoading={ isPlaceholderData }
      >
        { blockTypeLabel } { t('blockDetails.blockHeight') }
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <Skeleton isLoaded={ !isPlaceholderData }>
          { data.height }
        </Skeleton>
        { data.height === 0 && <Text whiteSpace="pre">{ t('blockDetails.genesisBlock') }</Text> }
        <PrevNext
          ml={ 6 }
          onClick={ handlePrevNextClick }
          prevLabel={ t('blockDetails.viewPreviousBlock') }
          nextLabel={ t('blockDetails.viewNextBlock') }
          isPrevDisabled={ data.height === 0 }
          isLoading={ isPlaceholderData }
        />
      </DetailsInfoItem.Value>

      { rollupFeature.isEnabled && rollupFeature.type === 'arbitrum' && data.arbitrum && (
        <>
          <DetailsInfoItem.Label
            hint={ t('blockDetails.l1BlockHeightHint') }
            isLoading={ isPlaceholderData }
          >
            { t('blockDetails.l1BlockHeight') }
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <BlockEntityL1 isLoading={ isPlaceholderData } number={ data.arbitrum.l1_block_height }/>
          </DetailsInfoItem.Value>
        </>
      ) }

      { rollupFeature.isEnabled && rollupFeature.type === 'arbitrum' && data.arbitrum && !config.UI.views.block.hiddenFields?.batch && (
        <>
          <DetailsInfoItem.Label
            hint={ t('blockDetails.batchNumberHint') }
            isLoading={ isPlaceholderData }
          >
            { t('blockDetails.batchNumber') }
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            { data.arbitrum.batch_number ?
              <BatchEntityL2 isLoading={ isPlaceholderData } number={ data.arbitrum.batch_number }/> :
              <Skeleton isLoaded={ !isPlaceholderData }>Pending</Skeleton> }
          </DetailsInfoItem.Value>
        </>
      ) }

      <DetailsInfoItem.Label
        hint={ t('blockDetails.sizeHint') }
        isLoading={ isPlaceholderData }
      >
        { t('blockDetails.size') }
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <Skeleton isLoaded={ !isPlaceholderData }>
          { data.size.toLocaleString() }
        </Skeleton>
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        hint={ t('blockDetails.timestampHint') }
        isLoading={ isPlaceholderData }
      >
        { t('blockDetails.timestamp') }
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <DetailsTimestamp timestamp={ data.timestamp } isLoading={ isPlaceholderData }/>
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        hint={ t('blockDetails.transactionsHint') }
        isLoading={ isPlaceholderData }
      >
        { t('blockDetails.transactions') }
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <Skeleton isLoaded={ !isPlaceholderData }>
          { txsNum }
        </Skeleton>
      </DetailsInfoItem.Value>

      { config.features.beaconChain.isEnabled && Boolean(data.withdrawals_count) && (
        <>
          <DetailsInfoItem.Label
            hint={ t('blockDetails.withdrawalsHint') }
            isLoading={ isPlaceholderData }
          >
            { t('blockDetails.withdrawals') }
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <Skeleton isLoaded={ !isPlaceholderData }>
              <LinkInternal href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: heightOrHash, tab: 'withdrawals' } }) }>
                { data.withdrawals_count } { t('blockDetails.withdrawal') }{ data.withdrawals_count === 1 ? '' : 's' }
              </LinkInternal>
            </Skeleton>
          </DetailsInfoItem.Value>
        </>
      ) }

      { rollupFeature.isEnabled && rollupFeature.type === 'zkSync' && data.zksync && !config.UI.views.block.hiddenFields?.batch && (
        <>
          <DetailsInfoItem.Label
            hint={ t('blockDetails.batchNumberHint') }
            isLoading={ isPlaceholderData }
          >
            { t('blockDetails.batchNumber') }
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            { data.zksync.batch_number ?
              <BatchEntityL2 isLoading={ isPlaceholderData } number={ data.zksync.batch_number }/> :
              <Skeleton isLoaded={ !isPlaceholderData }>Pending</Skeleton> }
          </DetailsInfoItem.Value>
        </>
      ) }
      { !config.UI.views.block.hiddenFields?.L1_status && rollupFeature.isEnabled &&
        ((rollupFeature.type === 'zkSync' && data.zksync) || (rollupFeature.type === 'arbitrum' && data.arbitrum)) &&
      (
        <>
          <DetailsInfoItem.Label
            hint={ t('blockDetails.statusHint') }
            isLoading={ isPlaceholderData }
          >
            { t('blockDetails.status') }
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            { rollupFeature.type === 'zkSync' && data.zksync &&
                <VerificationSteps steps={ ZKSYNC_L2_TX_BATCH_STATUSES } currentStep={ data.zksync.status } isLoading={ isPlaceholderData }/> }
            { rollupFeature.type === 'arbitrum' && data.arbitrum && (
              <VerificationSteps
                steps={ ARBITRUM_L2_TX_BATCH_STATUSES }
                currentStep={ data.arbitrum.status }
                currentStepPending={ getArbitrumVerificationStepStatus(data.arbitrum) === 'pending' }
                isLoading={ isPlaceholderData }
              />
            ) }
          </DetailsInfoItem.Value>
        </>
      ) }

      { !config.UI.views.block.hiddenFields?.miner && (
        <>
          <DetailsInfoItem.Label
            hint={ t('blockDetails.validatedByHint') }
            isLoading={ isPlaceholderData }
          >
            { verificationTitle }
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <AddressEntity
              address={ data.miner }
              isLoading={ isPlaceholderData }
            />
          </DetailsInfoItem.Value>
        </>
      ) }

      { rollupFeature.isEnabled && rollupFeature.type === 'arbitrum' &&
          (data.arbitrum?.commitment_transaction.hash || data.arbitrum?.confirmation_transaction.hash) &&
        (
          <>
            <DetailsInfoItemDivider/>
            { data.arbitrum?.commitment_transaction.hash && (
              <>
                <DetailsInfoItem.Label
                  hint={ t('blockDetails.commitmentTxHint') }
                  isLoading={ isPlaceholderData }
                >
                  { t('blockDetails.commitmentTx') }
                </DetailsInfoItem.Label>
                <DetailsInfoItem.Value>
                  <TxEntityL1 hash={ data.arbitrum?.commitment_transaction.hash } isLoading={ isPlaceholderData }/>
                  { data.arbitrum?.commitment_transaction.status === 'finalized' && <StatusTag type="ok" text="Finalized" ml={ 2 }/> }
                </DetailsInfoItem.Value>
              </>
            ) }
            { data.arbitrum?.confirmation_transaction.hash && (
              <>
                <DetailsInfoItem.Label
                  hint={ t('blockDetails.confirmationTxHint') }
                  isLoading={ isPlaceholderData }
                >
                  { t('blockDetails.confirmationTx') }
                </DetailsInfoItem.Label>
                <DetailsInfoItem.Value>
                  <TxEntityL1 hash={ data.arbitrum?.confirmation_transaction.hash } isLoading={ isPlaceholderData }/>
                  { data.arbitrum?.commitment_transaction.status === 'finalized' && <StatusTag type="ok" text="Finalized" ml={ 2 }/> }
                </DetailsInfoItem.Value>
              </>
            ) }
          </>
        ) }

      { !rollupFeature.isEnabled && !totalReward.isEqualTo(ZERO) && !config.UI.views.block.hiddenFields?.total_reward && (
        <>
          <DetailsInfoItem.Label
            hint={
              `For each block, the ${ validatorTitle } is rewarded with a finite amount of ${ config.chain.currency.symbol || 'native token' } 
            on top of the fees paid for all transactions in the block`
            }
            isLoading={ isPlaceholderData }
          >
            { t('blockDetails.blockReward') }
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value columnGap={ 1 }>
            <Skeleton isLoaded={ !isPlaceholderData }>
              { totalReward.dividedBy(WEI).toFixed() } { currencyUnits.ether }
            </Skeleton>
            { rewardBreakDown }
          </DetailsInfoItem.Value>
        </>
      ) }

      { data.rewards
        ?.filter(({ type }) => type !== 'Validator Reward' && type !== 'Miner Reward')
        .map(({ type, reward }) => (
          <React.Fragment key={ type }>
            <DetailsInfoItem.Label
              hint={ `Amount of distributed reward. ${ capitalize(validatorTitle) }s receive a static block reward + Tx fees + uncle fees` }
            >
              { type }
            </DetailsInfoItem.Label>
            <DetailsInfoItem.Value>
              { BigNumber(reward).dividedBy(WEI).toFixed() } { currencyUnits.ether }
            </DetailsInfoItem.Value>
          </React.Fragment>
        ))
      }

      <DetailsInfoItemDivider/>

      <DetailsInfoItem.Label
        hint={ t('blockDetails.gasUsedHint') }
        isLoading={ isPlaceholderData }
      >
        { t('blockDetails.gasUsed') }
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <Skeleton isLoaded={ !isPlaceholderData }>
          { BigNumber(data.gas_used || 0).toFormat() }
        </Skeleton>
        <BlockGasUsed
          gasUsed={ data.gas_used }
          gasLimit={ data.gas_limit }
          isLoading={ isPlaceholderData }
          ml={ 4 }
          gasTarget={ data.gas_target_percentage }
        />
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        hint={ t('blockDetails.gasLimitHint') }
        isLoading={ isPlaceholderData }
      >
        { t('blockDetails.gasLimit') }
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <Skeleton isLoaded={ !isPlaceholderData }>
          { BigNumber(data.gas_limit).toFormat() }
        </Skeleton>
      </DetailsInfoItem.Value>

      { data.minimum_gas_price && (
        <>
          <DetailsInfoItem.Label
            hint={ t('blockDetails.minimumGasPriceHint') }
            isLoading={ isPlaceholderData }
          >
            { t('blockDetails.minimumGasPrice') }
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <Skeleton isLoaded={ !isPlaceholderData }>
              { BigNumber(data.minimum_gas_price).dividedBy(GWEI).toFormat() } { currencyUnits.gwei }
            </Skeleton>
          </DetailsInfoItem.Value>
        </>
      ) }

      { data.base_fee_per_gas && (
        <>
          <DetailsInfoItem.Label
            hint={ t('blockDetails.baseFeePerGasHint') }
            isLoading={ isPlaceholderData }
          >
            { t('blockDetails.baseFeePerGas') }
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            { isPlaceholderData ? (
              <Skeleton isLoaded={ !isPlaceholderData } h="20px" maxW="380px" w="100%"/>
            ) : (
              <>
                <Text>{ BigNumber(data.base_fee_per_gas).dividedBy(WEI).toFixed() } { currencyUnits.ether } </Text>
                <Text variant="secondary" whiteSpace="pre">
                  { space }({ BigNumber(data.base_fee_per_gas).dividedBy(WEI_IN_GWEI).toFixed() } { currencyUnits.gwei })
                </Text>
              </>
            ) }
          </DetailsInfoItem.Value>
        </>
      ) }

      { !config.UI.views.block.hiddenFields?.burnt_fees && !burntFees.isEqualTo(ZERO) && (
        <>
          <DetailsInfoItem.Label
            hint={ t('blockDetails.burntFeesHint') }
            isLoading={ isPlaceholderData }
          >
            { t('blockDetails.burntFees') }
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <IconSvg name="flame" boxSize={ 5 } color="gray.500" isLoading={ isPlaceholderData }/>
            <Skeleton isLoaded={ !isPlaceholderData } ml={ 2 }>
              { burntFees.dividedBy(WEI).toFixed() } { currencyUnits.ether }
            </Skeleton>
            { !txFees.isEqualTo(ZERO) && (
              <Tooltip label={ t('blockDetails.burntFeesPercentage') }>
                <Box>
                  <Utilization
                    ml={ 4 }
                    value={ burntFees.dividedBy(txFees).toNumber() }
                    isLoading={ isPlaceholderData }
                  />
                </Box>
              </Tooltip>
            ) }
          </DetailsInfoItem.Value>
        </>
      ) }

      { data.priority_fee !== null && BigNumber(data.priority_fee).gt(ZERO) && (
        <>
          <DetailsInfoItem.Label
            hint={ t('blockDetails.priorityFeeHint') }
            isLoading={ isPlaceholderData }
          >
            { t('blockDetails.priorityFee') }
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <Skeleton isLoaded={ !isPlaceholderData }>
              { BigNumber(data.priority_fee).dividedBy(WEI).toFixed() } { currencyUnits.ether }
            </Skeleton>
          </DetailsInfoItem.Value>
        </>
      ) }

      <GridItem colSpan={{ base: undefined, lg: 2 }}>
        <Element name="BlockDetails__cutLink">
          <Skeleton isLoaded={ !isPlaceholderData } mt={ 6 } display="inline-block">
            <Link
              fontSize="sm"
              textDecorationLine="underline"
              textDecorationStyle="dashed"
              onClick={ handleCutClick }
            >
              { isExpanded ? t('blockDetails.hideDetails') : t('blockDetails.viewDetails') }
            </Link>
          </Skeleton>
        </Element>
      </GridItem>

      { isExpanded && !isPlaceholderData && (
        <>
          <GridItem colSpan={{ base: undefined, lg: 2 }} mt={{ base: 1, lg: 4 }}/>

          { rollupFeature.isEnabled && rollupFeature.type === 'zkSync' && data.zksync &&
            <ZkSyncL2TxnBatchHashesInfo data={ data.zksync } isLoading={ isPlaceholderData }/> }

          { !isPlaceholderData && <BlockDetailsBlobInfo data={ data }/> }

          { data.bitcoin_merged_mining_header && (
            <>
              <DetailsInfoItem.Label
                hint={ t('blockDetails.bitcoinMergedMiningHeaderHint') }
              >
                { t('blockDetails.bitcoinMergedMiningHeader') }
              </DetailsInfoItem.Label>
              <DetailsInfoItem.Value
                flexWrap="nowrap"
                alignSelf="flex-start"
              >
                <Box whiteSpace="nowrap" overflow="hidden">
                  <HashStringShortenDynamic hash={ data.bitcoin_merged_mining_header }/>
                </Box>
                <CopyToClipboard text={ data.bitcoin_merged_mining_header }/>
              </DetailsInfoItem.Value>
            </>
          ) }

          { data.bitcoin_merged_mining_coinbase_transaction && (
            <>
              <DetailsInfoItem.Label
                hint={ t('blockDetails.bitcoinMergedMiningCoinbaseTransactionHint') }
              >
                { t('blockDetails.bitcoinMergedMiningCoinbaseTransaction') }
              </DetailsInfoItem.Label>
              <DetailsInfoItem.Value>
                <RawDataSnippet
                  data={ data.bitcoin_merged_mining_coinbase_transaction }
                  isLoading={ isPlaceholderData }
                  showCopy={ false }
                  textareaMaxHeight="100px"
                />
              </DetailsInfoItem.Value>
            </>
          ) }

          { data.bitcoin_merged_mining_merkle_proof && (
            <>
              <DetailsInfoItem.Label
                hint={ t('blockDetails.bitcoinMergedMiningMerkleProofHint') }
              >
                { t('blockDetails.bitcoinMergedMiningMerkleProof') }
              </DetailsInfoItem.Label>
              <DetailsInfoItem.Value>
                <RawDataSnippet
                  data={ data.bitcoin_merged_mining_merkle_proof }
                  isLoading={ isPlaceholderData }
                  showCopy={ false }
                  textareaMaxHeight="100px"
                />
              </DetailsInfoItem.Value>
            </>
          ) }

          { data.hash_for_merged_mining && (
            <>
              <DetailsInfoItem.Label
                hint={ t('blockDetails.hashForMergedMiningHint') }
              >
                { t('blockDetails.hashForMergedMining') }
              </DetailsInfoItem.Label>
              <DetailsInfoItem.Value
                flexWrap="nowrap"
                alignSelf="flex-start"
              >
                <Box whiteSpace="nowrap" overflow="hidden">
                  <HashStringShortenDynamic hash={ data.hash_for_merged_mining }/>
                </Box>
                <CopyToClipboard text={ data.hash_for_merged_mining }/>
              </DetailsInfoItem.Value>
            </>
          ) }

          <DetailsInfoItem.Label
            hint={ t('blockDetails.blockDifficultyHint') }
          >
            { t('blockDetails.blockDifficulty') }
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value overflow="hidden">
            <HashStringShortenDynamic hash={ BigNumber(data.difficulty).toFormat() }/>
          </DetailsInfoItem.Value>

          { data.total_difficulty && (
            <>
              <DetailsInfoItem.Label
                hint={ t('blockDetails.totalDifficultyHint') }
              >
                { t('blockDetails.totalDifficulty') }
              </DetailsInfoItem.Label>
              <DetailsInfoItem.Value overflow="hidden">
                <HashStringShortenDynamic hash={ BigNumber(data.total_difficulty).toFormat() }/>
              </DetailsInfoItem.Value>
            </>
          ) }

          <DetailsInfoItemDivider/>

          <DetailsInfoItem.Label
            hint={ t('blockDetails.blockHashHint') }
          >
            { t('blockDetails.blockHash') }
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value flexWrap="nowrap">
            <Box overflow="hidden" >
              <HashStringShortenDynamic hash={ data.hash }/>
            </Box>
            <CopyToClipboard text={ data.hash }/>
          </DetailsInfoItem.Value>

          { data.height > 0 && (
            <>
              <DetailsInfoItem.Label
                hint={ t('blockDetails.parentHashHint') }
              >
                { t('blockDetails.parentHash') }
              </DetailsInfoItem.Label>
              <DetailsInfoItem.Value flexWrap="nowrap">
                <LinkInternal
                  href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: String(data.height - 1) } }) }
                  overflow="hidden"
                  whiteSpace="nowrap"
                >
                  <HashStringShortenDynamic
                    hash={ data.parent_hash }
                  />
                </LinkInternal>
                <CopyToClipboard text={ data.parent_hash }/>
              </DetailsInfoItem.Value>
            </>
          ) }

          { rollupFeature.isEnabled && rollupFeature.type === 'arbitrum' && data.arbitrum && (
            <>
              <DetailsInfoItem.Label
                hint={ t('blockDetails.sendCountHint') }
                isLoading={ isPlaceholderData }
              >
                { t('blockDetails.sendCount') }
              </DetailsInfoItem.Label>
              <DetailsInfoItem.Value>
                { data.arbitrum.send_count.toLocaleString() }
              </DetailsInfoItem.Value>

              <DetailsInfoItem.Label
                hint={ t('blockDetails.sendRootHint') }
                isLoading={ isPlaceholderData }
              >
                { t('blockDetails.sendRoot') }
              </DetailsInfoItem.Label>
              <DetailsInfoItem.Value>
                { data.arbitrum.send_root }
              </DetailsInfoItem.Value>

              <DetailsInfoItem.Label
                hint={ t('blockDetails.delayedMessagesHint') }
                isLoading={ isPlaceholderData }
              >
                { t('blockDetails.delayedMessages') }
              </DetailsInfoItem.Label>
              <DetailsInfoItem.Value>
                { data.arbitrum.delayed_messages.toLocaleString() }
              </DetailsInfoItem.Value>
            </>
          ) }

          { !config.UI.views.block.hiddenFields?.nonce && (
            <>
              <DetailsInfoItem.Label
                hint={ t('blockDetails.nonceHint') }
              >
                { t('blockDetails.nonce') }
              </DetailsInfoItem.Label>
              <DetailsInfoItem.Value>
                { data.nonce }
              </DetailsInfoItem.Value>
            </>
          ) }
        </>
      ) }
    </Grid>
  );
};

export default BlockDetails;
