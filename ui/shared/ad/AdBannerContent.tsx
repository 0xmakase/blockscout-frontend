import { chakra, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { BannerPlatform } from './types';

import AdSenseBanner from './AdSenseBanner'; // Google AdSenseバナー用コンポーネントを追加

interface Props {
  className?: string;
  isLoading?: boolean;
  platform?: BannerPlatform;
  provider: string;
}

const AdBannerContent = ({ className, isLoading, provider, platform }: Props) => {
  const content = (() => {
    switch (provider) {
      case 'adsense':
        return <AdSenseBanner platform={ platform }/>; // Google AdSenseバナーを表示
      default:
        return null;
    }
  })();

  return (
    <Skeleton
      className={ className }
      isLoaded={ !isLoading }
      borderRadius="none"
      maxW="728px"
      w="100%"
    >
      { content }
    </Skeleton>
  );
};

export default chakra(AdBannerContent);
