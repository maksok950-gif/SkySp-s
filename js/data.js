/* ============================================================
   SkySp — store catalog
   ============================================================ */

window.SKYSP_DATA = {
  featuredOrder: [
    'titan',
    'case-titles',
    'coins-250k',
    'avenger',
    'case-privileges',
    'tokens-1500',
    'overlord',
    'title-legend',
    'coins-1m',
    'magister',
    'case-tokens',
    'title-phoenix'
  ],

  categories: {
    privileges: { label: 'Привилегия', icon: 'crown' },
    cases: { label: 'Донат-кейс', icon: 'chest' },
    currency: { label: 'Валюта', icon: 'coin' },
    tokens: { label: 'Токены', icon: 'token' },
    titles: { label: 'Титул', icon: 'tag' }
  },

  products: [
    {
      id: 'hero',
      category: 'privileges',
      name: 'HERO',
      price: 49,
      oldPrice: 99,
      badge: 'Старт',
      tone: '#d7d4cc',
      icon: 'crown',
      art: 'HERO',
      desc: 'Первый шаг к комфортной игре: базовый набор и приятный бонус к валюте.',
      perks: ['Префикс [HERO] в чате', '/kit hero раз в 24 часа', '+10% к добыче монет']
    },
    {
      id: 'titan',
      category: 'privileges',
      name: 'TITAN',
      price: 149,
      oldPrice: 199,
      badge: 'Хит',
      tone: '#ffd57a',
      icon: 'crown',
      art: 'TITAN',
      desc: 'Уверенный старт с расширенным набором возможностей и приятным бонусом.',
      perks: ['/kit titan · /hat', '/feed · /repair', '+20% к добыче монет']
    },
    {
      id: 'avenger',
      category: 'privileges',
      name: 'AVENGER',
      price: 299,
      oldPrice: 399,
      tone: '#ffc24b',
      icon: 'crown',
      art: 'AVENGER',
      desc: 'Полёт, лечение и ремонт вещей — всё, чтобы играть без лишней суеты.',
      perks: ['Полёт /fly в спавне', '/heal · /feed · /repair', '+30% к добыче монет']
    },
    {
      id: 'overlord',
      category: 'privileges',
      name: 'OVERLORD',
      price: 499,
      oldPrice: 649,
      tone: '#ffb347',
      icon: 'crown',
      art: 'OVERLORD',
      desc: 'Больше свободы: полёт по всему миру, божественный режим и усиленный фарм.',
      perks: ['Все возможности AVENGER', '/fly по всему миру · /god', '+45% к добыче монет']
    },
    {
      id: 'magister',
      category: 'privileges',
      name: 'MAGISTER',
      price: 799,
      oldPrice: 999,
      tone: '#ffa733',
      icon: 'crown',
      art: 'MAGISTER',
      desc: 'Статус мастера: уникальный префикс, доступ к крафту и увеличенный эндер-сундук.',
      perks: ['/craft · /ec · /enderchest', 'Уникальный префикс', '+60% к добыче монет']
    },
    {
      id: 'imperator',
      category: 'privileges',
      name: 'IMPERATOR',
      price: 1299,
      oldPrice: 1599,
      tone: '#ff961f',
      icon: 'crown',
      art: 'IMPERATOR',
      desc: 'Императорский набор: приватные киты, ник и свечение — всё под контролем.',
      perks: ['Приватные киты', '/nick · /glow', '+80% к добыче монет']
    },
    {
      id: 'dragon',
      category: 'privileges',
      name: 'DRAGON',
      price: 1999,
      oldPrice: 2499,
      badge: 'Топ',
      tone: '#ff820f',
      icon: 'crown',
      art: 'DRAGON',
      desc: 'Легендарный статус с титулом в чате и максимальными наградами за онлайн.',
      perks: ['Титул DRAGON в чате', 'Максимальные киты', '+100% к добыче монет']
    },
    {
      id: 'god',
      category: 'privileges',
      name: 'GOD',
      price: 3499,
      oldPrice: 4499,
      badge: 'Max',
      tone: '#ff6a00',
      icon: 'crown',
      art: 'GOD',
      desc: 'Максимальный уровень возможностей. Все привилегии сети и личный менеджер.',
      perks: ['Все привилегии сети', 'Личный менеджер', '+150% к добыче монет']
    },

    {
      id: 'case-titles',
      category: 'cases',
      name: 'Кейс титулов',
      price: 149,
      oldPrice: 199,
      badge: 'New',
      tone: '#e5e1d8',
      icon: 'tag',
      art: 'TITLES',
      desc: 'Один из 12 редких титулов для чата. Самый большой шанс на легендарку среди всех кейсов.',
      perks: ['12 титулов в пуле', 'Легендарный дроп — 4%', 'Мгновенная выдача'],
      drops: [
        { name: 'Титул «Призрак»', chance: 32 },
        { name: 'Титул «Феникс»', chance: 26 },
        { name: 'Титул «Император»', chance: 18 },
        { name: 'Титул «Легенда»', chance: 12 },
        { name: 'Титул «Владыка»', chance: 8 },
        { name: '500 токенов', chance: 4 }
      ]
    },
    {
      id: 'case-privileges',
      category: 'cases',
      name: 'Кейс привилегий',
      price: 249,
      oldPrice: 299,
      tone: '#ffc24b',
      icon: 'crown',
      art: 'PRIV',
      desc: 'Привилегия от HERO до GOD. Один кейс может изменить весь твой сезон.',
      perks: ['7 привилегий в пуле', 'Шанс на GOD — 1%', 'Навсегда на аккаунте'],
      drops: [
        { name: 'Привилегия HERO', chance: 34 },
        { name: 'Привилегия TITAN', chance: 26 },
        { name: 'Привилегия AVENGER', chance: 18 },
        { name: 'Привилегия OVERLORD', chance: 12 },
        { name: 'Привилегия MAGISTER', chance: 6 },
        { name: 'Привилегия DRAGON', chance: 3 },
        { name: 'Привилегия GOD', chance: 1 }
      ]
    },
    {
      id: 'case-tokens',
      category: 'cases',
      name: 'Кейс токенов',
      price: 99,
      tone: '#ff8a1e',
      icon: 'token',
      art: 'TOKENS',
      desc: 'От 50 до 10 000 токенов. Премиальная валюта для кейсов и редкой косметики.',
      perks: ['От 50 до 10 000 токенов', 'Джекпот — 10 000', 'Мгновенная выдача'],
      drops: [
        { name: '50 токенов', chance: 38 },
        { name: '100 токенов', chance: 27 },
        { name: '250 токенов', chance: 17 },
        { name: '500 токенов', chance: 10 },
        { name: '1 000 токенов', chance: 5 },
        { name: '5 000 токенов', chance: 2.5 },
        { name: '10 000 токенов', chance: 0.5 }
      ]
    },
    {
      id: 'case-coins',
      category: 'cases',
      name: 'Кейс монет',
      price: 79,
      tone: '#f4f1e9',
      icon: 'coin',
      art: 'COINS',
      desc: 'От 5 000 до 500 000 игровых монет. Чем больше кейсов — тем выше шанс на джекпот.',
      perks: ['От 5 000 до 500 000', 'Монеты на оба сервера', 'Мгновенная выдача'],
      drops: [
        { name: '5 000 монет', chance: 35 },
        { name: '10 000 монет', chance: 25 },
        { name: '25 000 монет', chance: 18 },
        { name: '50 000 монет', chance: 12 },
        { name: '100 000 монет', chance: 7 },
        { name: '500 000 монет', chance: 3 }
      ]
    },
    {
      id: 'case-mix3',
      category: 'cases',
      name: 'Набор 3 кейса',
      price: 349,
      oldPrice: 447,
      badge: '−22%',
      tone: '#ffb347',
      icon: 'chest',
      art: 'MIX 3',
      desc: 'Три кейса на выбор: титулы, привилегии, токены или монеты. Собери свой идеальный набор.',
      perks: ['3 кейса на выбор', 'Любые категории', 'Экономия 22%']
    },
    {
      id: 'case-mix10',
      category: 'cases',
      name: 'Набор 10 кейсов',
      price: 999,
      oldPrice: 1490,
      badge: '−33%',
      tone: '#ff7a00',
      icon: 'chest',
      art: 'MIX 10',
      desc: 'Десять кейсов микса по максимальной выгоде. Больше попыток — больше легендарного дропа.',
      perks: ['10 кейсов на выбор', 'Любые категории', 'Экономия 33%']
    },

    {
      id: 'coins-10k',
      category: 'currency',
      name: '10 000 монет',
      price: 59,
      tone: '#f5e6b8',
      icon: 'coin',
      art: '10K',
      desc: 'Стартовый капитал для первых покупок, лотов на аукционе и прокачки базы.',
      perks: ['10 000 монет на баланс', 'На оба сервера', 'Мгновенная выдача']
    },
    {
      id: 'coins-50k',
      category: 'currency',
      name: '50 000 монет',
      price: 249,
      oldPrice: 299,
      tone: '#ffd166',
      icon: 'coin',
      art: '50K',
      desc: 'Уверенный запас монет для аукциона, ресурсов и улучшения снаряжения.',
      perks: ['50 000 монет на баланс', 'На оба сервера', 'Мгновенная выдача']
    },
    {
      id: 'coins-250k',
      category: 'currency',
      name: '250 000 монет',
      price: 899,
      oldPrice: 1190,
      badge: 'Хит',
      tone: '#ffc24b',
      icon: 'coin',
      art: '250K',
      desc: 'Крупный баланс для серьёзной игры: редкие ресурсы, киты и лоты без ограничений.',
      perks: ['250 000 монет на баланс', 'На оба сервера', 'Мгновенная выдача']
    },
    {
      id: 'coins-1m',
      category: 'currency',
      name: '1 000 000 монет',
      price: 2990,
      oldPrice: 3990,
      badge: 'Max',
      tone: '#ffb800',
      icon: 'coin',
      art: '1M',
      desc: 'Миллион монет. Максимальный запас для торговли, строительства и доминирования.',
      perks: ['1 000 000 монет', 'На оба сервера', 'Мгновенная выдача']
    },

    {
      id: 'tokens-100',
      category: 'tokens',
      name: '100 токенов',
      price: 89,
      tone: '#ffb26b',
      icon: 'token',
      art: '100 T',
      desc: 'Небольшой запас премиальной валюты для первого кейса или косметики.',
      perks: ['100 токенов на баланс', 'На оба сервера', 'Мгновенная выдача']
    },
    {
      id: 'tokens-500',
      category: 'tokens',
      name: '500 токенов',
      price: 399,
      oldPrice: 445,
      tone: '#ffa14a',
      icon: 'token',
      art: '500 T',
      desc: 'Оптимальный набор для нескольких кейсов и покупки титула в магазине.',
      perks: ['500 токенов на баланс', 'На оба сервера', 'Мгновенная выдача']
    },
    {
      id: 'tokens-1500',
      category: 'tokens',
      name: '1 500 токенов',
      price: 999,
      oldPrice: 1290,
      badge: 'Хит',
      tone: '#ff8a1e',
      icon: 'token',
      art: '1.5K T',
      desc: 'Большой запас токенов для охоты за легендарными титулами и кейсами.',
      perks: ['1 500 токенов на баланс', 'На оба сервера', 'Мгновенная выдача']
    },
    {
      id: 'tokens-5000',
      category: 'tokens',
      name: '5 000 токенов',
      price: 2799,
      oldPrice: 3590,
      badge: 'Max',
      tone: '#ff7a00',
      icon: 'token',
      art: '5K T',
      desc: 'Максимальный пакет токенов. Для тех, кто не привык останавливаться на одном кейсе.',
      perks: ['5 000 токенов на баланс', 'На оба сервера', 'Мгновенная выдача']
    },

    {
      id: 'title-ghost',
      category: 'titles',
      name: 'Титул «Призрак»',
      price: 249,
      tone: '#d7d4cc',
      icon: 'tag',
      art: 'TITLE',
      desc: 'Ледяной титул для тех, кто появляется внезапно и исчезает без следа.',
      perks: ['Титул «Призрак»', 'Особый цвет в чате', 'Навсегда на аккаунте']
    },
    {
      id: 'title-phoenix',
      category: 'titles',
      name: 'Титул «Феникс»',
      price: 349,
      tone: '#ff7a00',
      icon: 'tag',
      art: 'TITLE',
      desc: 'Огненный титул с тёплым градиентом. Возрождайся из пепла красиво.',
      perks: ['Титул «Феникс»', 'Огненный градиент', 'Навсегда на аккаунте']
    },
    {
      id: 'title-legend',
      category: 'titles',
      name: 'Титул «Легенда»',
      price: 599,
      badge: 'Редкий',
      tone: '#ffd57a',
      icon: 'tag',
      art: 'TITLE',
      desc: 'Золотой титул для тех, кого знают в лицо. Заметен в чате, топе и профиле.',
      perks: ['Титул «Легенда»', 'Анимированный градиент', 'Виден в топе донатеров']
    },
    {
      id: 'title-lord',
      category: 'titles',
      name: 'Титул «Владыка»',
      price: 899,
      tone: '#ffb800',
      icon: 'tag',
      art: 'TITLE',
      desc: 'Максимальный статус на сервере. Для тех, кто диктует правила, а не следует им.',
      perks: ['Титул «Владыка»', 'Особый цвет в чате', 'Виден в топе донатеров']
    }
  ]
};
