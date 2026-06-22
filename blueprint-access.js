(function () {
  'use strict';

  var INGREDIENTS = [
    {
      emoji: '🌰',
      ayurvedic: 'Badam / Almond',
      scienceEquivalents: ['Jojoba Oil', 'Squalane'],
      description: 'Provides antioxidant protection, supports barrier repair, and softens without clogging pores.',
      category: ['Barrier Repair', 'Moisturizing'],
    },
    {
      emoji: '✨',
      ayurvedic: 'Kumkumadi / Saffron Elixir',
      scienceEquivalents: ['Vitamin C', 'Niacinamide'],
      description: 'Brightens and helps improve the look of uneven skin tone. The OG glow serum.',
      category: ['Brightening', 'Youth-Preserving', 'Moisturizing'],
    },
    {
      emoji: '☘️',
      ayurvedic: 'Gotu Kola / Indian Pennywort',
      scienceEquivalents: ['Panthenol', 'Peptides'],
      description: 'Supports barrier repair, promotes visible skin firmness, soothes visible redness.',
      category: ['Barrier Repair', 'Youth-Preserving', 'Soothing'],
    },
    {
      emoji: '🪵',
      ayurvedic: 'Chandan / Sandalwood',
      scienceEquivalents: ['Bisabolol', 'Azelaic Acid'],
      description: 'Soothes, purifies, and supports the skin barrier. A love letter to sensitive skin.',
      category: ['Soothing', 'Blemish Control'],
    },
    {
      emoji: '🌿',
      ayurvedic: 'Neem / Indian Lilac',
      scienceEquivalents: ['Azelaic Acid', 'Niacinamide'],
      description: 'Helps support clearer-looking skin and balance excess oil.',
      category: ['Soothing', 'Blemish Control'],
    },
    {
      emoji: '🪻',
      ayurvedic: 'Bakuchi / Bakuchiol',
      scienceEquivalents: ['Retinol', 'Peptides'],
      description: 'Helps improve the appearance of firmness and smoothness without irritation.',
      category: ['Youth-Preserving', 'Soothing', 'Brightening'],
    },
    {
      emoji: '🌸',
      ayurvedic: 'Gulab / Rose',
      scienceEquivalents: ['Hyaluronic Acid', 'Panthenol'],
      description: 'Rose water hydrates, while rose oil moisturizes; both soothe and help refine the look of pores.',
      category: ['Moisturizing', 'Soothing'],
    },
    {
      emoji: '🫚',
      ayurvedic: 'Haldi / Turmeric',
      scienceEquivalents: ['Vitamin C', 'Niacinamide'],
      description: 'Antioxidant-rich, helps brighten and improve the look of post-blemish marks.',
      category: ['Brightening', 'Blemish Control', 'Barrier Repair'],
    },
    {
      emoji: '🍈',
      ayurvedic: 'Amla / Gooseberry',
      scienceEquivalents: ['Vitamin C', 'Peptides'],
      description: 'Antioxidant-rich, helps improve the look of dark spots. Natural vitamin C source.',
      category: ['Brightening', 'Youth-Preserving'],
    },
    {
      emoji: '🧘🏻‍♀️',
      ayurvedic: 'Ashwagandha / Indian Ginseng',
      scienceEquivalents: ['Rhodiola Rosea', 'Niacinamide'],
      description: 'Helps support skin exposed to environmental and lifestyle stressors.',
      category: ['Soothing', 'Youth-Preserving'],
    },
    {
      emoji: '🟡',
      ayurvedic: 'Besan / Chickpea Flour',
      scienceEquivalents: ['Colloidal Oatmeal', 'Kaolin Clay'],
      description: "Helps buff away the look of dullness, absorbs excess oil, and soothes while brightening skin's appearance.",
      category: ['Cleansing', 'Brightening'],
    },
    {
      emoji: '🤎',
      ayurvedic: 'Mulethi / Licorice Root',
      scienceEquivalents: ['Alpha-Arbutin', 'Tranexamic Acid'],
      description: 'Helps visibly reduce the appearance of uneven pigmentation.',
      category: ['Brightening', 'Soothing'],
    },
    {
      emoji: '🏔️',
      ayurvedic: "Multani Mitti / Fuller's Earth",
      scienceEquivalents: ['Kaolin Clay', 'Salicylic Acid'],
      description: 'Draws out impurities, absorbs excess oil, and helps calm the look of redness.',
      category: ['Cleansing', 'Soothing', 'Blemish Control'],
    },
    {
      emoji: '🧈',
      ayurvedic: 'Ghee / Clarified Butter',
      scienceEquivalents: ['Shea Butter', 'Ceramides'],
      description: 'Deeply nourishes and helps support the skin barrier.',
      category: ['Moisturizing', 'Barrier Repair', 'Soothing'],
    },
    {
      emoji: '🪴',
      ayurvedic: 'Tulsi / Holy Basil',
      scienceEquivalents: ['Rhodiola Rosea', 'Azelaic Acid'],
      description: 'Helps calm the appearance of blemish-prone and stressed-looking skin. Sacred and scientific.',
      category: ['Blemish Control', 'Soothing', 'Youth-Preserving'],
    },
    {
      emoji: '🥥',
      ayurvedic: 'Nariyal Tel / Coconut Oil',
      scienceEquivalents: ['Shea Butter', 'Jojoba Oil'],
      description: 'Deeply moisturizes and conditions the body and hair.',
      category: ['Moisturizing', 'Soothing'],
    },
  ];

  var CATEGORIES = [
    'All',
    'Barrier Repair',
    'Brightening',
    'Youth-Preserving',
    'Soothing',
    'Blemish Control',
    'Moisturizing',
    'Cleansing',
  ];

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderFilters() {
    var container = document.querySelector('.bp-filters-scroll');
    if (!container) return;

    CATEGORIES.forEach(function (cat) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'bp-filter-btn' + (cat === 'All' ? ' bp-filter-btn--active' : '');
      btn.textContent = cat;
      btn.setAttribute('data-category', cat);
      btn.setAttribute('aria-pressed', cat === 'All' ? 'true' : 'false');
      btn.addEventListener('click', function () {
        setFilter(cat);
      });
      container.appendChild(btn);
    });
  }

  function setFilter(category) {
    document.querySelectorAll('.bp-filter-btn').forEach(function (btn) {
      var isActive = btn.getAttribute('data-category') === category;
      btn.classList.toggle('bp-filter-btn--active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    document.querySelectorAll('.bp-card').forEach(function (card) {
      var cats = card.getAttribute('data-categories').split(',');
      var visible = category === 'All' || cats.indexOf(category) !== -1;
      card.classList.toggle('bp-card--hidden', !visible);
    });
  }

  function createCard(ingredient) {
    var card = document.createElement('article');
    card.className = 'bp-card';
    card.setAttribute('role', 'listitem');
    card.setAttribute('data-categories', ingredient.category.join(','));

    var scienceHtml = ingredient.scienceEquivalents.map(function (eq) {
      return '<span class="bp-science-tag">' + escapeHtml(eq) + '</span>';
    }).join('');

    var categoryHtml = ingredient.category.map(function (cat) {
      return '<span class="bp-category-tag">' + escapeHtml(cat) + '</span>';
    }).join('');

    card.innerHTML =
      '<div class="bp-card-accent" aria-hidden="true"></div>' +
      '<div class="bp-card-emoji" aria-hidden="true">' + ingredient.emoji + '</div>' +
      '<h2 class="bp-card-name">' + escapeHtml(ingredient.ayurvedic) + '</h2>' +
      '<p class="bp-card-shares-label">Shares benefits with</p>' +
      '<div class="bp-card-science">' + scienceHtml + '</div>' +
      '<hr class="bp-card-rule">' +
      '<p class="bp-card-description">' + escapeHtml(ingredient.description) + '</p>' +
      '<div class="bp-card-categories">' + categoryHtml + '</div>';

    return card;
  }

  function renderGrid() {
    var grid = document.getElementById('bp-grid');
    if (!grid) return;

    INGREDIENTS.forEach(function (ingredient) {
      grid.appendChild(createCard(ingredient));
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderFilters();
    renderGrid();
  });
}());
