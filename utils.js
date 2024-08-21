export function getImageSource(img) {
    return img.src || img.getAttribute('data-src') || img.getAttribute('srcset') || null;
}

export function isImageLargeEnough(img, minWidth, minHeight) {
    // Check if the image meets the minimum width and height requirements
    return img.width >= minWidth && img.height >= minHeight;
}

export function generateFilename(format, originalSrc, sequence, prefix = "", suffix = "") {
    const originalName = originalSrc.split('/').pop().split('?')[0];
    const extension = originalName.split('.').pop();

    switch (format) {
        case "original":
            return originalName;
        case "sequence":
            return `${sequence}.${extension}`;
        case "prefix_sequence":
            return `${prefix}${sequence}.${extension}`;
        case "sequence_suffix":
            return `${sequence}${suffix}.${extension}`;
        default:
            return originalName;
    }
}
