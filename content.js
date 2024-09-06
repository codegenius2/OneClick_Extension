chrome.storage.sync.get([
    "isEnabled",
    "minWidth",
    "minHeight",
    "buttonPosition", // User-defined position setting
    "filenameFormat",
    "prefix",
    "suffix",
    "sequenceStart",
    "zeroPadding" // New setting for customizable zero padding length
], (settings) => {
    if (!settings.isEnabled) {
        console.log("Extension is disabled.");
        return;
    }

    console.log("Extension is enabled, settings loaded:", settings);

    const minWidth = Math.max(settings.minWidth || 10, 1);
    const minHeight = Math.max(settings.minHeight || 10, 1);
    const initialSequence = settings.sequenceStart || 1;
    const zeroPaddingLength = settings.zeroPadding || settings.sequenceStart.length || 3; // Use sequenceStart length for padding

    // Reset sequence number to Start Value for Sequential Number when save & reload
    chrome.storage.sync.get(["currentSequence", "sequenceStart"], (result) => {
        const startValue = result.sequenceStart || initialSequence;
        // Reset sequence to the start value if reloaded
        chrome.storage.sync.set({ "currentSequence": startValue }, () => {
            console.log("Reset sequence number to start value:", startValue);
        });
    });

    // Select all images on the page
    const images = document.querySelectorAll("img");

    // Loop through images to attach DL button if eligible and detect <br><br> separation
    images.forEach((img, index) => {
        if (img.width >= minWidth && img.height >= minHeight) {
            console.log(`Processing image: ${img.src}, Width: ${img.width}, Height: ${img.height}`);
            const dlButton = createDownloadButton(settings.buttonPosition);

            if (isAfterTwoBRs(img)) {
                // Calculate position relative to the previous image's height + 30px
                const previousImg = getPreviousImageBeforeBRs(img);
                if (previousImg) {
                    attachDownloadButtonAfterBRs(dlButton, img, previousImg, settings.filenameFormat, sequence++, settings.prefix, settings.suffix);
                }
            } else {
                attachDownloadButton(dlButton, img, settings.filenameFormat, sequence++, settings.prefix, settings.suffix);
            }
        } else {
            console.log(`Image not eligible for DL button: ${img.src}`);
        }
    });
});

// Function to create a download button
function createDownloadButton(position) {
    const button = document.createElement("button");
    button.classList.add("download-btn");
    button.textContent = "⇩";

    button.style.position = "absolute";
    button.style.zIndex = "1000"; // Ensure the button appears above the image
    button.style.cursor = "pointer"; // Make the button clickable

    return button;
}

// Function to check if the image is after two <br> elements
function isAfterTwoBRs(img) {
    let prevElement = img.previousSibling;
    let brCount = 0;

    while (prevElement) {
        if (prevElement.nodeType === Node.ELEMENT_NODE && prevElement.tagName === "BR") {
            brCount++;
        }
        if (brCount >= 2) {
            return true;
        }
        prevElement = prevElement.previousSibling;
    }

    return false;
}

// Function to get the previous image before <br><br>
function getPreviousImageBeforeBRs(img) {
    let prevElement = img.previousSibling;
    while (prevElement) {
        if (prevElement.nodeType === Node.ELEMENT_NODE && prevElement.tagName === "IMG") {
            return prevElement;
        }
        prevElement = prevElement.previousSibling;
    }
    return null;
}

// Function to set the position of the button relative to the image or parent
function setPosition(button, img, position) {
    button.style.top = "auto";
    button.style.bottom = "auto";
    button.style.left = "auto";
    button.style.right = "auto";

    switch (position) {
        case "topRight":
            button.style.top = "10px";
            button.style.right = "10px";
            break;
        case "topLeft":
            button.style.top = "10px";
            button.style.left = "10px";
            break;
        default:
            button.style.top = "10px";
            button.style.right = "10px";
            break;
    }
}

// Function to attach the download button after <br><br> relative to the previous image
function attachDownloadButtonAfterBRs(button, img, previousImg, filenameFormat, sequence, prefix = "", suffix = "") {
    console.log(`Attaching button to image after <br><br>: ${img.src}`);

    button.addEventListener("click", (event) => {
        event.stopPropagation();
        event.preventDefault();

        // Get the current sequence number from storage
        chrome.storage.sync.get(["currentSequence"], (result) => {
            let currentSequence = result.currentSequence || 1;
            const imgSrc = img.src;
            const filename = generateFilename(filenameFormat, imgSrc, currentSequence, prefix, suffix, zeroPadding);

            console.log(`Initiating download for: ${imgSrc} as ${filename}`);
            initiateDownload(imgSrc, filename);

            // Increment the sequence and update it in storage
            currentSequence++;
            chrome.storage.sync.set({ "currentSequence": currentSequence }, () => {
                console.log("Updated sequence number to:", currentSequence);
            });
        });
    });

    // Ensure the parent of the image has relative positioning
    if (img.parentElement) {
        img.parentElement.style.position = "relative";
    }

    // Calculate top position based on the height of the previous image + 30px
    button.style.top = `${previousImg.offsetHeight + 30}px`;
    button.style.right = "20px"; // Adjust as needed

    // Attach the button to the parent container
    img.parentElement.appendChild(button);
}

// Function to attach the download button to an image
function attachDownloadButton(button, img, filenameFormat, sequence, prefix = "", suffix = "") {
    console.log(`Attaching button to image: ${img.src}`);

    button.addEventListener("click", (event) => {
        event.stopPropagation();
        event.preventDefault();

        // Get the current sequence number from storage
        chrome.storage.sync.get(["currentSequence"], (result) => {
            let currentSequence = result.currentSequence || 1;
            const imgSrc = img.src;
            const filename = generateFilename(filenameFormat, imgSrc, currentSequence, prefix, suffix, zeroPadding);

            console.log(`Initiating download for: ${imgSrc} as ${filename}`);
            initiateDownload(imgSrc, filename);

            // Increment the sequence and update it in storage
            currentSequence++;
            chrome.storage.sync.set({ "currentSequence": currentSequence }, () => {
                console.log("Updated sequence number to:", currentSequence);
            });
        });
    });

    // Ensure the parent of the image has relative positioning
    if (img.parentElement) {
        img.parentElement.style.position = "relative";
    }

    // Position the button based on user settings
    setPosition(button, img, position);

    // Attach the button to the parent container
    img.parentElement.appendChild(button);
}

// Function to generate the filename based on the settings
function generateFilename(format, src, sequence, prefix = "", suffix = "", zeroPadding = 3) {
    const originalName = src.split('/').pop().split('?')[0];
    const extension = originalName.split('.').pop();
    const paddedSequence = String(sequence).padStart(zeroPadding, '0'); // Pad the sequence with leading zeros

    switch (format) {
        case "sequence":
            return `${paddedSequence}.${extension}`;
        case "prefix_sequence":
            return `${prefix}${paddedSequence}.${extension}`;
        case "sequence_suffix":
            return `${paddedSequence}${suffix}.${extension}`;
        case "original":
            return originalName;
        default:
            console.warn("Unknown filename format. Defaulting to original filename.");
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
