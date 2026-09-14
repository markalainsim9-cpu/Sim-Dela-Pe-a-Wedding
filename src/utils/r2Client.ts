export interface R2StatusResponse {
  success: boolean;
  configured: boolean;
  bucketName?: string;
  publicUrl?: string;
  accountIdMasked?: string;
  error?: string;
}

export interface VideoUploadResult {
  success: boolean;
  publicUrl: string;
  objectKey?: string;
  isLocalPreview?: boolean;
  error?: string;
}

/**
 * Checks if Cloudflare R2 storage credentials are configured on the backend.
 */
export async function checkR2Status(): Promise<R2StatusResponse> {
  try {
    const res = await fetch('/api/r2/status');
    if (!res.ok) {
      return { success: false, configured: false };
    }
    const data = await res.json();
    return data;
  } catch (err: any) {
    console.warn('Check R2 status error:', err);
    return { success: false, configured: false };
  }
}

/**
 * Uploads a video file or blob to Cloudflare R2 with progress tracking.
 * Falls back to direct server proxy upload if direct CORS upload encounters any network limitation.
 */
export async function uploadVideoToR2(
  fileOrBlob: File | Blob,
  fileName?: string,
  onProgress?: (percent: number) => void
): Promise<VideoUploadResult> {
  const resolvedFileName = fileName || (fileOrBlob instanceof File ? fileOrBlob.name : `video_${Date.now()}.mp4`);
  const contentType = fileOrBlob.type || 'video/mp4';

  // 1. Check if R2 is configured on backend
  const status = await checkR2Status();

  if (!status.configured) {
    // If not configured yet, generate a local object URL so the user can still test & preview
    const localUrl = URL.createObjectURL(fileOrBlob);
    return {
      success: true,
      publicUrl: localUrl,
      isLocalPreview: true,
      error: 'Cloudflare R2 is not configured in .env yet. Displaying local preview.',
    };
  }

  // 2. Request a Presigned Upload URL for high-performance direct upload
  try {
    const presignedRes = await fetch('/api/r2/presigned-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: resolvedFileName,
        contentType,
        folder: 'guestbook-videos',
      }),
    });

    if (presignedRes.ok) {
      const presignedData = await presignedRes.json();
      if (presignedData.uploadUrl) {
        // Attempt direct upload via XMLHttpRequest for progress events
        try {
          const directSuccess = await new Promise<boolean>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('PUT', presignedData.uploadUrl, true);
            xhr.setRequestHeader('Content-Type', contentType);

            if (xhr.upload && onProgress) {
              xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                  const percent = Math.round((e.loaded / e.total) * 100);
                  onProgress(percent);
                }
              };
            }

            xhr.onload = () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                if (onProgress) onProgress(100);
                resolve(true);
              } else {
                reject(new Error(`Direct R2 upload status ${xhr.status}`));
              }
            };

            xhr.onerror = () => reject(new Error('Network error during direct R2 upload'));
            xhr.send(fileOrBlob);
          });

          if (directSuccess) {
            return {
              success: true,
              publicUrl: presignedData.publicUrl,
              objectKey: presignedData.objectKey,
            };
          }
        } catch (directErr) {
          console.warn('Direct R2 presigned PUT failed (likely CORS), attempting server-side fallback:', directErr);
        }
      }
    }
  } catch (presignedErr) {
    console.warn('Presigned ticket generation issue, falling back to direct server upload:', presignedErr);
  }

  // 3. Fallback: Direct server proxy upload
  try {
    if (onProgress) onProgress(20);
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(fileOrBlob);
    });

    if (onProgress) onProgress(50);

    const directRes = await fetch('/api/r2/upload-direct', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dataUrl,
        fileName: resolvedFileName,
        contentType,
        folder: 'guestbook-videos',
      }),
    });

    if (onProgress) onProgress(90);

    if (!directRes.ok) {
      const errData = await directRes.json().catch(() => ({}));
      throw new Error(errData.error || `Server proxy upload returned status ${directRes.status}`);
    }

    const data = await directRes.json();
    if (onProgress) onProgress(100);

    return {
      success: true,
      publicUrl: data.publicUrl,
      objectKey: data.objectKey,
    };
  } catch (fallbackErr: any) {
    console.error('All Cloudflare R2 upload attempts failed:', fallbackErr);
    // As a resilient fallback, return a local Object URL with notice
    const localUrl = URL.createObjectURL(fileOrBlob);
    return {
      success: false,
      publicUrl: localUrl,
      isLocalPreview: true,
      error: fallbackErr.message || 'Failed to upload video to Cloudflare R2',
    };
  }
}

/**
 * Permanently deletes a video from Cloudflare R2 via the server-side API.
 * Accepts either the full video public URL or the object key.
 */
export async function deleteVideoFromR2(videoUrlOrKey: string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  if (!videoUrlOrKey || typeof videoUrlOrKey !== 'string') {
    return { success: true };
  }

  const trimmed = videoUrlOrKey.trim();
  // Skip local preview blob URLs
  if (trimmed.startsWith('blob:') || trimmed.startsWith('data:')) {
    return { success: true };
  }

  try {
    const res = await fetch('/api/r2/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ videoUrl: trimmed }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.warn('Cloudflare R2 delete returned non-ok status:', res.status, data);
      return {
        success: false,
        error: data.error || `R2 deletion failed with status ${res.status}`,
      };
    }

    return {
      success: Boolean(data.success),
      message: data.message,
    };
  } catch (err: any) {
    console.warn('Network error while deleting video from Cloudflare R2:', err);
    return {
      success: false,
      error: err.message || 'Network error during Cloudflare R2 deletion',
    };
  }
}

