# Bogachuk Email Studio

Email template portfolio for iGaming campaigns: table-based HTML, desktop/mobile responsive layout, merge tags, and a pre-send report for mass mailing readiness.

## Live preview

**Demo:** [https://yarilab.github.io/email_marketing_igaming_portfolio/](https://yarilab.github.io/email_marketing_igaming_portfolio/)

**Repository:** [github.com/YariLab/email_marketing_igaming_portfolio](https://github.com/YariLab/email_marketing_igaming_portfolio)

## Local setup

Opening `index.html` via `file://` will not work (the browser blocks template `fetch`). Start a static server from the project root:

```bash
python -m http.server 8765
```

Then open: [http://localhost:8765](http://localhost:8765)

## Templates

| File | Type | Description |
|---|---|---|
| `templates/welcome.html` | Trigger | Welcome / account active |
| `templates/promo-free-spins.html` | Promo | 100 Free Spins |
| `templates/weekend-reload.html` | Promo | Weekend Reload 50% |
| `templates/vip-upgrade.html` | Trigger | Gold VIP upgrade |
| `templates/winback.html` | Win-back | Dormant player reactivation |
| `templates/new-slot.html` | Informational | New slot launch |
| `templates/cashback.html` | Trigger | Weekly cashback |
| `templates/holiday.html` | Seasonal | 12 Days of Bonuses |

## Studio features

- **UA / EN** UI language switch (saved in `localStorage`)
- **Desktop / Mobile** preview toggle
- **Merge tag** generator (`{{first_name}}`, `{{promo_code}}`, etc.)
- Copy / download ready-to-send HTML
- **Pre-send report**: QA, SPF/DKIM/DMARC, campaign release checklist

Email HTML templates stay in English; only the portfolio UI is localized.

## Project structure

```
email_templates/
├── index.html          # portfolio + preview
├── css/portfolio.css
├── js/app.js
├── templates/          # email HTML files
└── README.md
```

## Email markup notes

- Table-based layout (`table` / `role="presentation"`)
- Inline CSS + media queries for mobile
- Preheader, bulletproof CTA, MSO hints for Outlook
- Footer: 18+, T&Cs, unsubscribe / preferences

**Bogachuk Email Studio** is a demo portfolio brand and is not affiliated with a real operator.
