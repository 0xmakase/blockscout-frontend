import { Box, Flex, Skeleton, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { GasPriceInfo, GasPrices } from 'types/api/stats';

import { SECOND } from 'lib/consts';
import { asymp } from 'lib/html-entities';
import GasPrice from 'ui/shared/gas/GasPrice';
import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  type: keyof GasPrices;
  data: GasPriceInfo;
  isLoading: boolean;
}

const ICONS: Record<keyof GasPrices, IconName> = {
  fast: 'rocket_xl',
  average: 'gas_xl',
  slow: 'gas_xl',
};

const GasTrackerPriceSnippet = ({ data, type, isLoading }: Props) => {
  const { t } = useTranslation();
  const bgColors = {
    fast: 'transparent',
    average: useColorModeValue('gray.50', 'whiteAlpha.200'),
    slow: useColorModeValue('gray.50', 'whiteAlpha.200'),
  };

  return (
    <Box
      as="li"
      listStyleType="none"
      px={ 9 }
      py={ 6 }
      w={{ lg: 'calc(100% / 3)' }}
      bgColor={ bgColors[type] }
    >
      <Skeleton textStyle="h3" isLoaded={ !isLoading } w="fit-content">
        { t(`gasPrices.${ type }.title`) }
      </Skeleton>
      <Flex columnGap={ 3 } alignItems="center" mt={ 3 }>
        <IconSvg
          name={ ICONS[type] }
          boxSize={{ base: '30px', xl: 10 }}
          isLoading={ isLoading }
          flexShrink={ 0 }
        />
        <Skeleton isLoaded={ !isLoading }>
          <GasPrice
            data={ data }
            fontSize={{ base: '36px', xl: '48px' }}
            lineHeight="48px"
            fontWeight={ 600 }
            letterSpacing="-1px"
            fontFamily="heading"
          />
        </Skeleton>
      </Flex>
      <Skeleton isLoaded={ !isLoading } fontSize="sm" color="text_secondary" mt={ 3 } w="fit-content">
        { data.price !== null && data.fiat_price !== null && (
          <GasPrice data={ data } prefix={ `${ asymp } ` } unitMode="secondary"/>
        ) }
        <span> { t('gasPrices.perTransaction') }</span>
        { typeof data.time === 'number' && data.time > 0 && (
          <span>
            { ' ' }
            / { data.time / SECOND }
            { t('gasPrices.seconds') }
          </span>
        ) }
      </Skeleton>
      <Skeleton isLoaded={ !isLoading } fontSize="sm" color="text_secondary" mt={ 2 } w="fit-content" whiteSpace="pre">
        { typeof data.base_fee === 'number' && (
          <span>
            { t('gasPrices.baseFee') } { data.base_fee.toLocaleString(undefined, { maximumFractionDigits: 0 }) }
          </span>
        ) }
        { typeof data.base_fee === 'number' && typeof data.priority_fee === 'number' && <span> / </span> }
        { typeof data.priority_fee === 'number' && (
          <span>
            { t('gasPrices.priorityFee') } { data.priority_fee.toLocaleString(undefined, { maximumFractionDigits: 0 }) }
          </span>
        ) }
      </Skeleton>
    </Box>
  );
};

export default React.memo(GasTrackerPriceSnippet);
