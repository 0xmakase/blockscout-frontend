import { Flex, Skeleton, Tooltip } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import type { TFunction } from 'i18next';
import React from 'react';

import type { TxStateChange } from 'types/api/txStateChanges';

import config from 'configs/app';
import { ZERO_ADDRESS } from 'lib/consts';
import { nbsp, space } from 'lib/html-entities';
import getNetworkValidatorTitle from 'lib/networks/getNetworkValidatorTitle';
import { currencyUnits } from 'lib/units';
import Tag from 'ui/shared/chakra/Tag';
import NftEntity from 'ui/shared/entities/nft/NftEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';

import TxStateTokenIdList from './TxStateTokenIdList';

export function getStateElements(t: TFunction, data: TxStateChange, isLoading?: boolean) {
  const tag = (() => {
    if (data.is_miner) {
      return (
        <Tooltip label={ t('utils.block_producer_tooltip') }>
          <Tag textTransform="capitalize" colorScheme="yellow" isLoading={ isLoading }>
            { t(getNetworkValidatorTitle()) }
          </Tag>
        </Tooltip>
      );
    }

    if (data.address.hash === ZERO_ADDRESS) {
      const changeDirection = (() => {
        if (Array.isArray(data.change)) {
          const firstChange = data.change[0];
          return firstChange.direction;
        }
        return Number(data.change) > 0 ? 'to' : 'from';
      })();

      if (changeDirection) {
        const text = changeDirection === 'from' ? t('utils.mint_address_tag') : t('utils.burn_address_tag');
        return (
          <Tooltip label={ t('utils.mint_burn_address_tooltip') }>
            <Tag textTransform="capitalize" colorScheme="yellow" isLoading={ isLoading }>{ text }</Tag>
          </Tooltip>
        );
      }
    }

    return null;
  })();

  switch (data.type) {
    case 'coin': {
      const beforeBn = BigNumber(data.balance_before || '0').div(10 ** config.chain.currency.decimals);
      const afterBn = BigNumber(data.balance_after || '0').div(10 ** config.chain.currency.decimals);
      const differenceBn = afterBn.minus(beforeBn);
      const changeColor = beforeBn.lte(afterBn) ? 'green.500' : 'red.500';
      const changeSign = beforeBn.lte(afterBn) ? '+' : '-';

      return {
        before: (
          <Skeleton isLoaded={ !isLoading } wordBreak="break-all" display="inline-block">
            { t('utils.coin_balance_before', { balance: beforeBn.toFormat(), currency: currencyUnits.ether }) }
          </Skeleton>
        ),
        after: (
          <Skeleton isLoaded={ !isLoading } wordBreak="break-all" display="inline-block">
            { t('utils.coin_balance_after', { balance: afterBn.toFormat(), currency: currencyUnits.ether }) }
          </Skeleton>
        ),
        change: (
          <Skeleton isLoaded={ !isLoading } display="inline-block" color={ changeColor }>
            <span>{ changeSign }{ nbsp }{ differenceBn.abs().toFormat() }</span>
          </Skeleton>
        ),
        tag,
      };
    }
    case 'token': {
      const tokenLink = (
        <TokenEntity
          token={ data.token }
          isLoading={ isLoading }
          noIcon
          noCopy
          onlySymbol
          w="auto"
        />
      );
      const beforeBn = BigNumber(data.balance_before || '0').div(BigNumber(10 ** (Number(data.token.decimals))));
      const afterBn = BigNumber(data.balance_after || '0').div(BigNumber(10 ** (Number(data.token.decimals))));
      const change = (() => {
        let differenceBn;
        if (typeof data.change === 'string') {
          differenceBn = BigNumber(data.change || '0').div(BigNumber(10 ** (Number(data.token.decimals))));
        } else {
          differenceBn = afterBn.minus(beforeBn);
        }

        if (!differenceBn || differenceBn.isEqualTo(0)) {
          return null;
        }

        const changeColor = differenceBn.isGreaterThanOrEqualTo(0) ? 'green.500' : 'red.500';
        const changeSign = differenceBn.isGreaterThanOrEqualTo(0) ? '+' : '-';

        return (
          <Skeleton isLoaded={ !isLoading } display="inline-block" color={ changeColor }>
            <span>{ t('utils.token_balance_change', { sign: changeSign, difference: differenceBn.abs().toFormat() }) }</span>
          </Skeleton>
        );
      })();

      const tokenId = (() => {
        if (!Array.isArray(data.change)) {
          if ('token_id' in data && data.token_id) {
            return (
              <NftEntity
                hash={ data.token.address }
                id={ data.token_id }
                isLoading={ isLoading }
              />
            );
          } else {
            return null;
          }
        }

        return <TxStateTokenIdList items={ data.change } tokenAddress={ data.token.address } isLoading={ isLoading }/>;
      })();

      return {
        before: data.balance_before ? (
          <Flex whiteSpace="pre-wrap" justifyContent={{ base: 'flex-start', lg: 'flex-end' }} flexWrap="wrap">
            <Skeleton isLoaded={ !isLoading }>{ t('utils.token_balance_before', { balance: beforeBn.toFormat() }) }</Skeleton>
            <span>{ space }</span>
            { tokenLink }
          </Flex>
        ) : null,
        after: data.balance_after ? (
          <Flex whiteSpace="pre-wrap" justifyContent={{ base: 'flex-start', lg: 'flex-end' }} flexWrap="wrap">
            <Skeleton isLoaded={ !isLoading }>{ t('utils.token_balance_after', { balance: afterBn.toFormat() }) }</Skeleton>
            <span>{ space }</span>
            { tokenLink }
          </Flex>
        ) : null,
        change,
        tag,
        tokenId,
      };
    }
  }
}
