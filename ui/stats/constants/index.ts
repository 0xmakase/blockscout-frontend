import { Resolution } from '@blockscout/stats-types';
import type { StatsIntervalIds } from 'types/client/stats';

export const STATS_RESOLUTIONS: Array<{ id: Resolution; title: string }> = [
  {
    id: Resolution.DAY,
    title: 'Day',
  },
  {
    id: Resolution.WEEK,
    title: 'Week',
  },
  {
    id: Resolution.MONTH,
    title: 'Month',
  },
  {
    id: Resolution.YEAR,
    title: 'Year',
  },
];

export const STATS_INTERVALS: { [key in StatsIntervalIds]: { title: string; shortTitle: string; start?: Date } } = {
  all: {
    title: 'chartsAndStats.allTime',
    shortTitle: 'All time',
  },
  oneMonth: {
    title: `${ '1 month'.replace(/ /g, '_').toLowerCase() }`,
    shortTitle: '1M',
    start: getStartDateInPast(1),
  },
  threeMonths: {
    title: `${ '3 months'.replace(/ /g, '_').toLowerCase() }`,
    shortTitle: '3M',
    start: getStartDateInPast(3),
  },
  sixMonths: {
    title: `${ '6 months'.replace(/ /g, '_').toLowerCase() }`,
    shortTitle: '6M',
    start: getStartDateInPast(6),
  },
  oneYear: {
    title: `${ '1 year'.replace(/ /g, '_').toLowerCase() }`,
    shortTitle: '1Y',
    start: getStartDateInPast(12),
  },
};

function getStartDateInPast(months: number): Date {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date;
}
