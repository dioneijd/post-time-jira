const puppeteer = require('puppeteer')
const robot = require('./robots/LogWorkPoster.js')

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






    
    // await jiraLogon(cred)



    // const wrkLog = {
    //     id: '179820',
    //     time: '1m',
    //     date: '15/Dec/20 08:00 PM',
    //     comment: 'test comment'
    // }

    // await postWorkLog(wrkLog)
    
    // console.log('>>>> RUN - Finished')





    
    
    // console.log('>>>>>> log2 - INICIO')
    // //const issueId = await page.$eval('#key-val', el => el.rel)
    // //await page2.goto(`https://jira.weg.net/secure/CreateWorklog!default.jspa?id=${issueId}`)
    // const page2 = await browser.newPage()
    // await page2.goto('https://jira.weg.net/secure/CreateWorklog!default.jspa?id=179820')
    
    // await page2.evaluate(() => {
    //     console.log('>>>>>> log2.1')    
    //     document.querySelector('#log-work-time-logged').value = '1m'
    //     document.querySelector('#log-work-date-logged-date-picker').value = '15/Dec/20 08:00 PM'
    //     document.querySelector('#comment').value = 'Test comment'

    //     document.querySelector('#log-work-submit').click()
    // })

    
    // console.log('>>>>>> log2.2')   

    // await page2.waitForNavigation()

    // page2.close()

    // console.log('>>>>>> log2 - FIM')    

}





// async function jiraLogon (credentials) {

//     console.log('>>>> Jira Login - Starting')

//     browser = await puppeteer.launch({ headless: false})

//     const page = await browser.newPage()
//     await page.goto('https://jira.weg.net')

//     await page.type('#login-form-username', credentials.user)
//     await page.type('#login-form-password', credentials.password)
//     await page.click('#login, #login-form-submit')
    
//     await page.waitForNavigation()
        
//     console.log('>>>> Jira Login - Finished')

// }


// async function postWorkLog (worklog) {
//     console.log('>>>> Post Work Log - Starting')

//     const page = await browser.newPage()
//     await page.goto('https://jira.weg.net/secure/CreateWorklog!default.jspa?id=179820')
    
//     await page.evaluate(() => {
//         document.querySelector('#log-work-time-logged').value = '1m'
//         document.querySelector('#log-work-date-logged-date-picker').value = '15/Dec/20 08:00 PM'
//         document.querySelector('#comment').value = 'Test comment'

//         document.querySelector('#log-work-submit').click()
//     })

//     await page.waitForNavigation()
//     page.close()

//     console.log('>>>> Post Work Log - Finished')
// }


start()