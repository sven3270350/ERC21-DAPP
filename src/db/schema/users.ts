import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
 
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email'),
  name: varchar('name'),
  address: varchar('address')
});