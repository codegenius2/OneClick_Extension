// Function to hide all download buttons
function hideAllDownloadButtons() {
    const buttons = document.querySelectorAll(".download-btn");
    buttons.forEach(button => {
        button.style.display = 'none';
    });
}

// Function to show download buttons for visible images
function showDownloadButtonForVisibleImages() {
    const images = document.querySelectorAll("img");
    images.forEach((img, index) => {
        if (isImageVisible(img)) {
            const dlButton = createDownloadButton('topRight'); // Adjust the position as needed
            attachDownloadButton(dlButton, img, 'sequence', index + 1); // Add a sequential filename
        } else {
            console.log("Image is not visible on the screen.");
        }
    });
}

// Function to check if an image is visible on the screen
function isImageVisible(img) {
    const rect = img.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Event listener for clicking on image triggers
document.querySelectorAll(".image-trigger").forEach(trigger => {
    trigger.addEventListener("click", function () {
        hideAllDownloadButtons(); // Hide all existing DL buttons

        // Simulate an image transition or load (you should replace this with actual logic)
        setTimeout(() => {
            console.log("Image has been changed or loaded.");
            showDownloadButtonForVisibleImages(); // Show DL buttons for the new visible images
        }, 100); // Adjust delay as needed for your use case
    });
});

// Function to create a download button
function createDownloadButton(position) {
    const button = document.createElement("button");
    button.classList.add("download-btn");
    button.textContent = "⇩"; // Set button content to "⇩"

    // Position the button
    button.style.position = "absolute";
    switch (position) {
        case "topLeft":
            button.style.top = "10px";
            button.style.left = "10px";
            break;
        case "topRight":
            button.style.top = "10px";
            button.style.right = "10px";
            break;
        case "bottomLeft":
            button.style.bottom = "10px";
            button.style.left = "10px";
            break;
        case "bottomRight":
            button.style.bottom = "10px";
            button.style.right = "10px";
            break;
        default:
            button.style.top = "10px";
            button.style.right = "10px";
    }
    button.style.zIndex = "1000";

    return button;
}

// Function to attach the download button to an image and set up the click event
function attachDownloadButton(button, img, filenameFormat, sequence) {
    button.addEventListener("click", (event) => {
        event.stopPropagation();
        event.preventDefault();

        const imgSrc = img.src;
        const filename = generateFilename(filenameFormat, imgSrc, sequence);
        initiateDownload(imgSrc, filename);
    });

    img.parentElement.style.position = "relative";
    img.parentElement.appendChild(button);
    console.log("Download button attached to image.");
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

// Initial call to show DL buttons for the visible images when the page loads
document.addEventListener("DOMContentLoaded", showDownloadButtonForVisibleImages);
