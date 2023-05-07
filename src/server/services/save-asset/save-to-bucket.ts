import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

const client = new S3Client({
  region: 'eu-west-2',
});

export async function saveToBucket(path: string, data: Buffer) {
  const params = {
    Bucket: process.env.BUCKET,
    Key: path.startsWith('/') ? path.replace('/', '') : path,
    Body: data,
  };
  await client.send(new PutObjectCommand(params));
}
