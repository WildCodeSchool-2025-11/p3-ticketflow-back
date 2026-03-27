declare module "express-fileupload" {
	interface UploadedFile {
		name: string;
		mv: (path: string) => Promise<void>;
		mimetype: string;
		size: number;
		data: Buffer;
	}

	interface FileArray {
		[key: string]: UploadedFile | UploadedFile[];
	}

	interface Options {
		createParentPath?: boolean;
		limits?: {
			fileSize?: number;
		};
	}

	function fileUpload(options?: Options): any;

	export = fileUpload;
}

declare namespace Express {
	export interface Request {
		files?: import("express-fileupload").FileArray;
	}
}
