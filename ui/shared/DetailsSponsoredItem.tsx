import { GridItem } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import config from 'configs/app';
import * as cookies from 'lib/cookies';
import useIsMobile from 'lib/hooks/useIsMobile';
import AdBanner from 'ui/shared/ad/AdBanner';
import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';

const feature = config.features.adsBanner;

interface Props {
  isLoading?: boolean;
}

const DetailsSponsoredItem = ({ isLoading }: Props) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const hasAdblockCookie = cookies.get(cookies.NAMES.ADBLOCK_DETECTED);

  if (!feature.isEnabled || hasAdblockCookie === 'true') {
    return null;
  }

  if (isMobile) {
    return (
      <GridItem mt={ 5 }>
        <AdBanner mx="auto" isLoading={ isLoading } display="flex" justifyContent="center"/>
      </GridItem>
    );
  }

  return (
    <>
      <DetailsInfoItem.Label
        hint={ t('detailsSponsoredItem.sponsoredHint') }
        isLoading={ isLoading }
      >
        { t('detailsSponsoredItem.sponsored') }
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <AdBanner isLoading={ isLoading }/>
      </DetailsInfoItem.Value>
    </>
  );
};

export default React.memo(DetailsSponsoredItem);
