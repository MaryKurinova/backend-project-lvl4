exports.up = (knex) => (
  knex.schema.createTable('tasks', (table) => {
    table.increments('id').primary();
    table.string('name').unique();
    table.text('description');
    table
      .integer('status_id')
      .unsigned()
      .references('statuses.id')
      .index()
      .onDelete('SET NULL');
    table
      .integer('executor_id')
      .unsigned()
      .references('users.id')
      .index()
      .onDelete('SET NULL');
    table
      .integer('creator_id')
      .unsigned()
      .references('users.id')
      .index()
      .onDelete('SET NULL');
    table.timestamps(true, true);
  })
);

exports.down = (knex) => knex.schema.dropTable('tasks');
