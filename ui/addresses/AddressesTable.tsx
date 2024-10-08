import { Table, Tbody, Tr, Th } from '@chakra-ui/react';
import type BigNumber from 'bignumber.js';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { AddressesItem } from 'types/api/addresses';

import { ZERO } from 'lib/consts';
import { currencyUnits } from 'lib/units';
import { default as Thead } from 'ui/shared/TheadSticky';

import AddressesTableItem from './AddressesTableItem';

interface Props {
  items: Array<AddressesItem>;
  totalSupply: BigNumber;
  pageStartIndex: number;
  top: number;
  isLoading?: boolean;
}

const AddressesTable = ({ items, totalSupply, pageStartIndex, top, isLoading }: Props) => {
  const { t } = useTranslation();
  const hasPercentage = !totalSupply.eq(ZERO);
  return (
    <Table variant="simple" size="sm">
      <Thead top={ top }>
        <Tr>
          <Th width="64px">{ t('addressesTable.rank') }</Th>
          <Th width={ hasPercentage ? '30%' : '40%' }>{ t('addressesTable.address') }</Th>
          <Th width="20%" pl={ 10 }>{ t('addressesTable.publicTag') }</Th>
          <Th width={ hasPercentage ? '20%' : '25%' } isNumeric>{ `${ t('addressesTable.balance') } ${ currencyUnits.ether }` }</Th>
          { hasPercentage && <Th width="15%" isNumeric>{ t('addressesTable.percentage') }</Th> }
          <Th width="15%" isNumeric>{ t('addressesTable.txnCount') }</Th>
        </Tr>
      </Thead>
      <Tbody>
        { items.map((item, index) => (
          <AddressesTableItem
            key={ item.hash + (isLoading ? index : '') }
            item={ item }
            totalSupply={ totalSupply }
            index={ pageStartIndex + index }
            hasPercentage={ hasPercentage }
            isLoading={ isLoading }
          />
        )) }
      </Tbody>
    </Table>
  );
};

export default AddressesTable;
