exports.up = (knex) => (
  knex.schema.createTable('tasks_labels', (table) => {
    table
      .integer('label_id')
      .unsigned()
      .references('labels.id')
      .onDelete('CASCADE');
    table
      .integer('task_id')
      .unsigned()
      .references('tasks.id')
      .onDelete('CASCADE');
    table.primary(['label_id', 'task_id']);
    table.index(['task_id', 'label_id']);
  })
);

exports.down = (knex) => knex.schema.dropTable('tasks_labels');
