import { Skeleton } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { TokenInfo } from 'types/api/token';

import config from 'configs/app';
import { WEI, WEI_IN_GWEI } from 'lib/consts';
import { currencyUnits } from 'lib/units';
import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';

interface Props {
  gasToken?: TokenInfo<'ERC-20'> | null;
  gasPrice: string | null;
  isLoading?: boolean;
}

const TxDetailsGasPrice = ({ gasPrice, gasToken, isLoading }: Props) => {
  const { t } = useTranslation();

  if (config.UI.views.tx.hiddenFields?.gas_price || !gasPrice) {
    return null;
  }

  const content = (() => {
    if (gasToken) {
      return (
        <Skeleton isLoaded={ !isLoading } display="flex">
          <span>{ BigNumber(gasPrice).dividedBy(WEI).toFixed() }</span>
          <TokenEntity token={ gasToken } noCopy onlySymbol w="auto" ml={ 1 }/>
        </Skeleton>
      );
    }

    return (
      <>
        <Skeleton isLoaded={ !isLoading } mr={ 1 }>
          { BigNumber(gasPrice).dividedBy(WEI).toFixed() } { currencyUnits.ether }
        </Skeleton>
        <Skeleton isLoaded={ !isLoading } color="text_secondary">
          <span>({ BigNumber(gasPrice).dividedBy(WEI_IN_GWEI).toFixed() } { currencyUnits.gwei })</span>
        </Skeleton>
      </>
    );
  })();

  return (
    <>
      <DetailsInfoItem.Label
        hint={ t('txDetailsGasPrice.hint') }
        isLoading={ isLoading }
      >
        { t('txDetailsGasPrice.label') }
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        { content }
      </DetailsInfoItem.Value>
    </>
  );
};

export default TxDetailsGasPrice;
