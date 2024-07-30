import { Box, Flex, chakra, useBoolean } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { route } from 'nextjs-routes';

import useApiQuery from 'lib/api/useApiQuery';
import { STATS_CHARTS } from 'stubs/stats';
import ContentLoader from 'ui/shared/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import LinkInternal from 'ui/shared/links/LinkInternal';
import ChartWidgetContainer from 'ui/stats/ChartWidgetContainer';

const GAS_PRICE_CHART_ID = 'averageGasPrice';

const GasTrackerChart = () => {
  const { t } = useTranslation();
  const [ isChartLoadingError, setChartLoadingError ] = useBoolean(false);
  const { data, isPlaceholderData, isError } = useApiQuery('stats_lines', {
    queryOptions: {
      placeholderData: STATS_CHARTS,
    },
  });

  const displayedCharts = React.useMemo(() => {
    return data?.sections
      ?.map((section) => {
        const charts = section.charts
          .filter((chart) => chart.id === GAS_PRICE_CHART_ID)
          .map((chart) => {
            const titleTranslationKey = `chartsAndStats.${ chart.title.replace(/ /g, '_').toLowerCase() }`;
            const descriptionTranslationKey = `chartsAndStats.${ chart.description.replace(/ /g, '_').toLowerCase() }`;

            return {
              ...chart,
              title: t(titleTranslationKey),
              description: t(descriptionTranslationKey),
            };
          });
        return {
          ...section,
          charts,
        };
      })
      .filter((section) => section.charts.length > 0);
  }, [ data?.sections, t ]);

  const content = (() => {
    if (isPlaceholderData) {
      return <ContentLoader/>;
    }

    if (isChartLoadingError || isError) {
      return <DataFetchAlert/>;
    }

    const chart = displayedCharts?.[0]?.charts?.[0];

    if (!chart) {
      return <DataFetchAlert/>;
    }

    return (
      <ChartWidgetContainer
        id={ GAS_PRICE_CHART_ID }
        title={ chart.title }
        description={ chart.description }
        interval="oneMonth"
        units={ chart.units || undefined }
        isPlaceholderData={ isPlaceholderData }
        onLoadingError={ setChartLoadingError.on }
        h="320px"
      />
    );
  })();

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={ 6 }>
        <chakra.h3 textStyle="h3">{ t('gasTrackerChart.title') }</chakra.h3>
        <LinkInternal href={ route({ pathname: '/stats', hash: 'gas' }) }>
          { t('gasTrackerChart.linkText') }
        </LinkInternal>
      </Flex>
      { content }
    </Box>
  );
};

export default React.memo(GasTrackerChart);
