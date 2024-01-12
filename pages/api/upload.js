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
          host: "syon750ckh8ezfrjp-1.a1.typesense.net", // For Typesense Cloud use xxx.a1.typesense.net
          port: 443, // For Typesense Cloud use 443
          protocol: "https", // For Typesense Cloud use https
        },
      ],
      apiKey: process.env.TYPESENSE_API_KEY,
      connectionTimeoutSeconds: 2,
    });
    // Upload the file to S3
    for (const file of data.files.files) {
      const fileContent = await fs.readFile(file.filepath);

      const now = new Date();
      const dateTime = now.toISOString().replace(/[^0-9]/g, ""); // Replaces non-numeric characters
      const params = {
        Bucket: "image-tag", // Replace with your bucket name
        Key: `${dateTime}-${file.originalFilename}`, // File name you want to save as
        Body: fileContent,
      };

      try {
        const putObjectCommand = new PutObjectCommand(params);
        const response = await s3.send(putObjectCommand);
        const Location = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
        res
          .status(200)
          .json({ message: "File uploaded successfully!", url: Location });
        const tags = await replicate.run(
          "yorickvp/llava-13b:e272157381e2a3bf12df3a8edd1f38d1dbd736bbb7437277c8b34175f8fce358",
          {
            input: {
              image: Location,
              prompt:
                "Label this image. It can describe the color of the image, the content of the image, the type of the image, the mood of it and text written on it.",
              top_p: 1,
              max_tokens: 512,
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
        toast("Image added.");
        console.log("Image added with ID: ", documentRef.id);
      } catch (error) {
        toast("Oops, something went wrong.");
        res.status(500).json({ error: "Error uploading a file" });
        return;
      }
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
    toast("Oops, something went wrong.");
  }
}