import Experience from './Experience';
import { invitationMarkup } from '../src/markup.mjs';
import { demoEnabled } from '../src/mode.mjs';
export const dynamic='force-dynamic';
export default function Page(){const demo=demoEnabled();return <><div dangerouslySetInnerHTML={{__html:invitationMarkup({demo})}}/><Experience/></>}
