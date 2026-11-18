from playwright.sync_api import sync_playwright
from pathlib import Path
root=Path(__file__).resolve().parents[1]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for name,vp,reduce in [('desktop',{'width':1440,'height':900},'no-preference'),('mobile',{'width':390,'height':844},'no-preference'),('reduced',{'width':320,'height':700},'reduce')]:
  page=b.new_page(viewport=vp,reduced_motion=reduce);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content((root/'preview.html').read_text());page.locator('#entry-code').fill('DEMO2027');page.locator('#open-button').click();page.locator('#experience[data-phase=reading]').wait_for(timeout=6000)
  assert page.locator('[data-cine]').count()==12
  assert page.locator('#experience').get_attribute('data-cinematic')==('off' if reduce=='reduce' else 'on')
  if reduce!='reduce':
   for selector,visual in [('.memory-scene','.photo'),('.heritage-art','.rings'),('.ticket-stage','.ticket-date strong'),('.palette-card','.fabric-folds'),('.reply-intro','.reply-depth')]:
    target=page.locator(selector).first;child=target.locator(visual).first
    top=target.evaluate('(e)=>e.getBoundingClientRect().top+scrollY');height=target.evaluate('(e)=>e.offsetHeight');h=vp['height'];pos=max(0,top-h*.7);mid=top+height*.3-h*.2
    def sample(y):
     page.evaluate('(y)=>scrollTo({top:y,behavior:"instant"})',y);page.wait_for_timeout(700)
     return float(target.evaluate('(e)=>e.style.getPropertyValue("--cine-p")')),child.evaluate('(e)=>getComputedStyle(e).transform')
    a,at=sample(pos);c,ct=sample(mid);d,dt=sample(pos)
    assert a<c and at!=ct,(name,selector,a,c,at,ct);assert abs(a-d)<.02,(name,selector,a,d)
    assert page.evaluate('document.documentElement.scrollWidth===innerWidth'),(name,selector,'overflow')
   page.locator('#cinematic-toggle').click();assert page.locator('#experience').get_attribute('data-cinematic')=='off';assert page.locator('.memory-stage .photo').first.evaluate('(e)=>getComputedStyle(e).transform')=='none'
   page.locator('#cinematic-toggle').click();assert page.locator('#experience').get_attribute('data-cinematic')=='on'
  else:
   assert page.locator('.memory-stage .photo').first.evaluate('(e)=>getComputedStyle(e).transform')=='none';assert page.locator('.memory-stage').first.evaluate('(e)=>getComputedStyle(e).position')!='sticky'
  assert not errors,errors
  print(name,'PASS: cinematic state, '+('reduced-motion fallback' if reduce=='reduce' else 'five scene transforms, reversal, motion toggle')+', no JS errors',flush=True);page.close()
 b.close()
