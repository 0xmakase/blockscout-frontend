import { Table, Tbody, Tr, Th } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { AddressTokenBalance } from 'types/api/address';

import { default as Thead } from 'ui/shared/TheadSticky';

import ERC20TokensTableItem from './ERC20TokensTableItem';

interface Props {
  data: Array<AddressTokenBalance>;
  top: number;
  isLoading: boolean;
}

const ERC20TokensTable = ({ data, top, isLoading }: Props) => {
  const { t } = useTranslation();

  return (
    <Table variant="simple" size="sm">
      <Thead top={ top }>
        <Tr>
          <Th width="30%">{ t('erc20TokensTable.asset') }</Th>
          <Th width="30%">{ t('erc20TokensTable.contractAddress') }</Th>
          <Th width="10%" isNumeric>{ t('erc20TokensTable.price') }</Th>
          <Th width="15%" isNumeric>{ t('erc20TokensTable.quantity') }</Th>
          <Th width="15%" isNumeric>{ t('erc20TokensTable.value') }</Th>
        </Tr>
      </Thead>
      <Tbody>
        { data.map((item, index) => (
          <ERC20TokensTableItem key={ item.token.address + (isLoading ? index : '') } { ...item } isLoading={ isLoading }/>
        )) }
      </Tbody>
    </Table>
  );
};

export default ERC20TokensTable;
