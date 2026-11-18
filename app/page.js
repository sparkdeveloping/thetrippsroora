import Script from 'next/script';
import { invitationMarkup } from '../src/markup.mjs';
export default function Page(){const demo=process.env.NODE_ENV==='development' && process.env.ALLOW_DEMO==='1';return <><div dangerouslySetInnerHTML={{__html:invitationMarkup({demo})}}/><Script src="/experience.js" strategy="afterInteractive" type="module"/></>}
