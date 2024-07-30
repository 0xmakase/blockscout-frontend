import { Skeleton } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { Address } from 'types/api/address';

import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';

interface Props {
  data: Pick<Address, 'name' | 'token' | 'is_contract'>;
  isLoading: boolean;
}

const AddressNameInfo = ({ data, isLoading }: Props) => {
  const { t } = useTranslation();

  if (data.token) {
    return (
      <>
        <DetailsInfoItem.Label
          hint={ t('addressNameInfo.tokenNameHint') }
          isLoading={ isLoading }
        >
          { t('addressNameInfo.tokenName') }
        </DetailsInfoItem.Label>
        <DetailsInfoItem.Value>
          <TokenEntity
            token={ data.token }
            isLoading={ isLoading }
            noIcon
            noCopy
          />
        </DetailsInfoItem.Value>
      </>
    );
  }

  if (data.is_contract && data.name) {
    return (
      <>
        <DetailsInfoItem.Label
          hint={ t('addressNameInfo.contractNameHint') }
          isLoading={ isLoading }
        >
          { t('addressNameInfo.contractName') }
        </DetailsInfoItem.Label>
        <DetailsInfoItem.Value>
          <Skeleton isLoaded={ !isLoading }>
            { data.name }
          </Skeleton>
        </DetailsInfoItem.Value>
      </>
    );
  }

  if (data.name) {
    return (
      <>
        <DetailsInfoItem.Label
          hint={ t('addressNameInfo.validatorNameHint') }
          isLoading={ isLoading }
        >
          { t('addressNameInfo.validatorName') }
        </DetailsInfoItem.Label>
        <DetailsInfoItem.Value>
          <Skeleton isLoaded={ !isLoading }>
            { data.name }
          </Skeleton>
        </DetailsInfoItem.Value>
      </>
    );
  }

  return null;
};

export default React.memo(AddressNameInfo);
