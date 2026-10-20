const tabs = document.querySelectorAll(".nav_tab");
const container = document.querySelector(".nav_buttons");
const clicked = new Set();

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

function growIcon(tab) {
    const box = tab.querySelector(".video_container");
    if (box.classList.contains("grown")) return Promise.resolve();

    return new Promise((resolve) => {
        const done = () => {
            box.removeEventListener("transitionend", onEnd);
            clearTimeout(fallback);
            resolve();
        };
        const onEnd = (event) => {
            if (event.target === box) done();
        };
        const fallback = setTimeout(done, 150);

        box.addEventListener("transitionend", onEnd);
        box.classList.add("grown");
    });
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
    tab.addEventListener("click", async () => {
        clicked.add(tab);
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        moveIndicator(tab, true);
        await growIcon(tab);
        if (tab.classList.contains("active")) showIcon(tab, "selected");
    });
});

async function runIntro() {
    for (const tab of tabs) {
        await growIcon(tab);
        if (!clicked.has(tab)) showIcon(tab, "twirl");
    }
}
runIntro();

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

const hero = document.querySelector(".hero");
const topBar = document.querySelector(".top-navbar");
const belowBar = document.querySelector(".below_selections");
const compactSearch = document.querySelector(".compact_search");
const compactIcon = document.querySelector(".compact_icon");
const scrollThreshold = 8;

let expandedHeight = 0;
let compactHeight = 0;

function measureHeights() {
    compactHeight = topBar.offsetHeight;
    expandedHeight = compactHeight + belowBar.scrollHeight;
}

function updateHero() {
    const y = window.scrollY;
    hero.classList.toggle("scrolled", y > scrollThreshold);
    hero.style.height = Math.max(compactHeight, expandedHeight - y) + "px";
}

function showIconRestFrame() {
    compactIcon.currentTime = Math.max(compactIcon.duration - 0.05, 0);
}

if (compactIcon.readyState >= 1) {
    showIconRestFrame();
} else {
    compactIcon.addEventListener("loadedmetadata", showIconRestFrame);
}

compactSearch.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

measureHeights();
updateHero();

window.addEventListener("scroll", updateHero, { passive: true });

new ResizeObserver(() => {
    measureHeights();
    updateHero();
}).observe(topBar);

const hostButton = document.querySelector(".host_text");

hostButton.addEventListener("click", () => {
    window.location.href = "/views/login.html";
});