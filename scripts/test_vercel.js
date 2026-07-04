import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => {
    console.log('REQUEST FAILED:', request.url(), request.failure().errorText);
  });

  console.log('Navigating to vercel...');
  await page.goto('https://shivasanjay.vercel.app/#experience', { waitUntil: 'networkidle2' });
  
  console.log('Reloading page to simulate the bug...');
  await page.reload({ waitUntil: 'networkidle2' });
  
  // Wait a bit to see if anything crashes
  await new Promise(r => setTimeout(r, 5000));
  
  await browser.close();
})();
