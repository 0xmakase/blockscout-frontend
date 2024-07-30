import { Box } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import config from 'configs/app';
import PageTitle from 'ui/shared/Page/PageTitle';

import ChartsWidgetsList from '../stats/ChartsWidgetsList';
import NumberWidgetsList from '../stats/NumberWidgetsList';
import StatsFilters from '../stats/StatsFilters';
import useStats from '../stats/useStats';

const Stats = () => {
  const { t } = useTranslation();
  const {
    isPlaceholderData,
    isError,
    sections,
    currentSection,
    handleSectionChange,
    interval,
    handleIntervalChange,
    handleFilterChange,
    displayedCharts,
    filterQuery,
    initialFilterQuery,
  } = useStats();

  return (
    <>
      <PageTitle
        title={ config.meta.seo.enhancedDataEnabled ?
          t('stats.pageTitle.enhanced', { chainName: config.chain.name }) :
          t('stats.pageTitle.default', { chainName: config.chain.name }) }
      />

      <Box mb={{ base: 6, sm: 8 }}>
        <NumberWidgetsList/>
      </Box>

      <Box mb={{ base: 6, sm: 8 }}>
        <StatsFilters
          isLoading={ isPlaceholderData }
          initialFilterValue={ initialFilterQuery }
          sections={ sections }
          currentSection={ currentSection }
          onSectionChange={ handleSectionChange }
          interval={ interval }
          onIntervalChange={ handleIntervalChange }
          onFilterInputChange={ handleFilterChange }
        />
      </Box>

      <ChartsWidgetsList
        filterQuery={ filterQuery }
        initialFilterQuery={ initialFilterQuery }
        isError={ isError }
        isPlaceholderData={ isPlaceholderData }
        charts={ displayedCharts }
        interval={ interval }
      />
    </>
  );
};

export default Stats;
