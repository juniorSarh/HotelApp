import db from '../config/dbconfig'
import { User, CreateUserDTO, UpdateUserDTO } from '../usersTypes'

export const createUser = async (dto: CreateUserDTO): Promise<User> => {
  const query = `
    INSERT INTO users (email, name)
    VALUES ($1, $2)
    RETURNING id, email, name, created_at AS "createdAt", updated_at AS "updatedAt";
  `;
  const { rows } = await db.query(query, [dto.email, dto.name]);
  return rows[0];
};

export const getAllUsers = async (): Promise<User[]> => {
  const query = `
    SELECT id, email, name, created_at AS "createdAt", updated_at AS "updatedAt"
    FROM users
    ORDER BY created_at DESC;
  `;
  const { rows } = await db.query(query);
  return rows;
};

export const getUserById = async (id: string): Promise<User | null> => {
  const query = `
    SELECT id, email, name, created_at AS "createdAt", updated_at AS "updatedAt"
    FROM users
    WHERE id = $1;
  `;
  const { rows } = await db.query(query, [id]);
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

  const query = `
    UPDATE users
    SET ${fields.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING id, email, name, created_at AS "createdAt", updated_at AS "updatedAt";
  `;

  const { rows } = await db.query(query, values);
  return rows[0] || null;
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const query = `DELETE FROM users WHERE id = $1;`;
  const result = await db.query(query, [id]);
  return (result.rowCount ?? 0) > 0;
};