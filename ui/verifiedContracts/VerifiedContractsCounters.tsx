import { Box } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { VERIFIED_CONTRACTS_COUNTERS } from 'stubs/contract';
import StatsWidget from 'ui/shared/stats/StatsWidget';

const VerifiedContractsCounters = () => {
  const { t } = useTranslation();
  const countersQuery = useApiQuery('verified_contracts_counters', {
    queryOptions: {
      placeholderData: VERIFIED_CONTRACTS_COUNTERS,
    },
  });

  if (!countersQuery.data) {
    return null;
  }

  return (
    <Box columnGap={ 3 } rowGap={ 3 } mb={ 6 } display="grid" gridTemplateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}>
      <StatsWidget
        label={ t('verifiedContractsCounters.totalContracts') }
        value={ Number(countersQuery.data.smart_contracts).toLocaleString() }
        diff={ countersQuery.data.new_smart_contracts_24h }
        diffFormatted={ Number(countersQuery.data.new_smart_contracts_24h).toLocaleString() }
        isLoading={ countersQuery.isPlaceholderData }
        href={ config.features.stats.isEnabled ? { pathname: '/stats', query: { chartId: 'contractsGrowth' } } : undefined }
      />
      <StatsWidget
        label={ t('verifiedContractsCounters.verifiedContracts') }
        value={ Number(countersQuery.data.verified_smart_contracts).toLocaleString() }
        diff={ countersQuery.data.new_verified_smart_contracts_24h }
        diffFormatted={ Number(countersQuery.data.new_verified_smart_contracts_24h).toLocaleString() }
        isLoading={ countersQuery.isPlaceholderData }
        href={ config.features.stats.isEnabled ? { pathname: '/stats', query: { chartId: 'verifiedContractsGrowth' } } : undefined }
      />
    </Box>
  );
};

export default VerifiedContractsCounters;
