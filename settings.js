document.addEventListener("DOMContentLoaded", () => {
    const filenameFormatSelect = document.getElementById("filenameFormat");
    const prefixInput = document.getElementById("prefix");
    const suffixInput = document.getElementById("suffix");
    const sequenceStartInput = document.getElementById("sequenceStart");
    const minWidthInput = document.getElementById("minWidth");
    const minHeightInput = document.getElementById("minHeight");
    const buttonPositionSelect = document.getElementById("buttonPosition");

    // Load saved settings
    chrome.storage.sync.get([
        "filenameFormat", "prefix", "suffix", "sequenceStart", "minWidth", "minHeight", "buttonPosition"
    ], (settings) => {
        filenameFormatSelect.value = settings.filenameFormat || "original";
        prefixInput.value = settings.prefix || "";
        suffixInput.value = settings.suffix || "";
        sequenceStartInput.value = settings.sequenceStart || 1;
        minWidthInput.value = settings.minWidth || 10;
        minHeightInput.value = settings.minHeight || 10;
        buttonPositionSelect.value = settings.buttonPosition || "topRight";
    });

    // Save settings on form submission
    document.getElementById("settings-form").addEventListener("submit", (e) => {
        e.preventDefault();

        chrome.storage.sync.set({
            filenameFormat: filenameFormatSelect.value,
            prefix: prefixInput.value,
            suffix: suffixInput.value,
            sequenceStart: sequenceStartInput.value,
            minWidth: minWidthInput.value,
            minHeight: minHeightInput.value,
            buttonPosition: buttonPositionSelect.value
        }, () => {
            alert("Settings saved!");
        });
    });
});
