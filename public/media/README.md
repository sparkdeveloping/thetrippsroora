# Approved family media

The four couple photographs and two original outfit boards are unchanged. Their SHA-256 hashes are recorded in `originals.json`. All twenty derived looks are literal crops of these boards, with no recoloring; `looks/manifest.json` records the source, rectangle, dimensions, byte count, and source hash.

Run `npm run assets` to validate all 26 files. Run `npm run looks` only when regenerating the derived crops. The mandatory build check decodes the images and verifies the approved original hashes. No network import is required.

The photographs illustrate the relationship; they are not verified images of the historical dates described in the story. Everything in this directory is publicly addressable when hosted. Do not place a private venue address, invitation codes, or guest records here.
