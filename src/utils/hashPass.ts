/* eslint-disable no-console */
import * as bcrypt from 'bcrypt';

export async function hashPass(password: string) {
  const saltRounds = 10;

  try {
    return await bcrypt.hash(password, saltRounds);
  } catch (err) {
    console.error(err);
  }

  return null;
}

export async function comparePass(password: string, hash: string) {
  try {
    return await bcrypt.compare(password, hash);
  } catch (err) {
    console.error(err);
  }

  return null;
}
