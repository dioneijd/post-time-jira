const readline = require('readline-sync')

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dec']
let resp, day, month, year

do {
    day = readline.question('Informar o dia (DD): ', { limit: input => input>=1 && input<=31, limitMessage: 'Must be a number between 1 and 31'})
    month = months[readline.question('Informar o dia (MM): ', { limit: input => input>=1 && input<=12, limitMessage: 'Must be a number between 1 and 12'}) - 1]
    year = readline.question('Informar o dia (YYYY): ', { limit: input => input>=2020 && input<=2100, limitMessage: 'Must be a number between 2020 and 2030'})

    resp = readline.question(`Do you confirm the date ${day}-${month}-${year} [Y/n]: `, {limit: input => input.toUpperCase() == 'Y' || input.toUpperCase() == 'N'}).toUpperCase()

    if (resp != 'Y') console.log('ok... Vamos tentar novamente:')

} while (resp != 'Y')