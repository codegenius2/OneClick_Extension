document.addEventListener("DOMContentLoaded", () => {
    const isEnabledCheckbox = document.getElementById("isEnabled");
    const filenameFormatSelect = document.getElementById("filenameFormat");
    const prefixGroup = document.getElementById("prefix-group");
    const suffixGroup = document.getElementById("suffix-group");
    const sequenceStartGroup = document.getElementById("sequenceStart-group");

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
        document.getElementById("prefix").value = settings.prefix || "";
        document.getElementById("suffix").value = settings.suffix || "";
        document.getElementById("sequenceStart").value = settings.sequenceStart || 1;
        document.getElementById("minWidth").value = settings.minWidth || 10;
        document.getElementById("minHeight").value = settings.minHeight || 10;
        document.getElementById("buttonPosition").value = settings.buttonPosition || "topRight";

        toggleFilenameOptions(filenameFormatSelect.value);
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

    // Function to toggle filename options based on format
    function toggleFilenameOptions(format) {
        switch (format) {
            case "original":
                prefixGroup.classList.add("hidden");
                suffixGroup.classList.add("hidden");
                sequenceStartGroup.classList.add("hidden");
                break;
            case "sequence":
                prefixGroup.classList.add("hidden");
                suffixGroup.classList.add("hidden");
                sequenceStartGroup.classList.remove("hidden");
                break;
            case "prefix_sequence":
                prefixGroup.classList.remove("hidden");
                suffixGroup.classList.add("hidden");
                sequenceStartGroup.classList.remove("hidden");
                break;
            case "sequence_suffix":
                prefixGroup.classList.add("hidden");
                suffixGroup.classList.remove("hidden");
                sequenceStartGroup.classList.remove("hidden");
                break;
        }
    }

    filenameFormatSelect.addEventListener("change", (e) => {
        toggleFilenameOptions(e.target.value);
    });

    function saveSettings(callback) {
        chrome.storage.sync.set({
            isEnabled: isEnabledCheckbox.checked,
            filenameFormat: filenameFormatSelect.value,
            prefix: document.getElementById("prefix").value,
            suffix: document.getElementById("suffix").value,
            sequenceStart: document.getElementById("sequenceStart").value,
            minWidth: document.getElementById("minWidth").value,
            minHeight: document.getElementById("minHeight").value,
            buttonPosition: document.getElementById("buttonPosition").value
        }, () => {
            if (callback) {
                callback();
            } else {
                alert("Settings saved successfully!");
            }
        });
    }
});
