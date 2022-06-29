// @ts-check

exports.up = (knex) => (
  knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email').unique();
    table.string('password_digest');
    table.timestamps(true, true);
  })
);

exports.down = (knex) => knex.schema.dropTable('users');
