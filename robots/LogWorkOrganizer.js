const state = require('./state.js')
const csv = require('csvtojson')
const readline = require('readline-sync')

async function robot(browser, params) {
    console.log('>>>> LOG_WORK_ORGANIZER - Starting')
    
    let content = state.Load()
    
    await ReadCsvAndLoadDataToContent()
    if (params.csv_file.removeEmptyLines) {
        RemoveEmptyLines()
    }
    DefineWorkLogDate()
    DefineTimeLogForJira()
    SearchIssueIdByLocalDatabaseAndSave()
    await SearchIssueIdByWebsiteAndSave()

    state.Save(content)

    console.log('>>>> LOG_WORK_ORGANIZER - Finished')

    
    
    async function ReadCsvAndLoadDataToContent() {
        console.log('>>>> LOG_WORK_ORGANIZER - ReadCsvAndLoadDataToContent - Starting')

        const csvParameters = params.csv_file
        
        const option = {
            "noheader": csvParameters.noHeader,
            "headers": csvParameters.headers,
            "delimiter": csvParameters.delimiter
        }

        const csvPathFile = csvParameters.filePath

        content.workLogData = await csv(option).fromFile(csvPathFile)        
    }

    function RemoveEmptyLines(){
        console.log('>>>> LOG_WORK_ORGANIZER - RemoveEmptyLines - Starting')

        content.workLogData = content.workLogData.filter( workLog =>
            workLog.timeLog != "00:00" || workLog.comments != ""  || workLog.issueDescription != "" || workLog.jiraIssue != ""        
        )
    }

    function DefineWorkLogDate(){
        console.log('>>>> LOG_WORK_ORGANIZER - DefineWorkLogDate - Starting')

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        let resp, day, month, year, totalDays

        do {
            day = readline.question('Informar o dia (DD): ', { limit: input => input>=1 && input<=31, limitMessage: 'Must be a number between 1 and 31'})
            month = months[readline.question('Informar o dia (MM): ', { limit: input => input>=1 && input<=12, limitMessage: 'Must be a number between 1 and 12'}) - 1]
            year = readline.question('Informar o dia (YYYY): ', { limit: input => input>=2020 && input<=2100, limitMessage: 'Must be a number between 2020 and 2030'})
            
            const inputDate = new Date(`${month}/${day}/${year}`)

            totalDays = Math.floor((new Date().getTime() - inputDate.getTime()) / (1000 * 3600 * 24))
            weekDay = weekDays[inputDate.getDay()]

            resp = readline.question(
                `Do you confirm the date ${weekDay}, ${day}-${month}-${year} (${totalDays} days ago) [Y/n]: `,
                {limit: input => input.toUpperCase() == 'Y' || input.toUpperCase() == 'N'}
            ).toUpperCase()
        
            if (resp != 'Y') console.log('ok... Vamos tentar novamente:')

        } while (resp.toUpperCase() != 'Y')

        content.workLogData.forEach( workLog => {
            workLog.workLogDate =  {
                jsStandard: new Date(`${year}-${month}-${day}`),
                jiraStandard: `${day}/${month}/${year} 08:00 AM`
            }
        })

    }

    function DefineTimeLogForJira(){
        console.log('>>>> LOG_WORK_ORGANIZER - DefineTimeLogForJira - Starting')

        content.workLogData.forEach( workLog => {
            workLog.timeLog = {
                excelStandard: workLog.timeLog,
                jiraStandard: `${workLog.timeLog.substring(0,2)}h ${workLog.timeLog.substring(3,5)}m`,
                hour: workLog.timeLog.substring(0,2),
                minute: workLog.timeLog.substring(3,5),
            }
        })
        console.log('>>>> LOG_WORK_ORGANIZER - DefineTimeLogForJira - Finished')
    }

    function SearchIssueIdByLocalDatabaseAndSave(){
        console.log('>>>> LOG_WORK_ORGANIZER - SearchIssueIdByLocalDatabaseAndSave - Starting')
        content.workLogData.forEach( workLog => {

            workLog.jiraIssue = {
                id: "",
                alias: workLog.jiraIssue
            }

            const jiraIssue = content.jiraIssues.find( issue => issue.alias == workLog.jiraIssue.alias )
            if (jiraIssue) workLog.jiraIssue.id = jiraIssue.id

        })
        console.log('>>>> LOG_WORK_ORGANIZER - SearchIssueIdByLocalDatabaseAndSave - Finished')
    }

    async function SearchIssueIdByWebsiteAndSave(){
        console.log('>>>> LOG_WORK_ORGANIZER - SearchIssueIdByWebsiteAndSave - Starting')

        const workLogWithoutIssueID = content.workLogData.filter( workLog => workLog.jiraIssue.id == '')

        const workLogPromisses = workLogWithoutIssueID.map( async workLog => { 
                        
            const page = await browser.newPage()
            await page.goto(`https://jira.weg.net/browse/${workLog.jiraIssue.alias}`)
            const issueId = await page.$eval('#key-val', el => el.rel)

            workLog.jiraIssue.id = issueId

            const alreadyExist = content.jiraIssues.find(issue => issue.id == issueId)

            if (!alreadyExist && workLog.jiraIssue.id != '' && workLog.jiraIssue.alias != '') 
                content.jiraIssues.push(workLog.jiraIssue)

            await page.close()
        })

        await Promise.all(workLogPromisses)

        console.log('>>>> LOG_WORK_ORGANIZER - SearchIssueIdByWebsiteAndSave - Finished')
    }
            
}

module.exports = robot