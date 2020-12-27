const puppeteer = require('puppeteer')

const robots = {
    logon: require('./robots/Logon.js'),
    logWorkOrganizer: require('./robots/LogWorkOrganizer.js'),
    logWorkPoster: require('./robots/LogWorkPoster.js')
}


async function start() {

    console.log('>>>> START - Starting') 

    let browser
    await OpenBrowser(true)    

    await robots.logon(browser)
    await robots.logWorkOrganizer(browser)
    await robots.logWorkPoster(browser)

    await browser.close()
    
    console.log('>>>> START - Finished')


    async function OpenBrowser(show){
        let option = {
            timeout: 30000,
            headless: true,
        }

        if (show) option.headless = false 

        browser = await puppeteer.launch(option)
    }
}

start()