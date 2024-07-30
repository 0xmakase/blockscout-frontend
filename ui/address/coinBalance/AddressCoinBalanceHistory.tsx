import { Hide, Show, Table, Tbody, Th, Tr } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { AddressCoinBalanceHistoryResponse } from 'types/api/address';
import type { PaginationParams } from 'ui/shared/pagination/types';

import type { ResourceError } from 'lib/api/resources';
import { currencyUnits } from 'lib/units';
import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import { default as Thead } from 'ui/shared/TheadSticky';

import AddressCoinBalanceListItem from './AddressCoinBalanceListItem';
import AddressCoinBalanceTableItem from './AddressCoinBalanceTableItem';

interface Props {
  query: UseQueryResult<AddressCoinBalanceHistoryResponse, ResourceError<unknown>> & {
    pagination: PaginationParams;
  };
}

const AddressCoinBalanceHistory = ({ query }: Props) => {
  const { t } = useTranslation();

  const content = query.data?.items ? (
    <>
      <Hide below="lg" ssr={ false }>
        <Table variant="simple" size="sm">
          <Thead top={ query.pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }>
            <Tr>
              <Th width="20%">{ t('addressCoinBalanceHistory.block') }</Th>
              <Th width="20%">{ t('addressCoinBalanceHistory.txn') }</Th>
              <Th width="20%">{ t('addressCoinBalanceHistory.age') }</Th>
              <Th width="20%" isNumeric pr={ 1 }>{ t('addressCoinBalanceHistory.balance', { unit: currencyUnits.ether }) }</Th>
              <Th width="20%" isNumeric>{ t('addressCoinBalanceHistory.delta') }</Th>
            </Tr>
          </Thead>
          <Tbody>
            { query.data.items.map((item, index) => (
              <AddressCoinBalanceTableItem
                key={ item.block_number + (query.isPlaceholderData ? String(index) : '') }
                { ...item }
                page={ query.pagination.page }
                isLoading={ query.isPlaceholderData }
              />
            )) }
          </Tbody>
        </Table>
      </Hide>
      <Show below="lg" ssr={ false }>
        { query.data.items.map((item, index) => (
          <AddressCoinBalanceListItem
            key={ item.block_number + (query.isPlaceholderData ? String(index) : '') }
            { ...item }
            page={ query.pagination.page }
            isLoading={ query.isPlaceholderData }
          />
        )) }
      </Show>
    </>
  ) : null;

  const actionBar = query.pagination.isVisible ? (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...query.pagination }/>
    </ActionBar>
  ) : null;

  return (
    <DataListDisplay
      mt={ 8 }
      isError={ query.isError }
      items={ query.data?.items }
      emptyText={ t('addressCoinBalanceHistory.emptyText') }
      content={ content }
      actionBar={ actionBar }
    />
  );
};

export default React.memo(AddressCoinBalanceHistory);
