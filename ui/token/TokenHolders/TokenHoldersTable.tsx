import { Table, Tbody, Tr, Th } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { TokenHolder, TokenInfo } from 'types/api/token';

import { default as Thead } from 'ui/shared/TheadSticky';
import TokenHoldersTableItem from 'ui/token/TokenHolders/TokenHoldersTableItem';

interface Props {
  data: Array<TokenHolder>;
  token: TokenInfo;
  top: number;
  isLoading?: boolean;
}

const TokenHoldersTable = ({ data, token, top, isLoading }: Props) => {
  const { t } = useTranslation();

  return (
    <Table variant="simple" size="sm" layout="auto">
      <Thead top={ top }>
        <Tr>
          <Th>{ t('tokenHoldersTable.holder') }</Th>
          { (token.type === 'ERC-1155' || token.type === 'ERC-404') && <Th>{ t('tokenHoldersTable.id') }</Th> }
          <Th isNumeric>{ t('tokenHoldersTable.quantity') }</Th>
          { token.total_supply && token.type !== 'ERC-404' && <Th isNumeric width="175px">{ t('tokenHoldersTable.percentage') }</Th> }
        </Tr>
      </Thead>
      <Tbody>
        { data.map((item, index) => (
          <TokenHoldersTableItem key={ item.address.hash + (isLoading ? index : '') } holder={ item } token={ token } isLoading={ isLoading }/>
        )) }
      </Tbody>
    </Table>
  );
};

export default React.memo(TokenHoldersTable);
