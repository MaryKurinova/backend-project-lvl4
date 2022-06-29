exports.up = (knex) => (
  knex.schema.alterTable('users', (table) => {
    table.string('first_name');
    table.string('last_name');
  })
);

exports.down = (knex) => (
  knex.schema.alterTable('users', (table) => {
    table.dropColumns('first_name', 'last_name');
  })
);
