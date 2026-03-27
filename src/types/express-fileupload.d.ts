declare module "express-fileupload" {
	export interface UploadedFile {
		name: string;
		mv: (path: string) => Promise<void>;
		mimetype: string;
		size: number;
		data: Buffer;
	}
}

declare namespace Express {
	export interface Request {
		files?: {
			[key: string]:
				| import("express-fileupload").UploadedFile
				| import("express-fileupload").UploadedFile[];
		};
	}
}
