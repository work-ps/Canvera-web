# Canvera App — Developer Image Guide

> **Generated:** 2026-03-05
> **Scope:** Every UI location where an image is used, expected, or should be replaced with a real asset.

---

## Table of Contents

1. [Image Inventory Summary](#1-image-inventory-summary)
2. [Existing Image Assets](#2-existing-image-assets)
3. [Landing Page (/)](#3-landing-page-)
4. [Products Listing (/products)](#4-products-listing-products)
5. [Product Detail (/products/:slug)](#5-product-detail-productsslug)
6. [Collections Listing (/collections)](#6-collections-listing-collections)
7. [Collection Detail (/collections/:slug)](#7-collection-detail-collectionsslug)
8. [Own Your Album (/own-your-album)](#8-own-your-album-own-your-album)
9. [Header Dropdowns (Global)](#9-header-dropdowns-global)
10. [Product Finder (Modal)](#10-product-finder-modal)
11. [Auth Pages (/login, /register)](#11-auth-pages-login-register)
12. [Contact Page (/contact)](#12-contact-page-contact)
13. [Video Asset](#13-video-asset)
14. [Favicon & Meta](#14-favicon--meta)
15. [Responsive Behaviour Reference](#15-responsive-behaviour-reference)
16. [Missing / Placeholder Summary](#16-missing--placeholder-summary)

---

## 1. Image Inventory Summary

| Status | Count | Description |
|--------|-------|-------------|
| Real image files | 3 | Logo PNG, Logo SVG, Vite SVG favicon |
| SVG placeholder graphics | 50+ | Inline JSX SVGs standing in for product photos |
| CSS gradient placeholders | 20+ | Color-only backgrounds where images are expected |
| Placeholder video | 1 | Sample video from Google Commons |
| **Total image slots needing real assets** | **~65** | Product photos, hero shots, avatars, banners, video |

---

## 2. Existing Image Assets

### `/public/canvera_logo.png`
- **Used in:** `src/components/common/CanveraLogo.jsx` (line 3)
- **Code:**
  ```jsx
  <img src="/canvera_logo.png" alt="Canvera" height={height} />
  ```
- **Rendered height:** 26px (header), 28px (auth pages)
- **Recommendation:** Keep PNG for now; consider replacing with SVG (`/canvera-logo.svg` already exists but is unused in code)

### `/public/canvera-logo.svg`
- **Used in:** Not referenced in any component (orphan asset)
- **Recommendation:** Either swap `CanveraLogo.jsx` to use this, or delete

### `/public/vite.svg`
- **Used in:** `index.html` line 5 as favicon
- **Code:** `<link rel="icon" type="image/svg+xml" href="/vite.svg" />`
- **Recommendation:** Replace with Canvera-branded favicon (16x16, 32x32, 180x180 apple-touch)

### `/src/assets/react.svg`
- **Used in:** Not referenced (default Vite scaffold leftover)
- **Recommendation:** Delete

---

## 3. Landing Page (`/`)

### 3A. Hero Carousel — Right Side

| Field | Value |
|-------|-------|
| **File** | `src/components/home/Hero.jsx` (lines 14-20) |
| **Component** | `Hero` |
| **Section** | Hero right-side carousel |
| **Current state** | 5 inline SVG illustrations (`carouselSvgs` array) |
| **Container CSS** | `src/styles/hero.css` |
| **Container size** | `200px x 290px` per card, 3 visible, center card elevated |
| **Recommended image** | **400 x 580 px** (@2x retina) |
| **Aspect ratio** | ~2:3 (portrait) |
| **Format** | WebP with JPG fallback |
| **Responsive** | 900px: shrinks to `180 x 260px`; mobile: stacks below text |
| **Notes** | Cards rotate automatically; provide 5 distinct album/product lifestyle shots |

**Code location:**
```jsx
// Hero.jsx lines 14-20
const carouselSvgs = [
  <svg viewBox="0 0 200 290" ...>, // slide 0
  <svg viewBox="0 0 200 290" ...>, // slide 1
  ...
]
```

### 3B. Popular Products — Product Cards (Horizontal Scroll)

| Field | Value |
|-------|-------|
| **File** | `src/components/home/ProductCard.jsx` (lines 13-75, 138-207) |
| **Component** | `ProductCard` |
| **Section** | "Popular Products" horizontal scroll row |
| **Current state** | 8 color-coded SVG variants (`productSvgs` object: petrol, amber, warm, dark, neutral, mixed, leaf, deep) |
| **Container CSS** | `src/styles/popular-products.css` |
| **Container size** | Card: `calc((100% - 48px) / 3)` wide x `400px` tall; image area: full width x `260px` tall |
| **Recommended image** | **700 x 520 px** (@2x for ~350px rendered width) |
| **Aspect ratio** | ~4:3 (landscape) |
| **Format** | WebP with JPG fallback |
| **Responsive** | 900px: card height `330px`, image `210px`; 540px: full-width card |
| **Notes** | Each product has an `imageVariant` key; on hover, a 5-slide carousel plays (see `src/data/productSlides.jsx`) |

**Hover carousel slides:**
```jsx
// src/data/productSlides.jsx — 5 SVG slides per product:
// Slide 1: Open spread view
// Slide 2: Detail/texture close-up
// Slide 3: Spine/side view
// Slide 4: Stacked/multiple albums
// Slide 5: Packaging/box view
```
- **Slide dimensions:** Same as product card image area: **700 x 520 px**
- Currently all products share the same 5 SVG slides — replace with per-product photography

### 3C. Deals Carousel — Promotional Banners

| Field | Value |
|-------|-------|
| **File** | `src/components/home/DealsCarousel.jsx` (lines 12-36) |
| **Component** | `DealsCarousel` |
| **Section** | "Special Offers" auto-rotating strip |
| **Current state** | 4 deal cards with small SVG icons + CSS gradient backgrounds |
| **Container CSS** | `src/styles/deals.css` |
| **Container size** | Full-width strip, `230px` height; background icon `180 x 180px` (decorative, 12% opacity) |
| **Recommended image** | **Full-width banner: 1120 x 230 px** or keep gradient + icon approach |
| **Aspect ratio** | ~5:1 (wide banner) |
| **Format** | SVG for icons, or WebP for photographic banners |
| **Responsive** | 900px: height `220px`, icon `120 x 120px` |
| **Notes** | Current gradient+icon style works well; if switching to photos, provide 4 banner images |

### 3D. Shop By Occasion — Category Cards (Horizontal Scroll)

| Field | Value |
|-------|-------|
| **File** | `src/components/home/Categories.jsx` (line 22) |
| **Component** | `Categories` |
| **Section** | "Shop By Occasion" horizontal row |
| **Current state** | CSS gradient backgrounds only (dynamic `linear-gradient` from `categories.js` data) |
| **Container CSS** | `src/styles/categories.css` |
| **Container size** | Same as product cards in scroll row |
| **Recommended image** | **700 x 520 px** (matches product card dimensions) |
| **Aspect ratio** | ~4:3 |
| **Format** | WebP/JPG |
| **Responsive** | Same as product cards |
| **Notes** | 7 occasions: Weddings, Pre-Wedding, Baby & Kids, Maternity, Birthdays, Corporate, Portraits & Family. Could add lifestyle imagery behind the gradient. |

### 3E. Action Cards — CTA Banners

| Field | Value |
|-------|-------|
| **File** | `src/components/home/ActionCards.jsx` |
| **Component** | `ActionCards` |
| **Section** | Two side-by-side CTA cards ("Join for Free" / "Explore Canvera Experience") |
| **Current state** | CSS gradient backgrounds only |
| **Container CSS** | `src/styles/action-cards.css` |
| **Container size** | 2-column grid within `1120px`, each card `230px` height |
| **Recommended image** | **560 x 230 px** per card (@2x: 1120 x 460) or keep gradient |
| **Aspect ratio** | ~2.4:1 |
| **Format** | WebP/JPG if photographic |
| **Responsive** | 900px: single column, `200px` height |

### 3F. Testimonials — Avatars

| Field | Value |
|-------|-------|
| **File** | `src/components/home/Testimonials.jsx` (lines 28-29) |
| **Component** | `Testimonials` |
| **Section** | "Trusted by Thousands" 3-column grid |
| **Current state** | Colored circle with text initials (e.g. "RS", "PM") |
| **Container CSS** | `src/styles/testimonials.css` |
| **Container size** | `40 x 40px` circle |
| **Recommended image** | **80 x 80 px** (@2x) |
| **Aspect ratio** | 1:1 (circle-cropped) |
| **Format** | WebP/JPG |
| **Responsive** | Same size at all breakpoints |
| **Notes** | 6 testimonials. Profile photos optional — initials work fine for anonymous reviews. |

### 3G. About Canvera — Showcase Icons

| Field | Value |
|-------|-------|
| **File** | `src/components/home/AboutCanvera.jsx` (lines 31-43) |
| **Component** | `AboutCanvera` |
| **Section** | 4-card showcase grid within the about panel |
| **Current state** | Inline SVG icons (album, star, checkmark, building) |
| **Container CSS** | `src/styles/about-canvera.css` |
| **Container size** | Icon container: `40 x 40px` |
| **Recommended image** | Keep as SVG icons — no photo needed |
| **Format** | SVG |
| **Notes** | These are informational icons, not image placeholders. Current SVGs are appropriate. |

### 3H. Offers Banner — Icon Strip

| Field | Value |
|-------|-------|
| **File** | `src/components/home/OffersBanner.jsx` |
| **Component** | `OffersBanner` |
| **Section** | 4-column icon+text banner |
| **Current state** | SVG icons (`48 x 48px`) + gradient background |
| **Container CSS** | `src/styles/banner.css` |
| **Container size** | Icon: `48 x 48px` |
| **Recommended image** | Keep as SVG icons |
| **Format** | SVG |
| **Responsive** | 900px: 2-col; 540px: 1-col |

---

## 4. Products Listing (`/products`)

### 4A. Product Grid Cards

| Field | Value |
|-------|-------|
| **File** | `src/components/products/ProductsPage.jsx` |
| **Component** | `ProductsPage` (reuses `ProductCard` in listing mode) |
| **Section** | Main filterable product grid |
| **Current state** | Same `productSvgs` placeholders as landing page, but in "listing" mode |
| **Container CSS** | `src/styles/products-page.css`, `src/styles/popular-products.css` |
| **Container size** | Grid: `repeat(3, minmax(0, 1fr))` within ~860px main area; card height: `300px`; image area: `210px` |
| **Recommended image** | **560 x 420 px** (@2x for ~280px rendered width) |
| **Aspect ratio** | ~4:3 |
| **Format** | WebP with JPG fallback |
| **Responsive** | 900px: 2-col grid, card `260px`, image `180px`; 540px: 1-col |
| **Notes** | 25 products total. Listing mode cards are shorter than landing page cards. |

---

## 5. Product Detail (`/products/:slug`)

### 5A. Hero Product Image

| Field | Value |
|-------|-------|
| **File** | `src/components/products/ProductDetail.jsx` (lines 113-115) |
| **Component** | `ProductDetail` |
| **Section** | Left half of detail layout — main product showcase |
| **Current state** | SVG variant placeholder (`120 x 120px` icon in center of gradient area) |
| **Container CSS** | `src/styles/product-detail.css` |
| **Container size** | Left column of `1fr 1fr` grid (max ~528px), height: `480px` |
| **Recommended image** | **1056 x 960 px** (@2x) |
| **Aspect ratio** | ~1.1:1 (nearly square) |
| **Format** | WebP with JPG fallback |
| **Responsive** | 900px: full-width, height `320px`; recommend cropping to `1120 x 640px` alt |
| **Notes** | This is the hero product shot — highest priority for real photography. Consider a gallery/carousel of multiple angles. |

### 5B. Product Showcase Tab — Material Icons

| Field | Value |
|-------|-------|
| **File** | `src/components/products/ProductShowcase.jsx` (lines 3-30) |
| **Component** | `ProductShowcase` |
| **Section** | Specifications tabs (Materials, Colors, Sizes, Orientations, Accessories) |
| **Current state** | Inline SVG icons for materials (`24 x 24px`) and orientations (`32 x 24px`) |
| **Container size** | Material icon container: `48 x 48px`; color swatch: `44 x 44px` circle |
| **Recommended image** | Keep as SVG icons |
| **Format** | SVG |

### 5C. Related Products — Horizontal Scroll

| Field | Value |
|-------|-------|
| **File** | `src/components/products/ProductDetail.jsx` |
| **Section** | "You May Also Like" scroll row at bottom |
| **Container size** | Cards: `233px` fixed width (listing mode) |
| **Recommended image** | Same as product listing cards: **560 x 420 px** |
| **Notes** | Reuses `ProductCard` in listing mode |

---

## 6. Collections Listing (`/collections`)

### 6A. Collection Cards Grid

| Field | Value |
|-------|-------|
| **File** | `src/pages/CollectionsPage.jsx` (lines 12-21) |
| **Component** | `CollectionsPage` |
| **Section** | 3-column grid of collection cards |
| **Current state** | SVG variant placeholders (`collectionSvgs`, `64 x 64px` icon) on gradient backgrounds |
| **Container CSS** | `src/styles/collections.css` |
| **Container size** | Grid: `repeat(3, 1fr)`, gap `24px`; image area: full width x `180px` |
| **Recommended image** | **700 x 360 px** (@2x for ~350px rendered width) |
| **Aspect ratio** | ~2:1 (landscape) |
| **Format** | WebP with JPG fallback |
| **Responsive** | 900px: 2-col; 600px: 1-col |
| **Notes** | 9 collections (Celestial, Wood, Leatherette, Suede, Foiling, Luxury, Signature, Fabric, Custom Cover). Each needs a hero image showing representative album from that material range. |

---

## 7. Collection Detail (`/collections/:slug`)

### 7A. Collection Products Grid

| Field | Value |
|-------|-------|
| **File** | `src/pages/CollectionDetailPage.jsx` |
| **Component** | `CollectionDetailPage` |
| **Section** | Products belonging to this collection |
| **Current state** | Reuses `ProductCard` in listing mode (same SVG placeholders) |
| **Container CSS** | `src/styles/collections.css` (`.collection-products-grid`) |
| **Container size** | Grid: `repeat(3, 1fr)`, gap `24px` |
| **Recommended image** | Same as product listing cards: **560 x 420 px** |
| **Responsive** | 900px: 2-col; 600px: 1-col |

---

## 8. Own Your Album (`/own-your-album`)

### 8A. Step 1 — Product Selection Cards

| Field | Value |
|-------|-------|
| **File** | `src/pages/OwnYourAlbumPage.jsx` |
| **Component** | `OwnYourAlbumPage` → Step 1 |
| **Section** | Product grid for album builder |
| **Current state** | SVG placeholders (`56 x 56px` icon) on gradient background |
| **Container CSS** | `src/styles/album-builder.css` |
| **Container size** | Grid: `repeat(3, 1fr)`; card image area: full width x `160px` |
| **Recommended image** | **560 x 320 px** (@2x) |
| **Aspect ratio** | ~16:9 |
| **Format** | WebP with JPG fallback |
| **Responsive** | 900px: 2-col; 520px: 1-col |

### 8B. Step 3 — Design Template Cards

| Field | Value |
|-------|-------|
| **Section** | Design selection scroll row |
| **Container size** | Cards: `120px` wide x `90px` tall |
| **Recommended image** | **240 x 180 px** (@2x) |
| **Aspect ratio** | 4:3 |
| **Format** | WebP/JPG |
| **Notes** | These would show album cover design previews |

### 8C. Step 3 — Color Swatches

| Field | Value |
|-------|-------|
| **Section** | Color selection circles |
| **Container size** | `44 x 44px` circle |
| **Recommended image** | Keep as CSS background colors — no image needed |

### 8D. Step 4 — Accessory Cards

| Field | Value |
|-------|-------|
| **Section** | Accessory selection (box, bag, etc.) |
| **Container size** | Card: `calc(33.333% - 8px)` wide; icon: `40 x 40px` |
| **Recommended image** | **80 x 80 px** SVG icons or small product thumbnails |
| **Format** | SVG preferred |

---

## 9. Header Dropdowns (Global)

### 9A. Collection Panel — Horizontal Scroll Cards

| Field | Value |
|-------|-------|
| **File** | `src/components/layout/Header.jsx` (lines 34-55 for SVGs, 129-162 for panel) |
| **Component** | `Header` → `renderCollectionPanel()` |
| **Section** | "Collection" dropdown — horizontal scroll of 9 collection cards |
| **Current state** | SVG placeholders (`48 x 48px`) on gradient backgrounds with `collectionCardSvgs` |
| **Container CSS** | `src/styles/collection-panel.css` |
| **Container size** | Each card: `250px` fixed width; image area: `aspect-ratio: 5/6` (250 x 300px) |
| **Recommended image** | **500 x 600 px** (@2x) |
| **Aspect ratio** | 5:6 (portrait) |
| **Format** | WebP with JPG fallback |
| **Notes** | 9 cards matching collections data. The panel has a fixed height of `420px`. |

### 9B. Shop Panel — Text-only

- No images needed; menu is text links only.

### 9C. Support Panel — Text-only

- No images needed; menu is text links only.

---

## 10. Product Finder (Modal)

### 10A. Occasion Step — Icon Cards

| Field | Value |
|-------|-------|
| **File** | `src/components/finder/ProductFinder.jsx` (lines 8-14) |
| **Component** | `ProductFinder` |
| **Section** | Step 1: "What's the occasion?" — 7 icon cards |
| **Current state** | Inline SVG icons |
| **Container CSS** | `src/styles/product-finder.css` |
| **Container size** | Grid: `repeat(4, 1fr)`, gap `12px`; icon: `36 x 36px` |
| **Recommended image** | Keep as SVG icons or provide **72 x 72 px** illustrations |
| **Format** | SVG |
| **Responsive** | 700px: 2-col grid |

### 10B. Attribute Step — Icon Cards

| Field | Value |
|-------|-------|
| **File** | `src/components/finder/ProductFinder.jsx` (lines 16-23) |
| **Section** | Step 2: attributes — 4 cards |
| **Container size** | Grid: `repeat(2, 1fr)`; icon: `36 x 36px` |
| **Recommended image** | Keep as SVG |

### 10C. Results Step — Product Thumbnails

| Field | Value |
|-------|-------|
| **File** | `src/components/finder/ProductFinder.jsx` |
| **Section** | Step 3: matching products |
| **Container size** | Grid: `repeat(3, 1fr)`; image area: `120px` height; SVG icon: `48 x 48px` |
| **Recommended image** | **480 x 240 px** (@2x) |
| **Aspect ratio** | 2:1 |
| **Format** | WebP with JPG fallback |
| **Responsive** | 700px: 2-col; 420px: 1-col; image shrinks to `100px` |

---

## 11. Auth Pages (`/login`, `/register`)

### 11A. Sign-Up — Card Stack Illustration

| Field | Value |
|-------|-------|
| **File** | `src/components/auth/SignUp.jsx` |
| **Section** | Left-side decorative card stack |
| **Current state** | Animated CSS cards with SVG icons (`22 x 22px` in `48 x 48px` circle) |
| **Container CSS** | `src/styles/auth.css` |
| **Container size** | Stack area: `260px` height |
| **Recommended image** | Optional — current animated cards look good. Could add a lifestyle background. |

### 11B. File Upload — Portfolio Upload Zone

| Field | Value |
|-------|-------|
| **File** | `src/components/auth/SignUp.jsx` |
| **Section** | Portfolio upload field in sign-up form |
| **Container size** | Drop zone: `min-height: 60px`; icon: `22 x 22px` |
| **Notes** | This is a file input, not a display image. No asset needed. |

### 11C. Confirmation — Success Icon

| Field | Value |
|-------|-------|
| **Section** | Post-registration success screen |
| **Container size** | Hero circle: `72 x 72px`; icon inside: `48 x 48px` |
| **Notes** | Inline SVG checkmark — keep as-is |

---

## 12. Contact Page (`/contact`)

### 12A. Contact Info Icons

| Field | Value |
|-------|-------|
| **File** | `src/components/contact/ContactPage.jsx` |
| **Section** | Left-side contact cards (phone, email, address) |
| **Container size** | Card icon: `22 x 22px` |
| **Notes** | Inline SVG icons — keep as-is |

---

## 13. Video Asset

| Field | Value |
|-------|-------|
| **File** | `src/components/home/VideoOverlay.jsx` (line 5) |
| **Current URL** | `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4` |
| **Container CSS** | `src/styles/hero.css` |
| **Container size** | `width: 92vw; max-width: 960px; max-height: 90vh; aspect-ratio: 16/9` |
| **Recommended video** | **1920 x 1080 px** (1080p) MP4, H.264 |
| **Aspect ratio** | 16:9 |
| **Format** | MP4 (H.264) with WebM fallback |
| **Notes** | Replace sample video with actual Canvera brand/experience video. Also provide a **poster frame** image: `960 x 540 px` WebP. |

---

## 14. Favicon & Meta

| Asset | Current | Recommended |
|-------|---------|-------------|
| Favicon | `/vite.svg` (Vite default) | Canvera-branded `.ico` or `.svg` (32x32) |
| Apple Touch Icon | Missing | `180 x 180 px` PNG |
| OG Image | Missing | `1200 x 630 px` WebP/JPG for social sharing |
| Twitter Card | Missing | `1200 x 600 px` or share OG image |

---

## 15. Responsive Behaviour Reference

| Breakpoint | Layout Changes |
|------------|---------------|
| **Desktop (>900px)** | Full layout: 3-col grids, side-by-side hero, header nav visible |
| **Tablet (<=900px)** | 2-col grids, reduced card heights, sidebar collapses, header becomes burger menu |
| **Mobile (<=540px)** | 1-col grids, full-width cards, stacked hero |

**Key dimensions at each breakpoint:**

| Component | Desktop | Tablet | Mobile |
|-----------|---------|--------|--------|
| Product card height | 400px | 330px | 330px |
| Product card image | 260px | 210px | 210px |
| Listing card height | 300px | 260px | 260px |
| Listing card image | 210px | 180px | 180px |
| Product detail image | 480px | 320px | 320px |
| Hero carousel card | 200x290 | 180x260 | 180x260 |
| Collection card image | 180px | 180px | 180px |
| Header dropdown panel | 420px fixed | hidden (mobile menu) | hidden |
| Testimonial avatar | 40x40 | 40x40 | 40x40 |

---

## 16. Missing / Placeholder Summary

### HIGH PRIORITY (customer-facing product imagery)

| # | Asset | Location | Qty Needed | Size |
|---|-------|----------|------------|------|
| 1 | Product hero photos | Product Detail page | 25 (one per product) | 1056 x 960 px |
| 2 | Product card thumbnails | Landing, Listing, Collections, Finder, Builder | 25 (one per product) | 700 x 520 px |
| 3 | Product hover carousel slides | ProductCard hover state | 25 x 5 = 125 | 700 x 520 px |
| 4 | Hero carousel lifestyle shots | Landing hero right side | 5 | 400 x 580 px |
| 5 | Collection hero images | Collections listing + header dropdown | 9 (one per collection) | 700 x 360 px (listing) + 500 x 600 px (dropdown) |
| 6 | Brand/experience video | Hero video overlay | 1 | 1920 x 1080 MP4 |

### MEDIUM PRIORITY (branding & trust)

| # | Asset | Location | Qty Needed | Size |
|---|-------|----------|------------|------|
| 7 | Favicon (Canvera-branded) | Browser tab | 1 | 32 x 32 SVG/ICO |
| 8 | OG/Social share image | Meta tags | 1 | 1200 x 630 px |
| 9 | Testimonial profile photos | Testimonials section | 6 | 80 x 80 px |
| 10 | Video poster frame | Video overlay | 1 | 960 x 540 px |

### LOW PRIORITY (optional enhancements)

| # | Asset | Location | Qty Needed | Size |
|---|-------|----------|------------|------|
| 11 | Category occasion photos | Shop By Occasion cards | 7 | 700 x 520 px |
| 12 | Action card backgrounds | CTA banners | 2 | 1120 x 460 px |
| 13 | Deal/promo banners | Deals carousel | 4 | 1120 x 460 px |
| 14 | Design template thumbnails | Own Your Album step 3 | ~20 | 240 x 180 px |
| 15 | Apple touch icon | iOS bookmark | 1 | 180 x 180 px |

### TOTAL ESTIMATED IMAGE ASSETS: ~220 files

---

*End of Developer Image Guide*
