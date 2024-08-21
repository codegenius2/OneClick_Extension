document.addEventListener("DOMContentLoaded", () => {
    const filenameFormatSelect = document.getElementById("filenameFormat");
    const prefixInput = document.getElementById("prefix");
    const suffixInput = document.getElementById("suffix");
    const minWidthInput = document.getElementById("minWidth");
    const minHeightInput = document.getElementById("minHeight");
    const buttonPositionSelect = document.getElementById("buttonPosition");
    const prefixGroup = document.getElementById("prefix-group");
    const suffixGroup = document.getElementById("suffix-group");

    // Load saved settings when the popup is opened
    function loadSettings() {
        chrome.storage.sync.get([
            "filenameFormat",
            "prefix",
            "suffix",
            "minWidth",
            "minHeight",
            "buttonPosition"
        ], (settings) => {
            if (settings.filenameFormat) {
                filenameFormatSelect.value = settings.filenameFormat;
            }
            if (settings.prefix) {
                prefixInput.value = settings.prefix;
            }
            if (settings.suffix) {
                suffixInput.value = settings.suffix;
            }
            if (settings.minWidth) {
                minWidthInput.value = settings.minWidth;
            }
            if (settings.minHeight) {
                minHeightInput.value = settings.minHeight;
            }
            if (settings.buttonPosition) {
                buttonPositionSelect.value = settings.buttonPosition;
            }

            // Show or hide prefix/suffix inputs based on the selected format
            updateInputVisibility(settings.filenameFormat);
        });
    }

    loadSettings(); // Call this on DOMContentLoaded

    // Save settings on form submission
    document.getElementById("settings-form").addEventListener("submit", (e) => {
        e.preventDefault();

        const filenameFormat = filenameFormatSelect.value;
        const prefix = prefixInput.value;
        const suffix = suffixInput.value;
        const minWidth = minWidthInput.value;
        const minHeight = minHeightInput.value;
        const buttonPosition = buttonPositionSelect.value;

        chrome.storage.sync.set({
            filenameFormat: filenameFormat,
            prefix: prefix,
            suffix: suffix,
            minWidth: minWidth,
            minHeight: minHeight,
            buttonPosition: buttonPosition
        }, () => {
            alert("Settings saved!");
        });
    });

    // Handle the visibility of prefix and suffix inputs based on the selected format
    filenameFormatSelect.addEventListener("change", (e) => {
        updateInputVisibility(e.target.value);
    });

    function updateInputVisibility(format) {
        switch (format) {
            case "prefix_sequence":
                prefixGroup.style.display = "block";
                suffixGroup.style.display = "none";
                break;
            case "sequence_suffix":
                prefixGroup.style.display = "none";
                suffixGroup.style.display = "block";
                break;
            default:
                prefixGroup.style.display = "none";
                suffixGroup.style.display = "none";
        }
    }
});
