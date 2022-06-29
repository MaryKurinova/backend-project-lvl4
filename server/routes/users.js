// @ts-check

import i18next from 'i18next';

const resource = '/users';

export default (app) => {
  app
    .get(resource, { name: 'users' }, async (req, reply) => {
      const users = await app.objection.models.user.query();
      reply.render('users/index', { users });
      return reply;
    })
    .get(`${resource}/new`, { name: 'new_User' }, (req, reply) => {
      const user = new app.objection.models.user();
      reply.render('users/new', { user });
    })
    .get(`${resource}/:id/edit`, { name: 'edit_User', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      if (req.user.id !== Number(id)) {
        req.flash('error', i18next.t('flash.users.accessDenied'));
        reply.redirect(app.reverse('users'));
        return reply;
      }
      const user = await app.objection.models.user.query().findById(id);
      reply.render('users/edit', { user });
      return reply;
    })
    .post(resource, async (req, reply) => {
      try {
        const user = await app.objection.models.user.fromJson(req.body.data);
        await app.objection.models.user.query().insert(user);
        req.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect(app.reverse('root'));
      } catch (err) {
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.render('users/new', { user: req.body.data, errors: err.data });
      }
      return reply;
    })
    .patch(`${resource}/:id`, { name: 'user', preValidation: app.authenticate }, async (req, reply) => {
      let userToUpdate;
      try {
        const { id } = req.params;
        if (req.user.id !== Number(id)) {
          req.flash('error', i18next.t('flash.users.accessDenied'));
          reply.redirect(app.reverse('users'));
          return reply;
        }
        userToUpdate = await app.objection.models.user.query().findById(id);
        await userToUpdate.$query().patch(req.body.data);
        req.flash('info', i18next.t('flash.users.edit.success'));
        reply.redirect(app.reverse('users'));
        return reply;
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.edit.error'));
        reply.render('users/edit', { user: { ...userToUpdate, ...req.body.data }, errors: data });
        return reply;
      }
    })
    .delete(`${resource}/:id`, { preValidation: app.authenticate }, async (req, reply) => {
      try {
        const { id } = req.params;
        const user = await app.objection.models.user.query().findById(id);
        const userTask = await user.$relatedQuery('creatorTasks');
        if (req.user.id !== Number(id)) {
          req.flash('error', i18next.t('flash.users.accessDenied'));
        } else if (userTask.length > 0) {
          req.flash('error', i18next.t('flash.users.delete.error'));
        } else {
          req.logOut();
          await user.$query().delete();
          req.flash('info', i18next.t('flash.users.delete.success'));
        }
        reply.redirect(app.reverse('users'));
        return reply;
      } catch (err) {
        req.flash('error', i18next.t('flash.users.delete.error'));
        reply.redirect(app.reverse('users'));
        return reply;
      }
    });
};
