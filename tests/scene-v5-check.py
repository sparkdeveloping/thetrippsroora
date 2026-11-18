from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w,h,rm in [(1440,900,'no-preference'),(390,844,'no-preference'),(320,700,'no-preference'),(390,844,'reduce')]:
  page=b.new_page(viewport={'width':w,'height':h},reduced_motion=rm);errs=[];page.on('pageerror',lambda err:errs.append(str(err)))
  page.set_content((root/'preview.html').read_text());page.locator('#entry-code').fill('DEMO2027');page.locator('#open-button').click();page.locator('#experience[data-phase=reading]').wait_for(timeout=8000)
  assert page.locator('.union-path').count()==2
  assert page.locator('.calendar-days span').count()==35
  assert page.locator('.calendar-selected').inner_text()=='01'
  def stage_at(sel,ratio):
   page.locator(sel).evaluate('(el,p)=>{const r=el.getBoundingClientRect();scrollTo({top:scrollY+r.top+Math.max(0,r.height-el.firstElementChild.offsetHeight)*p,behavior:"instant"})}',ratio);page.wait_for_timeout(600)
  if rm=='no-preference':
   stage_at('.union-runway' if w<761 else '.heritage-runway',.1);u1=float(page.locator('.union-art').evaluate("el=>el.style.getPropertyValue('--union-draw')") or 0)
   stage_at('.union-runway' if w<761 else '.heritage-runway',.94);u2=float(page.locator('.union-art').evaluate("el=>el.style.getPropertyValue('--union-draw')") or 0);assert u2>u1,(w,u1,u2)
   page.screenshot(path=str(root.parent/f'v5-union-{w}.png'))
   stage_at('.calendar-runway',.15);c1=float(page.locator('.calendar-runway').evaluate("el=>el.style.getPropertyValue('--cal-reveal')") or 0)
   stage_at('.calendar-runway',.94);c2=float(page.locator('.calendar-runway').evaluate("el=>el.style.getPropertyValue('--cal-reveal')") or 0);assert c2>c1,(w,c1,c2)
   page.screenshot(path=str(root.parent/f'v5-calendar-{w}.png'))
   stage_at('.calendar-runway',.15);c3=float(page.locator('.calendar-runway').evaluate("el=>el.style.getPropertyValue('--cal-reveal')") or 0);assert c3<c2,(w,c3,c2)
  page.locator('#attire').evaluate('el=>el.scrollIntoView()');page.locator('#look-women .look-track').scroll_into_view_if_needed();page.wait_for_function("document.querySelector('#look-women .look-crop img').naturalWidth>0",timeout=5000)
  page.locator('#scrub-women').fill('7');page.wait_for_timeout(300);assert page.locator('#look-women .look-index').inner_text()=='08 / 10',page.locator('#look-women .look-index').inner_text()
  page.locator('#scrub-women').fill('9');page.wait_for_timeout(300);assert page.locator('#look-women .look-index').inner_text()=='10 / 10';page.locator('#look-women .look-prev').click();page.wait_for_timeout(700);assert page.locator('#look-women .look-index').inner_text()=='09 / 10'
  page.locator('#tab-men').click();page.locator('#look-men .look-track').scroll_into_view_if_needed();page.wait_for_function("document.querySelector('#look-men .look-crop img').naturalWidth>0",timeout=5000);page.locator('#scrub-men').fill('3');page.wait_for_timeout(300);assert page.locator('#look-men .look-index').inner_text()=='04 / 10'
  page.screenshot(path=str(root.parent/f'v5-attire-{w}-{rm}.png'));assert page.evaluate('document.documentElement.scrollWidth <= innerWidth+1');assert not errs,errs
  print(w,h,rm,'PASS',flush=True);page.close()
 b.close()
