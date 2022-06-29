import i18next from 'i18next';

const resource = '/labels';

export default (app) => {
  app
    .get(resource, { name: 'labels', preValidation: app.authenticate }, async (req, reply) => {
      const labels = await app.objection.models.label.query();
      reply.render('labels/index', { labels });
      return reply;
    })
    .get(`${resource}/new`, { name: 'new_label', preValidation: app.authenticate }, async (req, reply) => {
      const label = new app.objection.models.label();
      reply.render('labels/new', { label });
    })
    .get(`${resource}/:id/edit`, { name: 'edit_label', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const label = await app.objection.models.label.query().findById(id);
      reply.render('labels/edit', { label });
      return reply;
    })
    .post(resource, { preValidation: app.authenticate }, async (req, reply) => {
      try {
        const label = await app.objection.models.label.fromJson(req.body.data);
        await app.objection.models.label.query().insert(label);
        req.flash('info', i18next.t('flash.labels.create.success'));
        reply.redirect(app.reverse('labels'));
        return reply;
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.labels.create.error'));
        reply.render('labels/new', { label: req.body.data, errors: data });
        return reply;
      }
    })
    .patch(`${resource}/:id`, { name: 'label', preValidation: app.authenticate }, async (req, reply) => {
      let labelToUpdate;
      try {
        labelToUpdate = await app.objection.models.label.query().findById(req.params.id);
        await labelToUpdate.$query().update(req.body.data);
        req.flash('info', i18next.t('flash.labels.edit.success'));
        reply.redirect(app.reverse('labels'));
        return reply;
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.labels.edit.error'));
        reply.render('labels/edit', { label: { ...labelToUpdate, ...req.body.data }, errors: data });
        return reply;
      }
    })
    .delete(`${resource}/:id`, { preValidation: app.authenticate }, async (req, reply) => {
      try {
        const { id } = req.params;
        const label = await app.objection.models.label.query().findById(id);
        const tasksWithLabel = await label.$relatedQuery('labels');
        if (tasksWithLabel.length > 0) {
          req.flash('error', i18next.t('flash.labels.delete.error'));
        } else {
          await label.$query().delete();
          req.flash('info', i18next.t('flash.labels.delete.success'));
        }
        reply.redirect(app.reverse('labels'));
        return reply;
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.labels.delete.error'));
        reply.redirect(app.reverse('labels'));
        return reply;
      }
    });
};
