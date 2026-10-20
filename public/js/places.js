const PLACES_DATA_URL = 'public/data/places.json';

async function includePartials() {
    const hosts = document.querySelectorAll('[data-include]');
    await Promise.all([...hosts].map(async host => {
        const response = await fetch(host.dataset.include);
        if (!response.ok) throw new Error(`Failed to load ${host.dataset.include}`);
        host.innerHTML = await response.text();
    }));
}

function groupByWhere(listings) {
    return listings.reduce((groups, item) => {
        if (!groups.has(item.where)) groups.set(item.where, []);
        groups.get(item.where).push(item);
        return groups;
    }, new Map());
}

function toggleHeart(event) {
    const button = event.currentTarget;
    const active = button.classList.toggle('active');
    button.setAttribute('aria-pressed', String(active));
    button.setAttribute('aria-label', active ? 'Remove from wishlist' : 'Add to wishlist');
}

function buildCard(template, item, currency) {
    const card = template.content.firstElementChild.cloneNode(true);
    const title = `${item.category} in ${item.place}`;
    const nightLabel = item.nights === 1 ? 'night' : 'nights';
    const rating = Number.isInteger(item.rating) ? item.rating.toFixed(1) : String(item.rating);
    const image = card.querySelector('.place_image');

    image.src = item.image;
    image.alt = title;
    card.querySelector('.place_title').textContent = title;
    card.querySelector('.place_price').textContent = `${currency}${item.price.toLocaleString('en-US')} for ${item.nights} ${nightLabel}`;
    card.querySelector('.place_rating_value').textContent = rating;
    card.querySelector('.place_heart').addEventListener('click', toggleHeart);

    if (!item.guestFavorite) card.querySelector('.place_badge').remove();

    return card;
}

function wireCarousel(section) {
    const track = section.querySelector('.place_track');
    const prev = section.querySelector('.place_prev');
    const next = section.querySelector('.place_next');

    const update = () => {
        prev.disabled = track.scrollLeft <= 1;
        next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
    };

    const step = direction => track.scrollBy({ left: direction * track.clientWidth, behavior: 'smooth' });

    prev.addEventListener('click', () => step(-1));
    next.addEventListener('click', () => step(1));
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
}

async function renderPlaces() {
    const root = document.getElementById('places_root');
    if (!root) return;

    const response = await fetch(PLACES_DATA_URL);
    if (!response.ok) throw new Error(`Failed to load ${PLACES_DATA_URL}`);
    const data = await response.json();

    const sectionTemplate = document.getElementById('place_section_template');
    const cardTemplate = document.getElementById('place_card_template');
    const seeAllTemplate = document.getElementById('place_see_all_template');

    for (const [where, items] of groupByWhere(data.listings)) {
        const section = sectionTemplate.content.firstElementChild.cloneNode(true);
        const track = section.querySelector('.place_track');
        const seeAll = buildSeeAll(seeAllTemplate, where, items);

        section.querySelector('.place_heading_text').textContent = `Places to stay in ${where}`;
        items.forEach(item => track.append(buildCard(cardTemplate, item, data.currency)));
        track.append(seeAll);

        root.append(section);
        wireCarousel(section);
        watchSeeAll(track, seeAll);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await includePartials();
        await renderPlaces();
    } catch (error) {
        console.error(error);
    }
});

function buildSeeAll(template, where, items) {
    const link = template.content.firstElementChild.cloneNode(true);
    link.setAttribute('aria-label', `See all ${items.length} places in ${where}`);
    link.querySelectorAll('.place_see_all_img').forEach((image, index) => {
        if (items[index]) image.src = items[index].image;
    });
    return link;
}

function watchSeeAll(track, card) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => entry.target.classList.toggle('in_view', entry.isIntersecting));
    }, { root: track, threshold: 0.6 });
    observer.observe(card);
}
