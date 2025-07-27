import { NextRequest, NextResponse } from "next/server";
import cloudinary from "db/cloudinary";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const maxSize = 2 * 1024 * 1024; // 2MB
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: "Format gambar tidak didukung (hanya JPG, PNG, WEBP)" },
      { status: 400 }
    );
  }

  if (file.size > maxSize) {
    return NextResponse.json(
      { error: "Ukuran gambar maksimal 2MB" },
      { status: 400 }
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "avatars",
            transformation: [{ width: 500, height: 500, crop: "limit" }],
          },
          (err, res) => {
            if (err || !res) return reject(err);
            resolve(res);
          }
        )
        .end(buffer);
    });

    // @ts-ignore
    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error("Upload failed", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
