# Image Upload Guide

Place images in the matching folder for each page/section.

- `public/images/shared/` for reusable assets across pages
- `public/images/brand/` for logo/brand files
- `public/images/home/` for top page images
- `public/images/vision/` for vision page images
- `public/images/business/` for business page images
- `public/images/pilot/` for pilot page images
- `public/images/progress/` for progress page images
- `public/images/company/` for company page images
- `public/images/contact/` for contact page images
- `public/images/partners/` for partners page images
- `public/images/press/` for press/media assets

Naming suggestion:
- Use sequence names like `01.jpg`, `02.jpg`, or meaningful names like `hero.jpg`, `cover.jpg`.

Recommended formats:
- `.jpg`, `.png`, `.webp`

Recommended sizes:
- Hero images: max width around `1920px`
- Section images: max width around `1200px`

Next.js usage example:

```tsx
<Image src="/images/home/hero.jpg" alt="Hero" width={1920} height={1080} />
```
