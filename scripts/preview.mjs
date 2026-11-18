import {readFile,writeFile} from 'node:fs/promises';
import {invitationMarkup} from '../src/markup.mjs';
const css=await readFile(new URL('../app/globals.css',import.meta.url),'utf8');const js=await readFile(new URL('../public/experience.js',import.meta.url),'utf8');
const markup=invitationMarkup({demo:true}).replaceAll('data-src="/media/','data-src="media/');
const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>The Letter Home — Interactive Preview</title><style>${css}</style></head><body>${markup}<script type="module">${js.replaceAll('</script','<\\/script')}</script></body></html>`;
const path=process.argv[2]||new URL('../preview.html',import.meta.url);await writeFile(path,html);console.log('Standalone interactive demo written.');
