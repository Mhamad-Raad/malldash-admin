
/**
 * Compresses an image file if it exceeds the specified size limit.
 * @param file The original image file.
 * @param maxSizeMB The maximum allowed size in megabytes (default: 5).
 * @returns A Promise that resolves to the compressed file (or the original if no compression needed).
 */
export const compressImage = async (file: File, maxSizeMB: number = 5): Promise<File> => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (file.size <= maxSizeBytes) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      
      let quality = 0.9;
      
      const compress = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Optional: Downscale if dimensions are too large (e.g., > 4K) to help with size
        const MAX_DIMENSION = 3840; 
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
             const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
             width *= ratio;
             height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          resolve(file); // Fallback to original if canvas fails
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            if (blob.size <= maxSizeBytes || quality <= 0.1) {
              // Create a new File object
              const newFile = new File([blob], file.name, {
                type: 'image/jpeg', // Canvas toBlob defaults to png, but we usually want jpeg for photos. Specify jpeg.
                lastModified: Date.now(),
              });
              resolve(newFile);
            } else {
              // Reduce quality and try again
              quality -= 0.1;
              compress();
            }
          },
          'image/jpeg',
          quality
        );
      };

      compress();
    };

    img.onerror = (error) => {
      URL.revokeObjectURL(url);
      reject(error);
    };

    img.src = url;
  });
};
