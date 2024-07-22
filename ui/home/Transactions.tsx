import { Heading } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import config from 'configs/app';
import useHasAccount from 'lib/hooks/useHasAccount';
import LatestDeposits from 'ui/home/LatestDeposits';
import LatestTxs from 'ui/home/LatestTxs';
import LatestWatchlistTxs from 'ui/home/LatestWatchlistTxs';
import TabsWithScroll from 'ui/shared/Tabs/TabsWithScroll';

const rollupFeature = config.features.rollup;

const TAB_LIST_PROPS = {
  mb: { base: 3, lg: 3 },
};

const TransactionsHome = () => {
  const { t } = useTranslation();
  const hasAccount = useHasAccount();

  if ((rollupFeature.isEnabled && rollupFeature.type === 'optimistic') || hasAccount) {
    const tabs = [
      { id: 'txn', title: t('latest_txn'), component: <LatestTxs/> },
      rollupFeature.isEnabled && rollupFeature.type === 'optimistic' && { id: 'deposits', title: t('deposits_l1_to_l2'), component: <LatestDeposits/> },
      hasAccount && { id: 'watchlist', title: t('watch_list'), component: <LatestWatchlistTxs/> },
    ].filter(Boolean);
    return (
      <>
        <Heading as="h4" size="sm" mb={ 3 }>{ t('transactions') }</Heading>
        <TabsWithScroll tabs={ tabs } lazyBehavior="keepMounted" tabListProps={ TAB_LIST_PROPS }/>
      </>
    );
  }

  return (
    <>
      <Heading as="h4" size="sm" mb={ 3 }>{ t('latest_transactions') }</Heading>
      <LatestTxs/>
    </>
  );
};

export default TransactionsHome;
