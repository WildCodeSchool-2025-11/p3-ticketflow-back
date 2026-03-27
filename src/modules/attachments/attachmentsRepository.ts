import type { ResultSetHeader, RowDataPacket } from "mysql2";
import db from "../../database/client.js";

const create = async (url: string, filename: string, ticketId: number) => {
	const [result] = await db.query<ResultSetHeader>(
		"INSERT INTO attachments (url, filename, ticket_id) VALUES (?, ?, ?)",
		[url, filename, ticketId],
	);
	return result.insertId;
};

const findByTicketId = async (ticketId: number) => {
	const [rows] = await db.query<RowDataPacket[]>(
		"SELECT * FROM attachments WHERE ticket_id = ?",
		[ticketId],
	);
	return rows;
};

const destroy = async (id: number) => {
	const [result] = await db.query<ResultSetHeader>(
		"DELETE FROM attachments WHERE id = ?",
		[id],
	);
	return result.affectedRows > 0;
};

export default {
	create,
	findByTicketId,
	destroy,
};
