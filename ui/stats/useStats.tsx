/* eslint-disable no-console */
import { useRouter } from 'next/router';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import type * as stats from '@blockscout/stats-types';
import type { StatsIntervalIds } from 'types/client/stats';

import useApiQuery from 'lib/api/useApiQuery';
import getQueryParamString from 'lib/router/getQueryParamString';
import { STATS_CHARTS } from 'stubs/stats';

function isSectionMatches(section: stats.LineChartSection, currentSection: string): boolean {
  return currentSection === 'all' || section.id === currentSection;
}

function isChartNameMatches(q: string, chart: stats.LineChartInfo) {
  return chart.title.toLowerCase().includes(q.toLowerCase());
}

export default function useStats() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, isPlaceholderData, isError } = useApiQuery('stats_lines', {
    queryOptions: {
      placeholderData: STATS_CHARTS,
    },
  });

  const [ currentSection, setCurrentSection ] = useState('all');
  const [ filterQuery, setFilterQuery ] = useState('');
  const [ initialFilterQuery, setInitialFilterQuery ] = useState('');
  const [ interval, setInterval ] = useState<StatsIntervalIds>('oneMonth');
  const [ translatedData, setTranslatedData ] = useState<typeof data>();

  useEffect(() => {
    if (data && !isPlaceholderData && !isError) {
      console.log(data);
      const translatedSections = data.sections.map((section) => ({
        ...section,
        title: t(`chartsAndStats.${ section.title.replace(/ /g, '_').toLowerCase() }`),
        charts: section.charts.map((chart) => ({
          ...chart,
          title: t(`chartsAndStats.${ chart.title.replace(/ /g, '_').toLowerCase() }`),
          description: t(`chartsAndStats.${ chart.description.replace(/ /g, '_').toLowerCase() }`),
        })),
      }));
      setTranslatedData({ ...data, sections: translatedSections });
    }
  }, [ data, isPlaceholderData, isError, t ]);

  const sectionIds = useMemo(() => translatedData?.sections?.map(({ id }) => id), [ translatedData ]);

  useEffect(() => {
    if (!isPlaceholderData && !isError) {
      const chartId = getQueryParamString(router.query.chartId);
      const chartName = translatedData?.sections
        .map((section) => section.charts.find((chart) => chart.id === chartId))
        .filter(Boolean)[0]?.title;
      if (chartName) {
        setInitialFilterQuery(chartName);
        setFilterQuery(chartName);
        router.replace({ pathname: '/stats' }, undefined, { scroll: false });
      }
    }
  }, [ isPlaceholderData, translatedData, router, isError ]);

  const displayedCharts = useMemo(() => {
    return translatedData?.sections
      ?.map((section) => ({
        ...section,
        charts: section.charts.filter((chart) =>
          isSectionMatches(section, currentSection) &&
          isChartNameMatches(filterQuery, chart),
        ),
      }))
      .filter((section) => section.charts.length > 0);
  }, [ currentSection, translatedData, filterQuery ]);

  const handleSectionChange = useCallback((newSection: string) => {
    setCurrentSection(newSection);
  }, []);

  const handleIntervalChange = useCallback((newInterval: StatsIntervalIds) => {
    setInterval(newInterval);
  }, []);

  const handleFilterChange = useCallback((q: string) => {
    setFilterQuery(q);
  }, []);

  return useMemo(() => ({
    sections: translatedData?.sections,
    sectionIds,
    isPlaceholderData,
    isError,
    initialFilterQuery,
    filterQuery,
    currentSection,
    handleSectionChange,
    interval,
    handleIntervalChange,
    handleFilterChange,
    displayedCharts,
  }), [
    translatedData,
    sectionIds,
    isPlaceholderData,
    isError,
    initialFilterQuery,
    filterQuery,
    currentSection,
    handleSectionChange,
    interval,
    handleIntervalChange,
    handleFilterChange,
    displayedCharts,
  ]);
}
