import { Table, Tbody, Tr, Th, Link } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { InternalTransaction } from 'types/api/internalTransaction';

import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import { currencyUnits } from 'lib/units';
import IconSvg from 'ui/shared/IconSvg';
import { default as Thead } from 'ui/shared/TheadSticky';
import TxInternalsTableItem from 'ui/tx/internals/TxInternalsTableItem';
import type { Sort, SortField } from 'ui/tx/internals/utils';

interface Props {
  data: Array<InternalTransaction>;
  sort: Sort | undefined;
  onSortToggle: (field: SortField) => () => void;
  top: number;
  isLoading?: boolean;
}

const TxInternalsTable = ({ data, sort, onSortToggle, top, isLoading }: Props) => {
  const { t } = useTranslation();
  const sortIconTransform = sort?.includes('asc') ? 'rotate(-90deg)' : 'rotate(90deg)';

  return (
    <AddressHighlightProvider>
      <Table variant="simple" size="sm">
        <Thead top={ top }>
          <Tr>
            <Th width="28%">{ t('txInternalsTable.type') }</Th>
            <Th width="40%">{ t('txInternalsTable.fromTo') }</Th>
            <Th width="16%" isNumeric>
              <Link display="flex" alignItems="center" justifyContent="flex-end" onClick={ onSortToggle('value') } columnGap={ 1 }>
                { sort?.includes('value') && <IconSvg name="arrows/east" boxSize={ 4 } transform={ sortIconTransform }/> }
                { t('txInternalsTable.value') } { currencyUnits.ether }
              </Link>
            </Th>
            <Th width="16%" isNumeric>
              <Link display="flex" alignItems="center" justifyContent="flex-end" onClick={ onSortToggle('gas-limit') } columnGap={ 1 }>
                { sort?.includes('gas-limit') && <IconSvg name="arrows/east" boxSize={ 4 } transform={ sortIconTransform }/> }
                { t('txInternalsTable.gasLimit') } { currencyUnits.ether }
              </Link>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          { data.map((item, index) => (
            <TxInternalsTableItem key={ item.index.toString() + (isLoading ? index : '') } { ...item } isLoading={ isLoading }/>
          )) }
        </Tbody>
      </Table>
    </AddressHighlightProvider>
  );
};

export default TxInternalsTable;
