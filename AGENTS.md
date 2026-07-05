# AGENTS.md — инструкции для ИИ-агентов

Генератор подарочных купонов ProCeramicCar. Статический сайт: Vue 3 + Vite + TypeScript + Naive UI, деплой на GitHub Pages.

## Команды

```bash
npm install            # зависимости
npm run dev            # dev-сервер: http://localhost:5173/pro-ceramic-car-coupon-generator/
npm run build          # vue-tsc -b + vite build + копия dist/index.html → dist/404.html
npm run preview        # прод-превью собранного dist
```

Проверка перед коммитом: `npx vue-tsc -b` чистый и `npm run build` проходит. Не использовать контребьют пометку! Предупреждение «chunk > 500 kB» — известное, принято (Naive UI).

## Архитектура

```
public/
├─ assets/
│  └─ *.png                 # слои купона; плашка номера в двух вариантах: plate.png (чистая) / plate-empty.png (разметка слотов)
└─ fonts/
   ├─ bahnschrift.ttf       # вариативный шрифт (wght 300–700, wdth 75–100%)
   └─ roadnumbers.otf       # шрифт гос номеров (ГОСТ), ПЕРЕСОБРАН — см. инвариант 2
src/
├─ constants/
│  ├─ layout.ts             # ВСЕ координаты/размеры/стили (IMAGES, PLATE_IMAGE, PLATE_SLOTS, пресеты)
│  └─ storage.ts            # STORAGE_KEYS — все ключи localStorage/IndexedDB
├─ types.ts                 # TitleLine, TitleState, TitlePreset, SvgTextSpec, PsdText, PsdImage
├─ store.ts                 # модульный reactive-store (phoneDigits, plateRaw, title, couponCode, keyLoaded)
├─ components/
│  ├─ coupon/
│  │  ├─ CouponSvg.vue      # ЧИСТЫЙ рендер: store → SVG <svg id="coupon-svg" viewBox="0 0 1752 2486">
│  │  ├─ CouponText.vue     # единый <text>-рендер из SvgTextSpec (дефолты: Bahnschrift, #fff, anchor start)
│  │  └─ CouponActions.vue  # тег статуса ключа + кнопки «Печать»/«Скачать PNG» (десктоп — в навбаре, мобайл — в футере)
│  ├─ editor/               # PresetsSection, TitleSection(+TitleLineEditor), PhoneSection, PlateSection, SignatureSection
│  ├─ layout/
│  │  ├─ AppNavbar.vue      # навигация; ≤900px — burger-меню (n-dropdown)
│  │  └─ AppFooter.vue      # футер: слот действий (мобайл) + кредитсы с ссылками Telegram/GitHub
│  └─ ui/                   # переиспользуемые примитивы: EditorSection (заголовок секции + слот),
│                           # KeyStatusTag (индикатор ключа), KeyUploadButton (кнопка + скрытый file-input)
├─ composables/
│  ├─ useMaskedInput.ts     # imask как чистый движок: строка из n-input целиком через createMask().resolve()
│  ├─ usePhone.ts           # маска +7 (000) 000-00-00 поверх useMaskedInput, persist в pcc:phone
│  ├─ usePlate.ts           # маска Б ЦЦЦ ББ ЦЦ[Ц] + транслит латиницы в кириллицу
│  └─ usePresets, useTitleStorage, useSignatureKey (init из IndexedDB — авто, один раз на модуль)
├─ utils/
│  ├─ format.ts             # formatPhone, plateChars, letterSpacing
│  ├─ couponCode.ts         # HMAC-код купона (генерация/проверка)
│  ├─ export.ts             # SVG → canvas → PNG (+pHYs 300 DPI), печать A5; встраивает оба шрифта data-URI
│  ├─ clone.ts              # deepClone (JSON-копия plain-данных)
│  ├─ download.ts           # downloadBlob — скачивание через временную ссылку
│  └─ storage.ts            # readLocal/writeLocal — localStorage за try/catch (приватный режим)
├─ pages/                   # GeneratorPage (/), VerifyPage (/verify)
└─ router.ts                # history-режим + 404.html-фолбэк
```

Стили: БЭМ (`block__element`, блок = kebab-case имени компонента), только scoped-стили компонентов + глобальный `src/style.css`; inline-атрибут `style` в шаблонах запрещён. Брейкпоинт адаптива — 900px во всех media query.

Маски ввода: imask НЕ вешается на DOM (конфликт с внутренним input-обработчиком naive-ui, проверено).
Схема: `n-input :value` + `@update:value` → вся строка через `useMaskedInput` → отформатированное значение назад в `:value`. Известный компромисс: при правке середины строки каретка прыгает в конец.

Адаптив: брейкпоинт 900px. Десктоп — экшены в навбаре, футер с кредитсами под превью; мобайл — burger-меню в навбаре, экшены в футере.

Превью, PNG-экспорт и печать рендерятся из **одного** SVG-узла `#coupon-svg` — расхождение превью/экспорт структурно невозможно. Не ломать этот принцип.

## Жёсткие инварианты (не нарушать)

1. **Числа в `src/constants/layout.ts` — координаты.** Не «улучшать», не округлять, не выводить заново.
2. **Шрифт купона только Bahnschrift.** LightCondensed = wght 300 + wdth 75%, Bold = wght 700 + wdth 100%. Никакого выбора гарнитуры в UI. Исключение: символы гос номера — RoadNumbers (`public/fonts/roadnumbers.otf`). Этот файл ПЕРЕСОБРАН opentype.js: формы строчных а-в-к-м-о-р-с-у-х перемаплены на заглавные, Е/Н/Т синтезированы (штрих 80 юнитов, capH 498). НЕ заменять «оригинальным» roadnumbers.otf из интернета — там нет заглавных букв, символы пропадут.
3. **Гос номер никогда не сохраняется** ни в localStorage, ни в IndexedDB. Телефон (`pcc:phone`) и заголовок (`pcc:title`) — сохраняются. Пресеты — `pcc:userPresets`, ключ подписи — IndexedDB `pcc:sigkey`.
4. **Формат кода купона:** 75 бит = payload 35 (26 бит минут от 2026-01-01 UTC + 9 бит nonce) + HMAC-SHA256, усечённый до 40 бит; Crockford Base32; `PCC-XXXXX-XXXXX-XXXXX`. Менять нельзя — сломает проверку уже выданных купонов. Код генерируется в момент нажатия «Скачать PNG»/«Печать» — купон без загруженного ключа подписи не выдаётся.
5. **Всё локально.** Никаких внешних запросов (CDN, аналитика, API). Ключ подписи не покидает браузер.
6. **Base path в двух местах:** `vite.config.ts` (`base`) и `src/style.css` (пути к ОБОИМ шрифтам в `@font-face`). При переименовании репозитория менять всё.
7. **UI на русском.** Существующие строки не перефразировать без запроса владельца.

## Принятые компромиссы (не «чинить» без запроса)

- `/verify` на GitHub Pages отдаёт HTTP 404 со SPA-телом — штатный фолбэк `404.html`, в браузере всё работает.
- Сравнение MAC не constant-time — вне модели угроз (проверяющий сам держит ключ).
- Каретка прыгает в конец при правке середины телефона/гос номера — плата за imask без DOM-привязки (см. «Маски ввода»).
- Размеры PLATE_SLOTS откалиброваны владельцем вручную под RoadNumbers — не пересчитывать.

## Деплой

Push в `main` → GitHub Actions (`.github/workflows/deploy.yml`) → GitHub Pages:
https://lorexiq.github.io/pro-ceramic-car-coupon-generator/
Репозиторий: `LorexIQ/pro-ceramic-car-coupon-generator`.
