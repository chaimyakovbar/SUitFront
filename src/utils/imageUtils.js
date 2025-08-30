/**
 * Utility functions for image loading with fallback and retry logic
 */

// Cache for failed images to avoid repeated requests
const failedImagesCache = new Set();

/**
 * Check if an image exists and is accessible
 */
export const checkImageExists = async (url) => {
    if (failedImagesCache.has(url)) {
        return false;
    }

    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        console.warn(`Image not accessible: ${url}`, error);
        failedImagesCache.add(url);
        return false;
    }
};

/**
 * Get fallback URL for different image formats
 */
export const getFallbackUrl = (originalUrl) => {
    if (originalUrl.includes('.webp')) {
        return originalUrl.replace('.webp', '.png');
    }
    if (originalUrl.includes('.png')) {
        return originalUrl.replace('.png', '.jpg');
    }
    return null;
};

/**
 * Load image with fallback and retry logic
 */
export const loadImageWithFallback = async (originalUrl, maxRetries = 2) => {
    let currentUrl = originalUrl;
    let attempts = 0;

    while (attempts < maxRetries) {
        try {
            const exists = await checkImageExists(currentUrl);
            if (exists) {
                return currentUrl;
            }
        } catch (error) {
            console.warn(`Attempt ${attempts + 1} failed for: ${currentUrl}`);
        }

        // Try fallback URL
        const fallbackUrl = getFallbackUrl(currentUrl);
        if (fallbackUrl && fallbackUrl !== currentUrl) {
            currentUrl = fallbackUrl;
        } else {
            break; // No more fallbacks to try
        }

        attempts++;
    }

    // If all attempts failed, return a placeholder or null
    console.error(`Failed to load image after ${maxRetries} attempts: ${originalUrl}`);
    return null;
};

/**
 * Preload critical images
 */
export const preloadCriticalImages = async (imageUrls) => {
    const promises = imageUrls.map(url => loadImageWithFallback(url));
    const results = await Promise.allSettled(promises);

    const successful = results
        .filter(result => result.status === 'fulfilled' && result.value)
        .map(result => result.value);

    const failed = results
        .filter(result => result.status === 'rejected' || !result.value)
        .length;

    console.log(`Preloaded ${successful.length} images, ${failed} failed`);
    return { successful, failed };
};

/**
 * Clear failed images cache
 */
export const clearFailedImagesCache = () => {
    failedImagesCache.clear();
};
