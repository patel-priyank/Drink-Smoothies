import { Request, Response } from 'express';

import { sql } from '../db/db';

export const getSmoothies = async (req: Request, res: Response): Promise<void> => {
  const { orderBy = 'created_at', ascending = 'false' } = req.query as Record<string, string>;

  const allowedCols = ['created_at', 'title', 'rating'];

  const col = allowedCols.includes(orderBy) ? orderBy : 'created_at';
  const dir = ascending === 'true' ? 'ASC' : 'DESC';

  const rows = await sql.query(`SELECT * FROM smoothies ORDER BY ${col} ${dir}`);

  res.json(rows);
};

export const getSmoothie = async (req: Request, res: Response): Promise<void> => {
  const rows = await sql.query('SELECT * FROM smoothies WHERE id = $1', [req.params.id]);

  if (!rows.length) {
    res.status(404).json({ error: 'Not found.' });
    return;
  }

  res.json(rows[0]);
};

export const createSmoothie = async (req: Request, res: Response): Promise<void> => {
  const { title, method, rating } = req.body;

  const rows = await sql.query('INSERT INTO smoothies (title, method, rating) VALUES ($1, $2, $3) RETURNING *', [
    title,
    method,
    rating
  ]);

  res.status(201).json(rows[0]);
};

export const updateSmoothie = async (req: Request, res: Response): Promise<void> => {
  const { title, method, rating } = req.body;

  const rows = await sql.query('UPDATE smoothies SET title=$1, method=$2, rating=$3 WHERE id=$4 RETURNING *', [
    title,
    method,
    rating,
    req.params.id
  ]);

  if (!rows.length) {
    res.status(404).json({ error: 'Not found.' });
    return;
  }

  res.json(rows[0]);
};

export const deleteSmoothie = async (req: Request, res: Response): Promise<void> => {
  const rows = await sql.query('DELETE FROM smoothies WHERE id=$1 RETURNING *', [req.params.id]);

  if (!rows.length) {
    res.status(404).json({ error: 'Not found.' });
    return;
  }

  res.json(rows[0]);
};
