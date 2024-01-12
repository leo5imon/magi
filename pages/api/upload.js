import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { IncomingForm } from "formidable";
import { promises as fs } from "fs";
import { toast } from "sonner";
import Typesense from "typesense";
import Replicate from "replicate";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const data = await new Promise((resolve, reject) => {
      const form = new IncomingForm();
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    if (!data.files || !data.files.files) {
      return res.status(400).send("No files uploaded.");
    }

    const s3 = new S3Client({
      credentials: {
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      },
      region: process.env.AWS_REGION,
    });

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const typesense = new Typesense.Client({
      nodes: [
        {
          host: "syon750ckh8ezfrjp-1.a1.typesense.net",
          port: 443,
          protocol: "https",
        },
      ],
      apiKey: process.env.TYPESENSE_API_KEY,
      connectionTimeoutSeconds: 10,
    });

    for (const file of data.files.files) {
      const fileContent = await fs.readFile(file.filepath);

      const now = new Date();
      const dateTime = now.toISOString().replace(/[^0-9]/g, "");
      const params = {
        Bucket: "image-tag",
        Key: `${dateTime}-${file.originalFilename}`,
        Body: fileContent,
      };

      try {
        const putObjectCommand = new PutObjectCommand(params);
        const response = await s3.send(putObjectCommand);
        const Location = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;

        const tags = await replicate.run(
          "yorickvp/llava-13b:e272157381e2a3bf12df3a8edd1f38d1dbd736bbb7437277c8b34175f8fce358",
          {
            input: {
              image: Location,
              prompt:
                "I'm creating an image search engine. Give me specific tags for the color, content, type, mood & text. I want to have 1, 2 or 3 tags for the first 4, and then all the text you can get for the last one.",
              top_p: 1,
              max_tokens: 200,
              temperature: 0.01,
            },
          }
        );

        const newImage = {
          images_url: Location,
          images_tag: tags,
        };

        const documentRef = await typesense
          .collections("images")
          .documents()
          .create(newImage);

        res.status(200).json({
          message: "File uploaded successfully!",
          url: Location,
          shouldRefresh: true,
        });
      } catch (error) {
        res.status(500).json({ error: "Error uploading file" });
        return;
      }
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
