import { removeBackground as imglyRemoveBackground } from '@imgly/background-removal';

/**
 * Removes the background from an image file using @imgly/background-removal.
 * 
 * @param file The original image file.
 * @returns A promise that resolves to a new File object with the background removed.
 */
export async function removeBackground(file: File): Promise<File> {
  try {
    // removeBackground returns a Blob
    const blob = await imglyRemoveBackground(file, {
      progress: (key, current, total) => {
        console.log(`Downloading ${key}: ${((current / total) * 100).toFixed(0)}%`);
      },
      model: 'isnet_fp16', // Options: 'isnet', 'isnet_fp16', 'isnet_quint8'
      device: 'cpu',
      publicPath: 'https://staticimgly.com/@imgly/background-removal-data/1.7.0/dist/',
      output: {
        format: 'image/png',
        quality: 0.8,
      }
    });

    // Create a new File object from the Blob
    const processedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + "-no-bg.png", {
      type: 'image/png',
      lastModified: Date.now(),
    });

    return processedFile;
  } catch (error) {
    console.error("Failed to remove background:", error);
    throw error;
  }
}

export default removeBackground;
