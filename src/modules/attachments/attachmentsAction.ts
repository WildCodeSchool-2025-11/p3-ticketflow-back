import path from "node:path";
import type { Request, Response } from "express";
import type fileUpload from "express-fileupload"; // ✔️ import correct
import type { RowDataPacket } from "mysql2";
import db from "../../database/client.js";
import attachmentsRepository from "./attachmentsRepository.js";

// ✔️ on récupère le type UploadedFile depuis l'export par défaut
type UploadedFile = ReturnType<typeof fileUpload>["UploadedFile"];

export const create = async (req: Request, res: Response) => {
	try {
		const ticketId = Number(req.params.id);

		const [rows] = await db.query<RowDataPacket[]>(
			"SELECT id FROM tickets WHERE id = ?",
			[ticketId],
		);
		const ticket = rows[0];

		if (!ticket) {
			return res.status(404).json({ error: "Ticket not found" });
		}

		if (!req.files || !req.files.file) {
			return res.status(400).json({ error: "No file uploaded" });
		}

		const file = req.files.file as UploadedFile;

		const filename = `${Date.now()}-${file.name}`;
		const uploadPath = path.join("uploads", filename);

		await file.mv(uploadPath);

		const url = `${req.protocol}://${req.get("host")}/uploads/${filename}`;

		const id = await attachmentsRepository.create(url, filename, ticketId);

		return res.status(201).json({ id, url, filename, ticketId });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const findByTicketId = async (req: Request, res: Response) => {
	try {
		const ticketId = Number(req.params.id);
		const attachments = await attachmentsRepository.findByTicketId(ticketId);
		return res.status(200).json(attachments);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const destroy = async (req: Request, res: Response) => {
	try {
		const id = Number(req.params.id);

		const deleted = await attachmentsRepository.destroy(id);

		if (!deleted) {
			return res.status(404).json({ error: "Attachment not found" });
		}

		return res.status(200).json({ message: "Attachment deleted" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal server error" });
	}
};
