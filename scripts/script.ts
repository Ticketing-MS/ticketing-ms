import { db } from 'db';
import { users } from 'db/schema';

async function testUsers() {
  const allUsers = await db.select().from(users);
  console.log('All Users:', allUsers);
}

testUsers();