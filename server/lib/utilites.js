import _ from 'lodash';

export const parceDate = (data) => ({
  ...data,
  statusId: _.toNumber(data.statusId) || null,
  creatorId: _.toNumber(data.creatorId) || null,
  executorId: _.toNumber(data.executorId) || null,
});

export const utilities = (query) => Object.keys(query)
  .reduce((acc, key) => {
    const queryValue = query[key];
    if (!queryValue || queryValue === 'null') return acc;
    return { ...acc, [key]: queryValue };
  }, {});
