const app = require("../server/index")
const puppeteer = require("puppeteer")
jest.setTimeout(10000);

const PORT = 3000
describe("Memory tests with puppeteer", function() {
    let browser = null
    let instance = null
    it("Test for detached hmlt elements - 1 element on heap", async function() {
        // try {
        //  Arrange
        instance = app.listen(PORT);
        console.log('Listening on port: ', PORT);

        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-dev-shm-usage', '--js-flags=--expose-gc']
        });
        const page = await browser.newPage();
        let pageToLoad = `http://localhost:${PORT}/mem_leak.html`
        await page.goto(pageToLoad, { waitUntil: "networkidle0" });
        const searchResultSelector = '#container';
        await page.waitForSelector(searchResultSelector);
        //   Act
        let btn = await page.waitForSelector('button[name="add"]');
        for (let i = 1; i <= 100; i++) {
            await btn.click()
        }

        // trigger the garbage collector
        await page.evaluate(() => gc());


        const prototypeHandle = await page.evaluateHandle(() => HTMLDivElement.prototype);
        //Search through heap for this protoType
        const objectsHandle = await page.queryObjects(prototypeHandle);

        const numberOfElementsOnHeap = await page.evaluate((instances) => instances.length, objectsHandle);

        expect(numberOfElementsOnHeap).toEqual(1)
        await browser.close();
        instance.close(() => {})
        // } catch (error) {
        //     console.log(error);
        //     if (browser) {
        //         await browser.close();
        //         instance.close(() => {})

        //     }
        // }
    });

});