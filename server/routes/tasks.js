import i18next from 'i18next';
import { utilities, parceDate } from '../lib/utilities';

const resource = '/tasks';

export default (app) => {
  app
    .get(resource, { name: 'tasks', preValidation: app.authenticate }, async (req, reply) => {
      const filter = utilities(req.query);
      const currentUserId = req.user.id;
      const taskQuery = app.objection.models.task.query()
        .withGraphJoined('[status, creator, executor, labels]')
        .modify('filterExecutorId', filter.executor)
        .modify('filterLabels', filter.label)
        .modify('filterStatusId', filter.status)
        .modify('filterCreatorId', filter.creatorId);

      const [tasks, users, statuses, labels] = await Promise.all([
        taskQuery,
        app.objection.models.user.query(),
        app.objection.models.status.query(),
        app.objection.models.label.query(),
      ]);
      reply.render('tasks/index', {
        tasks, statuses, users, labels, currentUserId, filter,
      });
      return reply;
    })
    .get(`${resource}/new`, { name: 'new_task', preValidation: app.authenticate }, async (req, reply) => {
      const task = new app.objection.models.task();
      const [users, statuses, labels] = await Promise.all([
        app.objection.models.user.query(),
        app.objection.models.status.query(),
        app.objection.models.label.query(),
      ]);
      reply.render('tasks/new', {
        task, users, statuses, labels,
      });
      return reply;
    })
    .get(`${resource}/:id`, { name: 'task', preValidation: app.authenticate }, async (req, reply) => {
      const taskId = req.params.id;
      const task = await app.objection.models.task.query().findById(taskId)
        .withGraphJoined('[status, creator, executor, labels]');
      reply.render('tasks/view', { task });
      return reply;
    })
    .get(`${resource}/:id/edit`, { name: 'edit_task', preValidation: app.authenticate }, async (req, reply) => {
      const taskId = req.params.id;
      const [task, users, statuses, labels] = await Promise.all([
        app.objection.models.task.query().findById(taskId).withGraphJoined('[status, creator, executor, labels]'),
        app.objection.models.user.query(),
        app.objection.models.status.query(),
        app.objection.models.label.query(),
      ]);
      reply.render('tasks/edit', {
        task, users, statuses, labels,
      });
      return reply;
    })
    .post(resource, { preValidation: app.authenticate }, async (req, reply) => {
      const labelIds = req.body.data.labels || [];
      const creatorId = req.user.id;
      const data = { ...parceDate(req.body.data), creatorId };
      try {
        const newTask = await app.objection.models.task.fromJson(data);
        await app.objection.models.task.transaction(async (trx) => {
          const taskLabels = await app.objection.models.label.query(trx).findByIds(labelIds);
          await app.objection.models.task.query(trx).allowGraph('labels').insertGraph([{
            ...newTask, labels: taskLabels,
          }], { relate: true });
        });
        req.flash('info', i18next.t('flash.tasks.create.success'));
        reply.redirect(app.reverse('tasks'));
        return reply;
      } catch (err) {
        req.flash('error', i18next.t('flash.tasks.create.error'));
        const task = new app.objection.models.task().$set(data);
        const [users, statuses, labels] = await Promise.all([
          app.objection.models.user.query(),
          app.objection.models.status.query(),
          app.objection.models.label.query(),
        ]);
        task.labelIds = labelIds;

        reply.render('tasks/new', {
          task, users, statuses, labels, errors: err.data,
        });
        return reply;
      }
    })
    .patch(`${resource}/:id`, { preValidation: app.authenticate }, async (req, reply) => {
      const labelIds = req.body.data.labels ?? [];
      const data = parceDate(req.body.data);
      const taskId = Number(req.params.id);
      try {
        const taskData = await app.objection.models.task.fromJson(data);
        const newData = { ...taskData, id: taskId };
        await app.objection.models.task.transaction(async (trx) => {
          const taskLabels = await app.objection.models.label.query(trx).findByIds(labelIds);
          await app.objection.models.task.query(trx)
            .upsertGraph({ ...newData, labels: taskLabels }, { relate: true, unrelate: true, noUpdate: ['labels'] });
        });
        req.flash('info', i18next.t('flash.tasks.edit.success'));
        reply.redirect(app.reverse('tasks'));
        return reply;
      } catch (err) {
        req.flash('error', i18next.t('flash.tasks.edit.error'));
        const oldTask = await app.objection.models.task.query().findById(taskId);
        const task = new app.objection.models.task().$set({ ...oldTask, ...data });
        const [users, statuses, labels] = await Promise.all([ // eslint-disable-line
          app.objection.models.user.query(),
          app.objection.models.status.query(),
          app.objection.models.label.query(),
        ]);
        reply.render('tasks/edit', {
          task,
          users,
          statuses,
          labels,
          errors: err.data,
        });
        return reply;
      }
    })
    .delete(`${resource}/:id`, { preValidation: app.authenticate }, async (req, reply) => {
      const taskId = Number(req.params.id);
      const userId = req.user.id;
      try {
        const taskToDelete = await app.objection.models.task.query().findById(taskId);
        if (taskToDelete.creatorId !== userId) {
          req.flash('error', i18next.t('flash.tasks.accessDenied'));
        } else {
          await app.objection.models.task.transaction(async (trx) => {
            const task = await app.objection.models.task.query(trx).findById(taskId);
            await task.$relatedQuery('labels', trx).unrelate().where({ taskId });
            await task.$query(trx).delete();
          });
          req.flash('info', i18next.t('flash.tasks.delete.success'));
        }
        reply.redirect(app.reverse('tasks'));
        return reply;
      } catch (err) {
        req.flash('error', i18next.t('flash.tasks.delete.error'));
        reply.redirect(app.reverse('tasks'));
        return reply;
      }
    });
};
