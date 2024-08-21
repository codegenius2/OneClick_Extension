export function createDownloadButton(position) {
    // const dlButton = document.createElement("button");
    // dlButton.innerText = "Download";
    // dlButton.classList.add("dl-button");

    // dlButton.style.position = "absolute";
    // dlButton.style.zIndex = 1000;

    // const positionStyles = {
    //     topRight: { top: "10px", right: "10px" },
    //     topLeft: { top: "10px", left: "10px" },
    //     bottomRight: { bottom: "10px", right: "10px" },
    //     bottomLeft: { bottom: "10px", left: "10px" },
    console.log("Here!")
    const dlButton = document.createElement("button");
    dlButton.innerText = "DL";
    dlButton.style.position = "absolute";
    dlButton.style[settings.buttonPosition] = "10px";
    dlButton.style.zIndex = 1000;
    dlButton.onclick = () => downloadImage(img.src);

    img.parentElement.style.position = "relative";
    img.parentElement.appendChild(dlButton);

};

Object.assign(dlButton.style, positionStyles[position] || positionStyles.topRight);

dlButton.style.transition = "all 0.3s ease";
dlButton.onmouseover = () => {
    dlButton.style.backgroundColor = "#ff9800";
    dlButton.style.color = "#fff";
};
dlButton.onmouseout = () => {
    dlButton.style.backgroundColor = "";
    dlButton.style.color = "";
};

return dlButton;
}

export function attachButtonToImage(dlButton, img, imgSrc, filename) {
    dlButton.addEventListener("click", () => {
        chrome.downloads.download({
            url: imgSrc,
            filename: filename
        });
    });

    img.parentElement.style.position = "relative";
    img.parentElement.appendChild(dlButton);
}
