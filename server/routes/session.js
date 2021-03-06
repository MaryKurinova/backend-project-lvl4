// @ts-check

import i18next from 'i18next';

const resource = '/session';

export default (app) => {
  app
    .get(`${resource}/new`, { name: 'new_Session' }, (req, reply) => {
      const signInForm = {};
      reply.render('session/new', { signInForm });
    })
    .post(resource, { name: 'session' }, app.fp.authenticate('form', async (req, reply, err, user) => {
      if (err) {
        return app.httpErrors.internalServerError(err);
      }
      if (!user) {
        const signInForm = req.body.data;
        const errors = {
          email: [{ message: i18next.t('flash.session.create.error') }],
        };
        return reply.render('session/new', { user: { ...signInForm }, errors });
      }
      await req.logIn(user);
      req.flash('success', i18next.t('flash.session.create.success'));
      return reply.redirect(app.reverse('root'));
    }))
    .delete(resource, (req, reply) => {
      req.logOut();
      req.flash('info', i18next.t('flash.session.delete.success'));
      reply.redirect(app.reverse('root'));
    });
};
