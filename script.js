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
   FILTRE PAR MARQUE (section Achat)
============================================================ */
document.querySelectorAll('.pill').forEach(pill => {
    pill.addEventListener('click', () => {
        // Activer le bouton cliqué
        document.querySelectorAll('.pill').forEach(p => p.classList.remove('sel'));
        pill.classList.add('sel');

        const brand = pill.dataset.brand; // "all" ou "Toyota" etc.

        document.querySelectorAll('.car-card').forEach(card => {
            if (brand === 'all' || card.dataset.brand === brand) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });

        // Masquer les titres de section si aucune carte visible dans le groupe
        document.querySelectorAll('.cars-group').forEach(group => {
            const visible = [...group.querySelectorAll('.car-card')]
                .some(c => c.style.display !== 'none');
            group.style.display = visible ? 'block' : 'none';
        });
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

// Ouvrir au clic sur une carte
document.addEventListener('click', e => {
    const card = e.target.closest('.car-card');
    if (card) openModal(card);
});

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });