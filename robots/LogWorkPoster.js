const state = require('./state.js')

async function robot(browser) {
    console.log('>>>> LOG_WORK_POSTER - Starting')
    
    let content = state.Load()
    
    await OpenJiraIssueAndPostLogWork()
    
    console.log('>>>> LOG_WORK_POSTER - Finished')





    async function OpenJiraIssueAndPostLogWork() {
        console.log('>>>> LOG_WORK_POSTER - OpenJiraIssueAndPostLogWork - Starting')

        const workLogPromisses = content.workLogData.map( async workLog => {
            
            const page = await browser.newPage()
            await page.goto(`https://jira.weg.net/secure/CreateWorklog!default.jspa?id=${workLog.jiraIssue.id}`)
            
            
            await page.evaluate( () => {
                document.querySelector('#log-work-date-logged-date-picker').value = ''
            })
            
            await page.type('#log-work-time-logged', workLog.timeLog.jiraStandard)
            await page.type('#log-work-date-logged-date-picker', workLog.workLogDate.jiraStandard)            
            await page.type('#comment', workLog.comments)
            await page.click('#log-work-submit')

            await page.waitForSelector('#summary-val')

            page.close()

        })
        
        await Promise.all(workLogPromisses)

        console.log('>>>> LOG_WORK_POSTER - OpenJiraIssueAndPostLogWork - Finished')

    }

}

module.exports = robot