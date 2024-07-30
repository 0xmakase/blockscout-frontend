import { Skeleton, chakra } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { mdash } from 'lib/html-entities';

interface Props {
  percentage: number;
  isLoading: boolean;
}

const GasTrackerNetworkUtilization = ({ percentage, isLoading }: Props) => {
  const { t } = useTranslation();

  const load = (() => {
    if (percentage > 80) {
      return 'high';
    }

    if (percentage > 50) {
      return 'medium';
    }

    return 'low';
  })();

  const colors = {
    high: 'red.600',
    medium: 'orange.600',
    low: 'green.600',
  };
  const color = colors[load];

  return (
    <Skeleton isLoaded={ !isLoading } whiteSpace="pre-wrap">
      <span>{ t('gasTrackerNetworkUtilization.networkUtilization') } </span>
      <chakra.span color={ color }>
        { percentage.toFixed(2) }% { mdash } { t(`gasTrackerNetworkUtilization.${ load }`) } { t('gasTrackerNetworkUtilization.load') }
      </chakra.span>
    </Skeleton>
  );
};

export default React.memo(GasTrackerNetworkUtilization);
