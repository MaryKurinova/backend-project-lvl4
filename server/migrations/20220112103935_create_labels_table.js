exports.up = (knex) => (
  knex.schema.createTable('labels', (table) => {
    table.increments('id').primary();
    table.string('name', 255).unique();
    table.timestamps(true, true);
  })
);

exports.down = (knex) => knex.schema.dropTable('labels');
