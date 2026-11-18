from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w,h in [(1440,900),(1200,760),(390,844),(320,700)]:
  page=b.new_page(viewport={'width':w,'height':h},reduced_motion='no-preference'); errs=[];page.on('pageerror',lambda err:errs.append(str(err)))
  page.set_content((root/'preview.html').read_text());page.locator('#experience[data-initialized="1"]').wait_for();assert page.locator('.chapter-nav').is_hidden()
  page.locator('#entry-code').fill('DEMO2027');page.locator('#open-button').click();page.locator('#experience[data-phase=reading]').wait_for(timeout=7000)
  page.wait_for_function("[...document.querySelectorAll('.album-runway img')].every(i=>i.complete && i.naturalWidth>0 && !i.hidden)");
  page.locator('#chapter-toggle').click();page.wait_for_timeout(400);r=page.locator('#chapter-links').bounding_box();assert r['x']>=0 and r['y']>=0 and r['x']+r['width']<=w+1 and r['y']+r['height']<=h+1,(w,r)
  page.locator('#chapter-links a[href="#story"]').click();page.wait_for_timeout(800)
  page.screenshot(path=str(root.parent/f'v42-album-{w}.png'))
  page.locator('#chapter-toggle').click();page.locator('#chapter-links a[href="#attire"]').click();page.wait_for_timeout(600);page.locator('#look-women img').wait_for(state='visible');assert page.locator('#look-women img').evaluate('(i)=>i.naturalWidth')>0
  page.locator('#tab-men').click();page.locator('#look-men img').wait_for(state='visible');assert page.locator('#look-men img').evaluate('(i)=>i.naturalWidth')>0
  page.locator('#replay').scroll_into_view_if_needed();page.locator('#replay').click();assert page.locator('.chapter-nav').is_hidden();assert not errs,errs
  print(w,'PASS actual photos, navigation bounds, replay hidden',flush=True);page.close()
 b.close()
