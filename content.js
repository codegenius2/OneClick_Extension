chrome.storage.sync.get(["minWidth", "minHeight", "buttonPosition", "filenameFormat", "prefix", "suffix"], (settings) => {
    // Ensure minWidth and minHeight are set to a valid value (greater than 0)
    const minWidth = Math.max(settings.minWidth || 10, 1);
    const minHeight = Math.max(settings.minHeight || 10, 1);

    const images = document.querySelectorAll("img");

    images.forEach((img, index) => {
        if (isImageEligible(img, minWidth, minHeight)) {
            const dlButton = createDownloadButton(settings.buttonPosition);
            attachDownloadButton(dlButton, img, settings.filenameFormat, index + 1, settings.prefix, settings.suffix);
        }
    });
});

// Function to check if the image meets size requirements
function isImageEligible(img, minWidth, minHeight) {
    return img.width >= minWidth && img.height >= minHeight;
}

// Function to create a download button with "⇩" symbol
function createDownloadButton(position) {
    const button = document.createElement("button");
    button.classList.add("download-btn");
    button.textContent = "⇩"; // Set button content to "⇩"

    // Position the button
    button.style.position = "absolute";
    button.style[position] = "10px";
    button.style.zIndex = "1000";

    return button;
}

// Function to attach the download button to an image and set up the click event
function attachDownloadButton(button, img, filenameFormat, sequence, prefix, suffix) {
    button.addEventListener("click", (event) => {
        event.stopPropagation();
        event.preventDefault();

        const imgSrc = img.src;
        const filename = generateFilename(filenameFormat, imgSrc, sequence, prefix, suffix);
        initiateDownload(imgSrc, filename);
    });

    img.parentElement.style.position = "relative";  // Ensure the parent element is correctly positioned
    img.parentElement.appendChild(button);          // Attach the button to the image container
}

// Function to generate the filename based on the settings
function generateFilename(format, src, sequence, prefix = "", suffix = "") {
    const originalName = src.split('/').pop().split('?')[0];
    const extension = originalName.split('.').pop();

    switch (format) {
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

// Function to initiate the download
function initiateDownload(url, filename) {
    chrome.runtime.sendMessage({
        action: 'download',
        url: url,
        filename: filename
    });
}
