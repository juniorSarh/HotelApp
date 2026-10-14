import { query } from '../config/dbconfig';
import { User, CreateUserDTO, UpdateUserDTO } from '../usersTypes';

// Automatically creates the users table if it does not already exist
export const initUsersTable = async (): Promise<void> => {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
  await query(sql);
};

export const createUser = async (dto: CreateUserDTO): Promise<User> => {
  const sql = `
    INSERT INTO users (email, name)
    VALUES ($1, $2)
    RETURNING id, email, name, created_at AS "createdAt", updated_at AS "updatedAt";
  `;
  const { rows } = await query(sql, [dto.email, dto.name]);
  return rows[0];
};

export const getAllUsers = async (): Promise<User[]> => {
  const sql = `
    SELECT id, email, name, created_at AS "createdAt", updated_at AS "updatedAt"
    FROM users
    ORDER BY created_at DESC;
  `;
  const { rows } = await query(sql);
  return rows;
};

export const getUserById = async (id: string): Promise<User | null> => {
  const sql = `
    SELECT id, email, name, created_at AS "createdAt", updated_at AS "updatedAt"
    FROM users
    WHERE id = $1;
  `;
  const { rows } = await query(sql, [id]);
  return rows[0] || null;
};

export const updateUser = async (id: string, dto: UpdateUserDTO): Promise<User | null> => {
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (dto.email !== undefined) {
    fields.push(`email = $${paramIndex++}`);
    values.push(dto.email);
  }
  if (dto.name !== undefined) {
    fields.push(`name = $${paramIndex++}`);
    values.push(dto.name);
  }

  if (fields.length === 0) {
    return getUserById(id);
  }

  fields.push(`updated_at = NOW()`);
  values.push(id);

  const sql = `
    UPDATE users
    SET ${fields.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING id, email, name, created_at AS "createdAt", updated_at AS "updatedAt";
  `;

  const { rows } = await query(sql, values);
  return rows[0] || null;
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const sql = `DELETE FROM users WHERE id = $1;`;
  const result = await query(sql, [id]);
  return (result.rowCount ?? 0) > 0;
};