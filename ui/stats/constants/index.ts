import type { StatsIntervalIds } from 'types/client/stats';

export const STATS_INTERVALS: { [key in StatsIntervalIds]: { title: string; start?: Date } } = {
  all: {
    title: 'chartsAndStats.allTime',
  },
  oneMonth: {
    title: `${ '1 month'.replace(/ /g, '_').toLowerCase() }`,
    start: getStartDateInPast(1),
  },
  threeMonths: {
    title: `${ '3 months'.replace(/ /g, '_').toLowerCase() }`,
    start: getStartDateInPast(3),
  },
  sixMonths: {
    title: `${ '6 months'.replace(/ /g, '_').toLowerCase() }`,
    start: getStartDateInPast(6),
  },
  oneYear: {
    title: `${ '1 year'.replace(/ /g, '_').toLowerCase() }`,
    start: getStartDateInPast(12),
  },
};

function getStartDateInPast(months: number): Date {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date;
}
