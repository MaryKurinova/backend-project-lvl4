// @ts-check

import getApp from '../server/index.js';
import { getUser } from '../__fixtures__/entitiesData';
import signIn from './helpers';

describe('test session', () => {
  let app;
  let user;

  beforeAll(async () => {
    app = await getApp();
    await app.objection.knex.migrate.latest();
    user = getUser();
    await app.objection.models.user.query().insert(user);
  });

  it('GET /session/new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('new_Session'),
    });
    expect(response.statusCode).toBe(200);
  });

  it('POST /session', async () => {
    const responseSignIn = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: {
        data: user,
      },
    });

    expect(responseSignIn.statusCode).toBe(302);
  });

  it('DELETE /session', async () => {
    const cookie = await signIn(app, user);
    const responseSignOut = await app.inject({
      method: 'DELETE',
      url: app.reverse('session'),
      // используем полученные ранее куки
      cookies: cookie,
    });

    expect(responseSignOut.statusCode).toBe(302);
  });

  afterAll(async () => {
    await app.objection.knex.migrate.rollback();
    app.close();
  });
});
