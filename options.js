document.getElementById("settings-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const minWidth = document.getElementById("minWidth").value;
    const minHeight = document.getElementById("minHeight").value;
    const buttonPosition = document.getElementById("buttonPosition").value;
    const filenameFormat = document.getElementById("filenameFormat").value;

    chrome.storage.sync.set({
        minWidth: minWidth,
        minHeight: minHeight,
        buttonPosition: buttonPosition,
        filenameFormat: filenameFormat
    }, () => {
        alert("Settings saved!");
    });
});
