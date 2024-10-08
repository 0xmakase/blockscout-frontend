import React from 'react';
import { useTranslation } from 'react-i18next';

import type { TxStateChange } from 'types/api/txStateChanges';

import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';

import { getStateElements } from './utils';

interface Props {
  data: TxStateChange;
  isLoading?: boolean;
}

const TxStateListItem = ({ data, isLoading }: Props) => {
  const { t } = useTranslation();
  const { before, after, change, tag, tokenId } = getStateElements(t, data, isLoading);

  return (
    <ListItemMobileGrid.Container>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('txStateListItem.address') }</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value py="3px" display="flex" flexWrap="nowrap" columnGap={ 3 }>
        <AddressEntity
          address={ data.address }
          isLoading={ isLoading }
          truncation="constant"
        />
        { tag }
      </ListItemMobileGrid.Value>

      { before && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('txStateListItem.before') }</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>{ before }</ListItemMobileGrid.Value>
        </>
      ) }

      { after && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('txStateListItem.after') }</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>{ after }</ListItemMobileGrid.Value>
        </>
      ) }

      { change && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('txStateListItem.change') }</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>{ change }</ListItemMobileGrid.Value>
        </>
      ) }

      { tokenId && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>{ t('txStateListItem.tokenId') }</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value py="0">{ tokenId }</ListItemMobileGrid.Value>
        </>
      ) }

    </ListItemMobileGrid.Container>
  );
};

export default TxStateListItem;
