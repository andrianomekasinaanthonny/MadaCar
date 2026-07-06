/* ============================================================
   NAVIGATION ENTRE SECTIONS
============================================================ */
function switchTab(id) {
    document.querySelectorAll('.nav-btn').forEach(b =>
        b.classList.toggle('active', b.dataset.target === id)
    );
    document.querySelectorAll('main section').forEach(s =>
        s.classList.toggle('visible', s.id === id)
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('.nav-btn').forEach(btn =>
    btn.addEventListener('click', () => switchTab(btn.dataset.target))
);

/* ============================================================
   RECHERCHE ACCUEIL (Marque + Budget)
============================================================ */
document.querySelector('.search-bar .btn-red').addEventListener('click', function () {
    const marqueSelect = document.querySelectorAll('.sf select')[0];
    const budgetSelect = document.querySelectorAll('.sf select')[1];

    const marque = marqueSelect.value;
    const budget = budgetSelect.value;

    // Convertir le budget en nombre
    const budgetMax = budget === 'Pas de limite'
        ? Infinity
        : parseInt(
            budget
                .replace(/\u00a0/g, '')
                .replace(/\s+/g, '')
                .replace('Ar', '')
                .replace(/\./g, '')
        );

    // Aller sur la section Achat
    switchTab('achat');

    // Attendre que la section soit visible puis filtrer
    setTimeout(() => {
        let found = 0;

        document.querySelectorAll('#achat .car-card').forEach(card => {
            const cardBrand = card.dataset.brand;
            const priceText = card.querySelector('.car-price').childNodes[0].textContent
                .trim()
                .replace(/\u00a0/g, '')   // espace insécable
                .replace(/\s+/g, '')      // tous les espaces
                .replace('Ar', '')
                .replace(/\./g, '');
            const cardPrice = parseInt(priceText);
            console.log(cardBrand, cardPrice, budgetMax);
            const brandMatch = marque === 'Toutes marques' || cardBrand === marque;
            const budgetMatch = isNaN(cardPrice) || cardPrice <= budgetMax;

            if (brandMatch && budgetMatch) {
                card.style.display = 'block';
                found++;
            } else {
                card.style.display = 'none';
            }
        });

        // Afficher/masquer les groupes vides
        document.querySelectorAll('.cars-group').forEach(group => {
            const visible = [...group.querySelectorAll('.car-card')]
                .some(c => c.style.display !== 'none');
            group.style.display = visible ? 'block' : 'none';
        });

        // Message si aucun résultat
        let noResult = document.getElementById('no-result');
        if (!noResult) {
            noResult = document.createElement('div');
            noResult.id = 'no-result';
            noResult.style = 'text-align:center;padding:40px;color:#6b7060;font-size:16px;';
            document.querySelector('#achat .container').appendChild(noResult);
        }
        noResult.textContent = found === 0
            ? '😔 Aucun véhicule ne correspond à votre recherche.'
            : '';

        // Activer le filtre pill correspondant
        document.querySelectorAll('.pill').forEach(p => p.classList.remove('sel'));
        const matchPill = [...document.querySelectorAll('.pill')]
            .find(p => p.dataset.brand === marque);
        if (matchPill) matchPill.classList.add('sel');
        else document.querySelector('.pill[data-brand="all"]').classList.add('sel');

    }, 100);
});

/* ============================================================
   FILTRE PAR MARQUE (section Achat)
============================================================ */
document.querySelectorAll('.pill').forEach(pill => {
    pill.addEventListener('click', () => {
        document.querySelectorAll('.pill').forEach(p => p.classList.remove('sel'));
        pill.classList.add('sel');

        const brand = pill.dataset.brand;

        document.querySelectorAll('#achat .car-card').forEach(card => {
            card.style.display =
                brand === 'all' || card.dataset.brand === brand ? 'block' : 'none';
        });

        document.querySelectorAll('.cars-group').forEach(group => {
            const visible = [...group.querySelectorAll('.car-card')]
                .some(c => c.style.display !== 'none');
            group.style.display = visible ? 'block' : 'none';
        });

        // Effacer message no-result
        const noResult = document.getElementById('no-result');
        if (noResult) noResult.textContent = '';
    });
});

/* ============================================================
   MODAL DÉTAIL VOITURE
============================================================ */
const modal = document.getElementById('car-modal');
const modalClose = document.getElementById('modal-close');
const modalOverlay = document.getElementById('modal-overlay');

function openModal(card) {
    const img = card.querySelector('img').src;
    const brand = card.querySelector('.car-brand').textContent;
    const name = card.querySelector('h3').textContent;
    const meta = card.querySelector('.car-meta').textContent;
    const price = card.querySelector('.car-price').childNodes[0].textContent.trim();
    const oldP = card.querySelector('.car-price small')
        ? card.querySelector('.car-price small').textContent : '';
    const tags = card.querySelector('.tag-row') ? card.querySelector('.tag-row').innerHTML : '';
    const ribbon = card.querySelector('.ribbon') ? card.querySelector('.ribbon').textContent : '';

    document.getElementById('m-img').src = img;
    document.getElementById('m-brand').textContent = brand;
    document.getElementById('m-name').textContent = name;
    document.getElementById('m-meta').textContent = meta;
    document.getElementById('m-price').textContent = price;
    document.getElementById('m-old').textContent = oldP;
    document.getElementById('m-tags').innerHTML = tags;
    document.getElementById('m-ribbon').textContent = ribbon;
    document.getElementById('m-ribbon').style.display = ribbon ? 'inline-block' : 'none';

    modal.classList.add('open');
    document.getElementById('modal-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('open');
    document.getElementById('modal-overlay').classList.remove('open');
    document.body.style.overflow = '';
}

document.addEventListener('click', e => {
    // Ne pas ouvrir modal si on clique sur un bouton
    if (e.target.closest('button')) return;
    const card = e.target.closest('.car-card');
    if (card) openModal(card);
});


modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });