import { writeFile } from "fs/promises";
import path from "path";

export async function uploadAvatar(file: File, userId: number) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.name.split(".").pop();
  const fileName = `avatar-${userId}.${ext}`;
  const filePath = path.join(process.cwd(), "public/avatars", fileName);

  await writeFile(filePath, buffer);
  return `/avatars/${fileName}`;
}
