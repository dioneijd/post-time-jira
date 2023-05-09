const readline = require('readline-sync')


async function robot(browser, sysParams) {
    console.log('>>>> LOGON - Starting')

    let page
    
    await OpenJiraSite()
    
    if (sysParams.askJiraCredential){
        const credential = await AskPasswordAndReturnCredentialObject()
        await MakeJiraLogin(credential)
    }

    await page.waitForNavigation()

    console.log('>>>> LOGON - Finished')



    async function AskPasswordAndReturnCredentialObject() {
        let cred = {
            user: readline.question('Type your user login: '),
            password: readline.question('Type your password: ', {hideEchoBack: true}),
        }
        return cred
    }

    async function OpenJiraSite(){
        page = await browser.newPage()
        await page.goto(sysParams.jiraUrl)
    }

    async function MakeJiraLogin(credential){    
        await page.type('#login-form-username', credential.user)
        await page.type('#login-form-password', credential.password)
        await page.click('#login, #login-form-submit')
        
        await page.waitForNavigation()
    }

}


module.exports = robot