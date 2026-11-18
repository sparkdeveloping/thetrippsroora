# Original family-owned photographs and attire boards
The six approved source images are imported from https://thetrippsroora.netlify.app/ by exact accessible image-description matching. `npm run build` attempts the import automatically if files are absent. To retrieve locally first, run `npm install` and `npm run assets`. Successful imports are optimized to WebP (metadata removed) and can be committed under the canonical names below.

If the original site generates its image tags only in JavaScript, open the original site in Chrome, open DevTools Console, and run:

```js
copy(JSON.stringify([...document.images].map(i=>({alt:i.alt,src:i.currentSrc||i.src}))))
```

Save the copied JSON in a file called `original-assets.json` in the project and run `npm run assets -- --manifest original-assets.json`. The importer accepts only same-origin HTTPS URLs and the six known descriptions. If the site uses cross-origin images or inline data URLs, save the approved images manually instead.

Canonical files: `story-meeting.webp`, `story-promise.webp`, `story-homecoming.webp`, `closing-portrait.webp`, `attire-women.webp`, `attire-men.webp`. The actual photo bytes were not retrievable from the authoring sandbox. No stock models are used. The fallback artwork is not the couple.
