from playwright.sync_api import sync_playwright
from pathlib import Path
root=Path(__file__).resolve().parents[1]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for name,vp,reduce in [('desktop',{'width':1440,'height':900},'no-preference'),('mobile',{'width':390,'height':844},'no-preference'),('small',{'width':320,'height':700},'no-preference'),('reduced',{'width':320,'height':700},'reduce')]:
  page=b.new_page(viewport=vp,reduced_motion=reduce);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content((root/'preview.html').read_text());page.locator('#entry-code').fill('DEMO2027');page.locator('#open-button').click();page.locator('#experience[data-phase=reading]').wait_for(timeout=6500)
  album=page.locator('.album-runway'); stage=album.locator('.album-stage'); beats=album.locator('.album-beat'); assert beats.count()==3
  assert page.locator('#experience').get_attribute('data-cinematic')==('off' if reduce=='reduce' else 'on')
  if reduce!='reduce':
   top=album.evaluate('(e)=>e.getBoundingClientRect().top+scrollY');dist=album.evaluate('(e)=>e.offsetHeight-innerHeight');assert dist>vp['height'];
   def sample(progress):
    page.evaluate('(y)=>scrollTo({top:y,behavior:"instant"})',top+dist*progress);page.wait_for_timeout(800)
    return [float(e.evaluate('(e)=>getComputedStyle(e).opacity')) for e in beats.all()]
   for progress,index in [(0.10,0),(.42,1),(.85,2),(.10,0)]:
    op=sample(progress);assert op[index]>.98 and all(op[j]<.02 for j in range(3) if j!=index),(name,progress,op)
    assert abs(stage.evaluate('(e)=>e.getBoundingClientRect().top'))<2,(name,progress,stage.bounding_box());
    for child in beats.nth(index).locator('.album-frame,.album-copy').all():
     r=child.bounding_box();assert r['y']>=-1 and r['y']+r['height']<=vp['height']+1,(name,index,r)
    assert page.evaluate('document.documentElement.scrollWidth===innerWidth'),(name,'overflow')
   page.locator('#chapter-toggle').click();assert page.locator('#chapter-links').is_visible();page.keyboard.press('Escape');page.locator('#chapter-links').wait_for(state='hidden');page.locator('#chapter-toggle').click();page.locator('#chapter-links a[href="#details"]').click();page.wait_for_timeout(1200);assert page.locator('#dock-label').inner_text()=='The day';assert page.locator('#chapter-links').is_hidden();
   page.locator('#cinematic-toggle').click();assert page.locator('#experience').get_attribute('data-cinematic')=='off';assert stage.evaluate('(e)=>getComputedStyle(e).position')!='sticky';assert all(float(e.evaluate('(e)=>getComputedStyle(e).opacity'))==1 for e in beats.all());
   page.locator('#cinematic-toggle').click();assert page.locator('#experience').get_attribute('data-cinematic')=='on'
  else:
   assert stage.evaluate('(e)=>getComputedStyle(e).position')!='sticky';assert all(float(e.evaluate('(e)=>getComputedStyle(e).opacity'))==1 for e in beats.all())
  assert not errors,errors
  print(name,'PASS: '+('static full story' if reduce=='reduce' else '3 pinned beats, reverse, visible bounds, chapter dock, motion toggle')+', no JS errors',flush=True);page.close()
 b.close()
