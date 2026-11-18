from playwright.sync_api import sync_playwright
from pathlib import Path
preview=Path(__file__).resolve().parents[1]/'preview.html'
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for name,vp,reduce in [('desktop',{'width':1440,'height':900},'no-preference'),('mobile',{'width':390,'height':844},'no-preference'),('reduced',{'width':320,'height':700},'reduce')]:
  page=b.new_page(viewport=vp,reduced_motion=reduce,accept_downloads=True)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(preview.read_text());page.locator('#experience[data-initialized="1"]').wait_for()
  assert page.evaluate('document.documentElement.scrollWidth === innerWidth'),name+' horizontal overflow'
  page.locator('#open-button').click();page.locator('#experience[data-phase="reading"]').wait_for(timeout=5000)
  assert page.locator('#arrival').is_hidden()
  page.locator('.swatch[data-color="Ivory"]').click();assert page.locator('#fabric-name').inner_text()=='IVORY'
  page.locator('#tab-men').click();assert page.locator('#look-men').is_visible();page.locator('#tab-men').press('ArrowLeft');assert page.locator('#look-women').is_visible()
  page.locator('#code').fill('WRONG');page.locator('#verify-form button[type=submit]').click();page.locator('#verify-status').get_by_text('not recognized',exact=False).wait_for()
  page.locator('#code').fill('DEMO2027');page.locator('#verify-form button[type=submit]').click();page.locator('#rsvp-form').wait_for()
  page.locator('#guest-name').fill('Test Guest');page.locator('[name=attendance][value=yes]').check();assert page.locator('#attending-fields').is_visible()
  page.locator('#guest-count').select_option('2');page.locator('[name=travel][value=no]').check();page.locator('#rsvp-form button[type=submit]').click();page.locator('#confirmation').wait_for();assert 'PREVIEW ONLY' in page.locator('#confirmed-kicker').inner_text()
  page.locator('#edit-rsvp').click();page.locator('[name=attendance][value=no]').check();assert page.locator('#attending-fields').is_hidden();page.locator('#rsvp-form button[type=submit]').click();page.locator('#confirmation').wait_for();assert 'Thank you' in page.locator('#confirmed-heading').inner_text()
  page.locator('#replay').click();assert page.locator('#arrival').is_visible();page.locator('.arrival-top [data-direct]').click();assert page.locator('#arrival').is_hidden()
  assert not errors,errors
  assert page.evaluate('document.documentElement.scrollWidth === innerWidth'),name+' overflow after open'
  print(name,'PASS: opening, color, keyboard tabs, invalid code, accept, decline, replay, no JS errors')
  page.close()
 b.close()
