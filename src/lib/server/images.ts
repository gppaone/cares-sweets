import sharp from 'sharp';
import { randomUUID } from 'node:crypto';
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { env } from '$env/dynamic/private';

const NAME_RE = /^[0-9a-f-]{36}\.webp$/;
const MAX_BYTES = 15 * 1024 * 1024;
const FORMATS = new Set(['jpeg', 'png', 'webp', 'gif', 'avif']);

const uploadDir = () => path.resolve(env.UPLOAD_DIR || './uploads');

/**
 * Validates an uploaded photo, fixes phone rotation, shrinks it to `maxWidth`,
 * converts it to WebP and stores it. Returns the stored file name.
 * Throws an Error with a message that is safe to show in the admin.
 */
export async function saveUpload(file: File, maxWidth: number): Promise<string> {
	if (file.size > MAX_BYTES) throw new Error('That photo is larger than 15 MB.');

	const input = Buffer.from(await file.arrayBuffer());
	let output: Buffer;
	try {
		const meta = await sharp(input).metadata();
		if (!meta.format || !FORMATS.has(meta.format)) throw new Error('unsupported');
		output = await sharp(input)
			.rotate() // apply EXIF orientation, then EXIF is dropped on output
			.resize({ width: maxWidth, withoutEnlargement: true })
			.webp({ quality: 80 })
			.toBuffer();
	} catch {
		throw new Error('That file is not a supported image. Use a JPG, PNG, WebP or GIF.');
	}

	await mkdir(uploadDir(), { recursive: true });
	const name = `${randomUUID()}.webp`;
	await writeFile(path.join(uploadDir(), name), output);
	return name;
}

export async function removeFile(name: string): Promise<void> {
	if (!NAME_RE.test(name)) return;
	await unlink(path.join(uploadDir(), name)).catch(() => {});
}

export async function readUpload(name: string): Promise<Buffer | null> {
	if (!NAME_RE.test(name)) return null;
	return readFile(path.join(uploadDir(), name)).catch(() => null);
}
