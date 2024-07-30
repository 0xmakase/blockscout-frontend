import { Alert, AlertIcon, AlertTitle, Skeleton } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { SocketMessage } from 'lib/socket/types';
import type { IndexingStatus } from 'types/api/indexingStatus';

import config from 'configs/app';
import useApiQuery, { getResourceKey } from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/contexts/app';
import * as cookies from 'lib/cookies';
import { nbsp, ndash } from 'lib/html-entities';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';

const IndexingBlocksAlert = () => {
  const { t } = useTranslation();
  const appProps = useAppContext();
  const cookiesString = appProps.cookies;
  const [ hasAlertCookie ] = React.useState(cookies.get(cookies.NAMES.INDEXING_ALERT, cookiesString) === 'true');

  const { data, isError, isPending } = useApiQuery('homepage_indexing_status', {
    queryOptions: {
      enabled: !config.UI.indexingAlert.blocks.isHidden,
    },
  });

  React.useEffect(() => {
    if (!isPending && !isError) {
      cookies.set(cookies.NAMES.INDEXING_ALERT, data.finished_indexing_blocks ? 'false' : 'true');
    }
  }, [ data, isError, isPending ]);

  const queryClient = useQueryClient();

  const handleBlocksIndexStatus: SocketMessage.BlocksIndexStatus['handler'] = React.useCallback((payload) => {
    queryClient.setQueryData(getResourceKey('homepage_indexing_status'), (prevData: IndexingStatus | undefined) => {

      const newData = prevData ? { ...prevData } : {} as IndexingStatus;
      newData.finished_indexing_blocks = payload.finished;
      newData.indexed_blocks_ratio = payload.ratio;

      return newData;
    });
  }, [ queryClient ]);

  const blockIndexingChannel = useSocketChannel({
    topic: 'blocks:indexing',
    isDisabled: !data || data.finished_indexing_blocks || config.UI.indexingAlert.blocks.isHidden,
  });

  useSocketMessage({
    channel: blockIndexingChannel,
    event: 'block_index_status',
    handler: handleBlocksIndexStatus,
  });

  if (config.UI.indexingAlert.blocks.isHidden) {
    return null;
  }

  if (isError) {
    return (
      <Alert status="error" colorScheme="red" py={ 3 } borderRadius="md">
        <AlertIcon display={{ base: 'none', lg: 'flex' }}/>
        <AlertTitle>{ t('indexingBlocksAlert.error') }</AlertTitle>
      </Alert>
    );
  }

  if (isPending) {
    return hasAlertCookie ? <Skeleton h={{ base: '96px', lg: '48px' }} w="100%"/> : null;
  }

  if (data.finished_indexing_blocks !== false) {
    return null;
  }

  return (
    <Alert status="info" colorScheme="gray" py={ 3 } borderRadius="md">
      <AlertIcon display={{ base: 'none', lg: 'flex' }}/>
      <AlertTitle>
        { t('indexingBlocksAlert.title', { ratio: Math.floor(Number(data.indexed_blocks_ratio) * 100), nbsp, ndash }) }
      </AlertTitle>
    </Alert>
  );
};

export default React.memo(IndexingBlocksAlert);
