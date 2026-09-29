const tabs = document.querySelectorAll(".nav_tab");

function playIcon(video) {
    video.currentTime = 0;
    video.play().catch(() => {});
}

tabs.forEach((tab) => {
    const video = tab.querySelector("video");

    tab.addEventListener("mouseenter", () => playIcon(video));

    tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        playIcon(video);
    });
});
