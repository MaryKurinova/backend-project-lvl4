// @ts-check

import _ from 'lodash';
import getApp from '../server/index.js';
import encrypt from '../server/lib/secure.js';
import { getUser } from '../__fixtures__/entitiesData';
import signIn from './helpers';

describe('test users CRUD', () => {
  let app;
  let Model;
  let existUser;
  let cookies;

  beforeAll(async () => {
    app = await getApp();
    Model = app.objection.models.user;
  });

  beforeEach(async () => {
    await app.objection.knex.migrate.latest();
    const user = getUser();
    existUser = await Model.query().insert(user);

    cookies = await signIn(app, user);
  });

  it('GET users', async () => {
    const res = await app.inject({
      method: 'GET',
      url: app.reverse('users'),
    });

    expect(res.statusCode).toBe(200);
  });

  it('GET users/new', async () => {
    const res = await app.inject({
      method: 'GET',
      url: app.reverse('new_User'),
    });

    expect(res.statusCode).toBe(200);
  });

  it('create user', async () => {
    const newUserData = getUser();
    const res = await app.inject({
      method: 'POST',
      url: app.reverse('users'),
      payload: {
        data: newUserData,
      },
    });

    expect(res.statusCode).toBe(302);
    const expected = {
      ..._.omit(newUserData, 'password'),
      passwordDigest: encrypt(newUserData.password),
    };
    const newUser = await Model.query().findOne({ email: newUserData.email });
    expect(newUser).toMatchObject(expected);
  });

  it('edit user', async () => {
    const res = await app.inject({
      method: 'GET',
      url: app.reverse('edit_User', { id: existUser.id }),
      cookies,
    });
    expect(res.statusCode).toBe(200);
  });

  it('update user', async () => {
    const newUserData = {
      firstName: 'Alex',
      lastName: 'Alexov',
    };
    const res = await app.inject({
      method: 'PATCH',
      url: app.reverse('user', { id: existUser.id }),
      payload: {
        data: newUserData,
      },
      cookies,
    });

    expect(res.statusCode).toBe(302);

    const updateUserData = await Model.query().findOne({ id: existUser.id });
    expect(updateUserData).toMatchObject(newUserData);
  });

  it('delete user', async () => {
    const res = await app.inject({
      method: 'DELETE',
      url: app.reverse('user', { id: existUser.id }),
      cookies,
    });

    expect(res.statusCode).toBe(302);

    const remoteUser = await Model.query().findById(existUser.id);
    expect(remoteUser).toBeUndefined();
  });

  afterEach(async () => {
    // после каждого теста откатываем миграции
    await app.objection.knex.migrate.rollback();
  });

  afterAll(() => {
    app.close();
  });
});
