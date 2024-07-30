import { Table, Tbody, Tr, Th } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { InternalTransaction } from 'types/api/internalTransaction';

import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import { currencyUnits } from 'lib/units';
import { default as Thead } from 'ui/shared/TheadSticky';

import AddressIntTxsTableItem from './AddressIntTxsTableItem';

interface Props {
  data: Array<InternalTransaction>;
  currentAddress: string;
  isLoading?: boolean;
}

const AddressIntTxsTable = ({ data, currentAddress, isLoading }: Props) => {
  const { t } = useTranslation();

  return (
    <AddressHighlightProvider>
      <Table variant="simple" size="sm">
        <Thead top={ 68 }>
          <Tr>
            <Th width="15%">{ t('addressIntTxsTable.parentTxnHash') }</Th>
            <Th width="15%">{ t('addressIntTxsTable.type') }</Th>
            <Th width="10%">{ t('addressIntTxsTable.block') }</Th>
            <Th width="40%">{ t('addressIntTxsTable.fromTo') }</Th>
            <Th width="20%" isNumeric>
              { t('addressIntTxsTable.value') } { currencyUnits.ether }
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          { data.map((item, index) => (
            <AddressIntTxsTableItem
              key={ item.transaction_hash + '_' + index }
              { ...item }
              currentAddress={ currentAddress }
              isLoading={ isLoading }
            />
          )) }
        </Tbody>
      </Table>
    </AddressHighlightProvider>
  );
};

export default AddressIntTxsTable;
