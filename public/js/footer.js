const slot = document.querySelector('[data-include*="footer"]');

const parse = (text) => text.split(";").map((item) => item.split(","));

const destinations = {
    popular: parse("Nashville,Cabin rentals;Galveston,Villa rentals;Tampa,Condo rentals;Washington,Apartment rentals;Barcelona,Vacation rentals;Philadelphia,Apartment rentals;Broken Bow,Cottage rentals;Destin,Condo rentals;Madrid,Condo rentals;Pittsburgh,Condo rentals;Gulf Shores,Monthly Rentals;San Juan,Condo rentals;Florida Keys,Villa rentals;Portland,Monthly Rentals;Pocono Mountains,Apartment rentals;Portland,Condo rentals;Minneapolis,Condo rentals;Austin,Vacation rentals;Lisbon,Apartment rentals;Cebu City,Condo rentals;Tagaytay,Vacation rentals;Boracay,Beach house rentals;Baguio,Cabin rentals;Siargao,Villa rentals"),
    arts: parse("Paris,Apartment rentals;Rome,Vacation rentals;Kyoto,House rentals;Florence,Apartment rentals;New Orleans,Condo rentals;Vienna,Apartment rentals;Amsterdam,Apartment rentals;Prague,Apartment rentals;Santa Fe,Cottage rentals;Seville,Apartment rentals;Istanbul,Apartment rentals;Vigan,House rentals"),
    beach: parse("Boracay,Beach house rentals;Siargao,Villa rentals;Panglao,Beach house rentals;Malapascua,Cottage rentals;Bantayan Island,Beach house rentals;Moalboal,Cottage rentals;El Nido,Villa rentals;Coron,Villa rentals;Puerto Galera,Beach house rentals;Bali,Villa rentals;Phuket,Villa rentals;Maui,Condo rentals"),
    mountains: parse("Baguio,Cabin rentals;Sagada,Cottage rentals;Tagaytay,Vacation rentals;Busay,Cabin rentals;Dahilayan,Cottage rentals;Banaue,Cottage rentals;Asheville,Cabin rentals;Aspen,Chalet rentals;Banff,Cabin rentals;Lake Tahoe,Cabin rentals;Swiss Alps,Chalet rentals;Pigeon Forge,Cabin rentals"),
    outdoors: parse("Moalboal,Cottage rentals;Oslob,House rentals;Kawasan,Cottage rentals;Mantalongon,Cabin rentals;Samal Island,Beach house rentals;Palawan,Villa rentals;Yosemite,Cabin rentals;Zion,Cottage rentals;Joshua Tree,House rentals;Sedona,Cabin rentals;Glacier,Cabin rentals;Big Bear,Cabin rentals"),
    things: parse("Cebu City,Apartment rentals;Mandaue,Condo rentals;Lapu-Lapu,Condo rentals;Davao,Apartment rentals;Manila,Condo rentals;Makati,Condo rentals;Singapore,Apartment rentals;Tokyo,Apartment rentals;Seoul,Apartment rentals;Bangkok,Condo rentals;Hong Kong,Apartment rentals;Taipei,Apartment rentals"),
    tips: parse("Travel guides,Destination ideas;Packing lists,Trip planning;Budget travel,Save more;Solo travel,Stay safe;Family trips,Kid friendly;Road trips,Route ideas;Weekend getaways,Short stays;Long stays,Monthly rentals;Pet friendly,Travel with pets;Group travel,Big homes;Work trips,Remote friendly;Holiday travel,Seasonal ideas"),
    friendly: parse("Cebu City,Airbnb-friendly apartments;Mandaue,Airbnb-friendly apartments;Lapu-Lapu,Airbnb-friendly apartments;Talisay,Airbnb-friendly apartments;Minglanilla,Airbnb-friendly apartments;Manila,Airbnb-friendly apartments;Makati,Airbnb-friendly apartments;Taguig,Airbnb-friendly apartments;Davao,Airbnb-friendly apartments;Iloilo,Airbnb-friendly apartments;Bacolod,Airbnb-friendly apartments;Baguio,Airbnb-friendly apartments")
};

const visibleLimit = 17;
const chevron = '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 4l4 4 4-4"/></svg>';

let activeKey = "popular";
let expanded = false;

function renderGrid() {
    const grid = slot.querySelector(".footer_grid");
    const items = destinations[activeKey];
    const needsToggle = items.length > visibleLimit;
    const shown = needsToggle && !expanded ? items.slice(0, visibleLimit) : items;

    const places = shown
        .map(([title, type]) => `<li class="footer_place"><a href="#"><span class="footer_place_title">${title}</span></a><span class="footer_place_type">${type}</span></li>`)
        .join("");

    const toggle = needsToggle
        ? `<li><button class="footer_more${expanded ? " expanded" : ""}" type="button">${expanded ? "Show less" : "Show more"}${chevron}</button></li>`
        : "";

    grid.innerHTML = places + toggle;
}

function selectTab(tab) {
    slot.querySelectorAll(".footer_tab").forEach((t) => {
        const isActive = t === tab;
        t.classList.toggle("active", isActive);
        t.setAttribute("aria-selected", String(isActive));
    });
    activeKey = tab.dataset.tab;
    expanded = false;
    renderGrid();
}

function init() {
    const grid = slot.querySelector(".footer_grid");
    if (!grid || grid.dataset.ready) return;
    grid.dataset.ready = "true";
    renderGrid();
}

slot.addEventListener("click", (event) => {
    const tab = event.target.closest(".footer_tab");
    if (tab) {
        selectTab(tab);
        return;
    }
    if (event.target.closest(".footer_more")) {
        expanded = !expanded;
        renderGrid();
    }
});

new MutationObserver(init).observe(slot, { childList: true, subtree: true });

async function load() {
    if (!slot.children.length) {
        const response = await fetch(slot.dataset.include);
        if (response.ok && !slot.children.length) {
            slot.innerHTML = await response.text();
        }
    }
    init();
}

load();