const functions = require("firebase-functions");
const ptr = require('puppeteer')
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

const runtimeOpts = {
    timeoutSeconds: 300,
    memory: '512MB'
}

exports.webScrap2 = functions.region('asia-east2').runWith(runtimeOpts)
    .firestore.document('users/{user_id}/items/{item_id}')
    .onCreate(async (snapshot, context) => {
        const nameAndPrice = async (url) => {
            browser = await ptr.launch({
                args: ['--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--disable-gpu'],
                headless: true,
                timeout: 0
            })
            const page = await browser.newPage()
            try {
                await page.goto(url)
            } catch (e) {
                var data = {}
                await browser.close()
                data['name'] = 'error, please delete and try again'
                data['price'] = 'error please delete and try again'
                return data
            }
            await page.waitForSelector('._3e_UQT');
            await page.waitForSelector('.attM6y')

            const retrievePrice = await page.evaluate(async() => {
                const price_HTML =  document.querySelector('._3e_UQT')
                const price = price_HTML.innerHTML
                return price
            })

            const getName = await page.evaluate(async () => {
                const name_HTML = await document.querySelector('.attM6y')
                const name = await name_HTML.textContent
                return name

            })
            await browser.close()
            var data = {}
            data['name'] = await getName
            data['price'] = await retrievePrice
            return data
        }

        const itemID = await context.params.item_id
        const userID = await context.params.user_id
        const obj = await snapshot.data()
        const url = await obj.URL
        const data = await nameAndPrice(url)
        const res2 = await db.collection('users').doc(userID).collection('items').doc(itemID).update(data)
    })


