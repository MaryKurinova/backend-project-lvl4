/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

import faker from '@faker-js/faker';

export const getUser = () => ({
  email: faker.internet.email(),
  password: faker.internet.password(4),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
});

export const getLabel = () => ({
  name: faker.lorem.word(),
});

export const getStatus = () => ({
  name: faker.lorem.word(),
});

export const getTasks = () => ({
  name: faker.lorem.word(),
  description: faker.lorem.sentence(4),
  statusId: 1,
  creatorId: 1,
  executorId: 1,
});
