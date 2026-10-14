import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/usersServices'

// CREATE
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      res.status(400).json({ error: 'Email and name are required' });
      return;
    }

    const newUser = await userService.createUser({ email, name });
    res.status(201).json(newUser);
  } catch (error: any) {
    if (error.code === '23505') { // Postgres unique constraint violation
      res.status(409).json({ error: 'Email already exists' });
      return;
    }
    next(error);
  }
};

// READ ALL
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// READ ONE
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id as string);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// UPDATE
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { email, name } = req.body;

    const updatedUser = await userService.updateUser(id as string, { email, name });

    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// DELETE
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await userService.deleteUser(id as string);

    if (!deleted) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};