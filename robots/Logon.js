const readline = require('readline-sync')


async function robot(browser) {
    console.log('>>>> LOGON - Starting')
    
    const credential = await AskPasswordAndReturnCredentialObject()
    await GotoJiraAndMakeLogin(credential)

    console.log('>>>> LOGON - Finished')



    async function AskPasswordAndReturnCredentialObject() {
        let cred = {
            // user: readline.question('Type your user login: '),
            // password: readline.question('Type your password: ', {hideEchoBack: true}),
            user: 'dioneid',
            password: 'asd.,123'
        }
        return cred
    }

    async function GotoJiraAndMakeLogin(credential){    
        const page = await browser.newPage()
        await page.goto('https://jira.weg.net')
    
        await page.type('#login-form-username', credential.user)
        await page.type('#login-form-password', credential.password)
        await page.click('#login, #login-form-submit')
        
        await page.waitForNavigation()        
    }

}


module.exports = robot