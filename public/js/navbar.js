const tabs = document.querySelectorAll(".nav_tab");
const container = document.querySelector(".nav_buttons");
const INTRO_DELAY = 180;

const indicator = document.createElement("span");
indicator.className = "nav_indicator";
container.appendChild(indicator);

function showIcon(tab, kind) {
    const twirl = tab.querySelector(".icon_twirl");
    const selected = tab.querySelector(".icon_selected");
    const active = kind === "selected" ? selected : twirl;
    const other = kind === "selected" ? twirl : selected;

    other.classList.remove("visible");
    other.pause();
    active.classList.add("visible");
    active.currentTime = 0;
    active.play().catch(() => {});
}

function growIcon(tab, kind) {
    const box = tab.querySelector(".video_container");

    if (box.classList.contains("grown")) {
        showIcon(tab, kind);
        return;
    }

    const onEnd = (event) => {
        if (event.target !== box) return;
        box.removeEventListener("transitionend", onEnd);
        showIcon(tab, kind);
    };

    box.addEventListener("transitionend", onEnd);
    box.classList.add("grown");
}

function moveIndicator(tab, animate) {
    indicator.classList.toggle("animate", animate);
    const x = tab.offsetLeft;
    const y = tab.offsetTop + tab.offsetHeight - indicator.offsetHeight;
    indicator.style.width = tab.offsetWidth + "px";
    indicator.style.transform = `translate(${x}px, ${y}px)`;
    indicator.classList.add("ready");
}

function currentTab() {
    return document.querySelector(".nav_tab.active");
}

tabs.forEach((tab) => {

    tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        moveIndicator(tab, true);
        growIcon(tab, "selected");
    });
});

tabs.forEach((tab, index) => {
    setTimeout(() => growIcon(tab, "twirl"), index * INTRO_DELAY);
});

const observer = new ResizeObserver(() => {
    const tab = currentTab();
    if (tab) moveIndicator(tab, false);
});

observer.observe(container);
tabs.forEach((tab) => observer.observe(tab));

if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
        const tab = currentTab();
        if (tab) moveIndicator(tab, false);
    });
}