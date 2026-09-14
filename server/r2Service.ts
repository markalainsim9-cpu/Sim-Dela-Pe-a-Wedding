import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicUrl: string;
}

export function getR2Config(): R2Config | null {
  const accountId = (process.env.CLOUDFLARE_R2_ACCOUNT_ID || process.env.R2_ACCOUNT_ID || '').trim();
  const accessKeyId = (process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID || '').trim();
  const secretAccessKey = (process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY || '').trim();
  const bucketName = (process.env.CLOUDFLARE_R2_BUCKET_NAME || process.env.R2_BUCKET_NAME || '').trim();
  let publicUrl = (process.env.CLOUDFLARE_R2_PUBLIC_URL || process.env.R2_PUBLIC_URL || '').trim();

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    return null;
  }

  if (publicUrl.endsWith('/')) {
    publicUrl = publicUrl.slice(0, -1);
  }

  return {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucketName,
    publicUrl,
  };
}

let cachedS3Client: S3Client | null = null;
let cachedClientKey: string = '';

export function getR2Client(): { client: S3Client; config: R2Config } {
  const config = getR2Config();
  if (!config) {
    throw new Error(
      'Cloudflare R2 is not configured. Please define CLOUDFLARE_R2_ACCOUNT_ID, CLOUDFLARE_R2_ACCESS_KEY_ID, CLOUDFLARE_R2_SECRET_ACCESS_KEY, and CLOUDFLARE_R2_BUCKET_NAME.'
    );
  }

  const key = `${config.accountId}:${config.accessKeyId}`;
  if (!cachedS3Client || cachedClientKey !== key) {
    cachedS3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
    cachedClientKey = key;
  }

  return { client: cachedS3Client, config };
}

export function getR2Status(): {
  configured: boolean;
  bucketName?: string;
  publicUrl?: string;
  accountIdMasked?: string;
} {
  const config = getR2Config();
  if (!config) {
    return { configured: false };
  }
  const acc = config.accountId;
  const masked = acc.length > 6 ? `${acc.slice(0, 3)}••••${acc.slice(-3)}` : '••••••';
  return {
    configured: true,
    bucketName: config.bucketName,
    publicUrl: config.publicUrl || undefined,
    accountIdMasked: masked,
  };
}

export async function createR2PresignedUploadUrl(options: {
  fileName: string;
  contentType: string;
  folder?: string;
}) {
  const { client, config } = getR2Client();
  const ext = options.fileName.split('.').pop()?.toLowerCase() || 'mp4';
  const cleanBaseName = options.fileName
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 30);
  const folder = options.folder ? options.folder.replace(/^\/+|\/+$/g, '') : 'guestbook-videos';
  const objectKey = `${folder}/${Date.now()}_${cleanBaseName || 'video'}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: config.bucketName,
    Key: objectKey,
    ContentType: options.contentType,
  });

  // Presigned URL valid for 1 hour
  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 3600 });
  const publicUrl = config.publicUrl
    ? `${config.publicUrl}/${objectKey}`
    : `https://${config.bucketName}.${config.accountId}.r2.cloudflarestorage.com/${objectKey}`;

  return {
    uploadUrl,
    publicUrl,
    objectKey,
  };
}

export async function uploadBufferToR2(options: {
  buffer: Buffer;
  fileName: string;
  contentType: string;
  folder?: string;
}) {
  const { client, config } = getR2Client();
  const ext = options.fileName.split('.').pop()?.toLowerCase() || 'mp4';
  const cleanBaseName = options.fileName
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 30);
  const folder = options.folder ? options.folder.replace(/^\/+|\/+$/g, '') : 'guestbook-videos';
  const objectKey = `${folder}/${Date.now()}_${cleanBaseName || 'video'}.${ext}`;

  await client.send(
    new PutObjectCommand({
      Bucket: config.bucketName,
      Key: objectKey,
      Body: options.buffer,
      ContentType: options.contentType,
    })
  );

  const publicUrl = config.publicUrl
    ? `${config.publicUrl}/${objectKey}`
    : `https://${config.bucketName}.${config.accountId}.r2.cloudflarestorage.com/${objectKey}`;

  return {
    publicUrl,
    objectKey,
  };
}

export async function testR2Connection(): Promise<{
  success: boolean;
  message: string;
  bucketName?: string;
  details?: any;
}> {
  try {
    const { client, config } = getR2Client();
    // Test bucket access by listing up to 1 key
    const command = new ListObjectsV2Command({
      Bucket: config.bucketName,
      MaxKeys: 1,
    });
    await client.send(command);
    return {
      success: true,
      message: `✓ Cloudflare R2 connection successful! Bucket "${config.bucketName}" is accessible.`,
      bucketName: config.bucketName,
    };
  } catch (err: any) {
    console.error('R2 test error:', err);
    return {
      success: false,
      message: err.message || 'Failed to connect to Cloudflare R2 bucket.',
      details: err.name || 'R2ConnectionError',
    };
  }
}

/**
 * Robustly extracts the object key from a Cloudflare R2 URL or object path.
 * Handles:
 * - Direct public URLs: https://pub-xxx.r2.dev/guestbook-videos/123_video.mp4 -> guestbook-videos/123_video.mp4
 * - S3/R2 endpoints: https://bucket.account.r2.cloudflarestorage.com/guestbook-videos/123_video.mp4 -> guestbook-videos/123_video.mp4
 * - Custom domain URLs: https://media.example.com/guestbook-videos/123_video.mp4 -> guestbook-videos/123_video.mp4
 * - Object keys: "guestbook-videos/123_video.mp4" or "/guestbook-videos/123_video.mp4"
 */
export function extractR2ObjectKey(urlOrKey: string): string | null {
  if (!urlOrKey || typeof urlOrKey !== 'string') return null;
  let trimmed = urlOrKey.trim();
  if (!trimmed || trimmed.startsWith('blob:') || trimmed.startsWith('data:')) {
    return null;
  }

  // Strip query parameters and fragment identifier
  trimmed = trimmed.split('?')[0].split('#')[0];

  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return trimmed.replace(/^\/+/, '') || null;
  }

  try {
    const parsed = new URL(trimmed);
    let key = decodeURIComponent(parsed.pathname).replace(/^\/+/, '');

    const config = getR2Config();
    if (config?.publicUrl) {
      try {
        const publicBase = new URL(config.publicUrl);
        const basePath = decodeURIComponent(publicBase.pathname).replace(/^\/+|\/+$/g, '');
        if (basePath && key.startsWith(basePath + '/')) {
          key = key.slice(basePath.length + 1);
        }
      } catch {
        // ignore
      }
    }

    return key || null;
  } catch {
    return null;
  }
}

/**
 * Permanently deletes an object from the Cloudflare R2 bucket.
 * Accepts either the full public URL or the object key.
 */
export async function deleteObjectFromR2(objectKeyOrUrl: string): Promise<{
  success: boolean;
  objectKey?: string;
  message?: string;
}> {
  const config = getR2Config();
  if (!config) {
    return {
      success: false,
      message: 'Cloudflare R2 is not configured on this server.',
    };
  }

  const objectKey = extractR2ObjectKey(objectKeyOrUrl);
  if (!objectKey) {
    return {
      success: false,
      message: 'Invalid object key or URL provided for Cloudflare R2 deletion.',
    };
  }

  try {
    const { client } = getR2Client();
    const command = new DeleteObjectCommand({
      Bucket: config.bucketName,
      Key: objectKey,
    });

    await client.send(command);
    console.log(`[Cloudflare R2] Successfully deleted object "${objectKey}" from bucket "${config.bucketName}"`);
    return {
      success: true,
      objectKey,
      message: `Object "${objectKey}" was deleted from Cloudflare R2 bucket "${config.bucketName}".`,
    };
  } catch (err: any) {
    console.error(`[Cloudflare R2] Failed to delete object "${objectKey}":`, err);
    return {
      success: false,
      objectKey,
      message: err.message || 'Failed to delete object from Cloudflare R2.',
    };
  }
}


