document.addEventListener("DOMContentLoaded", () => {
    const isEnabledCheckbox = document.getElementById("isEnabled");
    const filenameFormatSelect = document.getElementById("filenameFormat");
    const prefixInput = document.getElementById("prefix");
    const suffixInput = document.getElementById("suffix");
    const sequenceStartInput = document.getElementById("sequenceStart");
    const minWidthInput = document.getElementById("minWidth");
    const minHeightInput = document.getElementById("minHeight");
    const buttonPositionSelect = document.getElementById("buttonPosition");

    // Load saved settings
    chrome.storage.sync.get([
        "isEnabled",
        "filenameFormat",
        "prefix",
        "suffix",
        "sequenceStart",
        "minWidth",
        "minHeight",
        "buttonPosition"
    ], (settings) => {
        isEnabledCheckbox.checked = settings.isEnabled !== false;
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
        saveSettings();
    });

    // Save and reload the current page
    document.getElementById("saveAndReload").addEventListener("click", () => {
        saveSettings(() => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.reload(tabs[0].id);
            });
        });
    });

    // Function to save settings
    function saveSettings(callback) {
        chrome.storage.sync.set({
            isEnabled: isEnabledCheckbox.checked,
            filenameFormat: filenameFormatSelect.value,
            prefix: prefixInput.value,
            suffix: suffixInput.value,
            sequenceStart: sequenceStartInput.value,
            minWidth: minWidthInput.value,
            minHeight: minHeightInput.value,
            buttonPosition: buttonPositionSelect.value
        }, () => {
            if (callback) {
                callback();
            } else {
                alert("Settings saved successfully!");
            }
        });
    }
});
