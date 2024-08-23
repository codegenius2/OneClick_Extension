chrome.storage.sync.get([
    "isEnabled",
    "minWidth",
    "minHeight",
    "buttonPosition",
    "filenameFormat",
    "prefix",
    "suffix",
    "sequenceStart"
], (settings) => {
    if (!settings.isEnabled) {
        console.log("Extension is disabled.");
        return;
    }

    const minWidth = Math.max(settings.minWidth || 10, 1);
    const minHeight = Math.max(settings.minHeight || 10, 1);
    let sequence = settings.sequenceStart || 1;

    const images = document.querySelectorAll("img");

    images.forEach((img) => {
        if (img.width >= minWidth && img.height >= minHeight) {
            const dlButton = createDownloadButton(settings.buttonPosition);
            attachDownloadButton(dlButton, img, settings.filenameFormat, sequence++, settings.prefix, settings.suffix);
        }
    });

    // Add the reposition button
    const repositionButton = createRepositionButton();
    document.body.appendChild(repositionButton);
});

// Function to create a download button
function createDownloadButton(position) {
    const button = document.createElement("button");
    button.classList.add("download-btn");
    button.textContent = "⇩";

    button.style.position = "absolute";
    setPosition(button, position);

    return button;
}

// Function to set the position of the button
function setPosition(button, position) {
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
}

// Function to attach the download button to an image
function attachDownloadButton(button, img, filenameFormat, sequence, prefix = "", suffix = "") {
    button.addEventListener("click", (event) => {
        event.stopPropagation();
        event.preventDefault();

        const imgSrc = img.src;
        const filename = generateFilename(filenameFormat, imgSrc, sequence, prefix, suffix);
        initiateDownload(imgSrc, filename);
    });

    img.parentElement.style.position = "relative";
    img.parentElement.appendChild(button);
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

// Function to create a reposition button
function createRepositionButton() {
    const button = document.createElement("button");
    button.textContent = "Reposition DL Buttons";
    button.style.position = "fixed";
    button.style.bottom = "20px";
    button.style.right = "20px";
    button.style.zIndex = "1000";
    button.style.padding = "10px";
    button.style.backgroundColor = "#36D1DC";
    button.style.color = "white";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";

    button.addEventListener("click", enableRepositioning);

    return button;
}

// Function to enable repositioning of DL buttons
function enableRepositioning() {
    const buttons = document.querySelectorAll(".download-btn");
    buttons.forEach(button => {
        button.style.position = "fixed";
        button.style.zIndex = "1001";
        button.draggable = true;

        button.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", null);
        });

        button.addEventListener("drag", (e) => {
            if (e.clientX > 0 && e.clientY > 0) {
                button.style.left = `${e.clientX - button.offsetWidth / 2}px`;
                button.style.top = `${e.clientY - button.offsetHeight / 2}px`;
            }
        });

        button.addEventListener("dragend", (e) => {
            // Store the new position if needed
        });
    });
}
