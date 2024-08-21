chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ sequence: 1, resetSequenceOnClose: true });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'download') {
        chrome.downloads.download({
            url: message.url,
            filename: message.filename
        }, (downloadId) => {
            if (chrome.runtime.lastError) {
                console.error('Download failed:', chrome.runtime.lastError.message);
            } else {
                console.log('Download started with ID:', downloadId);
            }
        });
    }
});
