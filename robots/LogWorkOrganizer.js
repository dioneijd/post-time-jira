const state = require('./state.js')
const csv = require('csvtojson')
const readline = require('readline-sync')

async function robot(browser) {
    console.log('>>>> LOG_WORK_ORGANIZER - Starting')
    
    let content = state.Load()
    
    await ReadCsvAndLoadDataToContent()
    DefineWorkLogDate()
    DefineTimeLogForJira()
    SearchIssueIdByLocalDatabaseAndSave()
    await SearchIssueIdByWebsiteAndSave()

    state.Save(content)

    console.log('>>>> LOG_WORK_ORGANIZER - Finished')

    



    
    async function ReadCsvAndLoadDataToContent() {

        const csvParameters = content.paramenters.csv_file
        
        const option = {
            "noheader": csvParameters.noheader,
            "headers": csvParameters.headers,
            "delimiter": csvParameters.delimiter
        }

        const csvPathFile = csvParameters.filePath

        content.workLogData = await csv(option).fromFile(csvPathFile)        
    }

    function DefineWorkLogDate(){

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dec']

        const day = readline.question('Informar o dia (DD): ', { limit: input => input>=1 && input<=31, limitMessage: 'Must be a number between 1 and 31'})
        const month = months[readline.question('Informar o dia (MM): ', { limit: input => input>=1 && input<=12, limitMessage: 'Must be a number between 1 and 12'}) - 1]
        const year = readline.question('Informar o dia (YYYY): ', { limit: input => input>=2020 && input<=2100, limitMessage: 'Must be a number between 2020 and 2030'})


        content.workLogData.forEach( worklog => {
            worklog.workLogDate =  {
                jsStandard: new Date(`${year}-${month}-${day}`),
                jiraStandard: `${day}/${month}/${year} 08:00 PM`
            }            
        })


    }

    function DefineTimeLogForJira(){
        content.workLogData.forEach( workLog => {
            workLog.timeLog = {
                excelStandard: workLog.timeLog,
                jiraStandard: `${workLog.timeLog.substring(0,2)}h ${workLog.timeLog.substring(3,5)}m`,
                hour: workLog.timeLog.substring(0,2),
                minute: workLog.timeLog.substring(3,5),
            }
        })
    }

    function SearchIssueIdByLocalDatabaseAndSave(){
        content.workLogData.forEach( workLog => {

            workLog.jiraIssue = {
                id: "",
                alias: workLog.jiraIssue
            }

            const jiraIssue = content.jiraIssues.find( issue => issue.alias == workLog.jiraIssue.alias )
            
            if (jiraIssue) workLog.jiraIssue.id = jiraIssue.id
            
        })
    }

    async function SearchIssueIdByWebsiteAndSave(){

        const workLogWithoutIssueID = content.workLogData.filter( workLog => workLog.jiraIssue.id == '')

        const workLogPromisses = workLogWithoutIssueID.map( async workLog => {
            const page = await browser.newPage()
            await page.goto(`https://jira.weg.net/browse/${workLog.jiraIssue.alias}`)
            const issueId = await page.$eval('#key-val', el => el.rel)

            workLog.jiraIssue.id = issueId

            const alreadyExist = content.jiraIssues.find(issue => issue.id == issueId)

            if (!alreadyExist) 
                content.jiraIssues.push(workLog.jiraIssue)

            await page.close()
        })

        await Promise.all(workLogPromisses)

    }


        
}

module.exports = robot