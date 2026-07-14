# Vendor

Third-party libraries used as-is, with no build step, so the app keeps working
offline as a PWA.

- **`qrcodegen.js`** — [QR Code generator library](https://www.nayuki.io/page/qr-code-generator-library)
  by Project Nayuki (MIT License), v1.5.0. Used to render the QR code on the
  business detail page. Exposes `qrcodegen.QrCode.encodeText(text, ecl)` →
  `.toSvgString(border)`.
