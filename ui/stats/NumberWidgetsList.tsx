import { Grid } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import useApiQuery from 'lib/api/useApiQuery';
import { STATS_COUNTER } from 'stubs/stats';
import StatsWidget from 'ui/shared/stats/StatsWidget';

import DataFetchAlert from '../shared/DataFetchAlert';

const UNITS_WITHOUT_SPACE = [ 's' ];

const NumberWidgetsList = () => {
  const { t } = useTranslation();

  const { data, isPlaceholderData, isError } = useApiQuery('stats_counters', {
    queryOptions: {
      placeholderData: { counters: Array(10).fill(STATS_COUNTER) },
    },
  });

  if (isError) {
    return <DataFetchAlert/>;
  }

  return (
    <Grid
      gridTemplateColumns={{ base: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
      gridGap={ 4 }
    >
      {
        data?.counters?.map(({ id, title, value, units, description }, index) => {
          // Create translation keys
          const titleKey = `numberWidget.${ title.replace(/ /g, '_').toLowerCase() }`;
          const descriptionKey = `numberWidget.${ description.replace(/ /g, '_').toLowerCase() }`;

          let unitsStr = '';
          if (units && UNITS_WITHOUT_SPACE.includes(units)) {
            unitsStr = units;
          } else if (units) {
            unitsStr = ' ' + units;
          }
          return (
            <StatsWidget
              key={ id + (isPlaceholderData ? index : '') }
              label={ t(titleKey) }
              value={ `${ Number(value).toLocaleString(undefined, { maximumFractionDigits: 3, notation: 'compact' }) }${ unitsStr }` }
              isLoading={ isPlaceholderData }
              hint={ t(descriptionKey) }
            />
          );
        })
      }
    </Grid>
  );
};

export default NumberWidgetsList;
