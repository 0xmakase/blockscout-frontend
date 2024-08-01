import { Flex, chakra } from '@chakra-ui/react';
import React from 'react';

import type { BannerPlatform } from './types';

interface Props {
  className?: string;
  platform?: BannerPlatform;
}
// TODO: ad-client, ad-slotを設定
const AdSenseBanner = ({ className, platform }: Props) => {
  const { width, height, adSlot } = (() => {
    switch (platform) {
      case 'desktop':
        return { width: '728px', height: '90px', adSlot: 'XXXXXXXXXX1' };
      case 'mobile':
        return { width: '320px', height: '50px', adSlot: 'XXXXXXXXXX2' };
      default:
        return {
          width: {
            base: '320px',
            lg: '728px',
          },
          height: {
            base: '50px',
            lg: '90px',
          },
          adSlot: 'XXXXXXXXXX3',
        };
    }
  })();

  return (
    <Flex className={ className } id="adBanner" h={ height } w={ width }>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={ adSlot }
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
      <script>
        (adsbygoogle = window.adsbygoogle || []).push({ });
      </script>
    </Flex>
  );
};

export default chakra(AdSenseBanner);
