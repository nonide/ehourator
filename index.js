const actions = require('./actions')
const inquirer = require('inquirer')
const config = require('./config')

menuOptions = [
  {
    name: 'Book today',
    value: 'bookToday'
  },
  {
    name: 'Book week until today',
    value: 'bookWeek'
  },
  new inquirer.Separator(),
  {
    name: 'Exit',
    value: 'exit'
  },
]

// async function checkData() {

// }

async function menu() {
  console.log(`Project ${config.projectName}`)
  const optionSelected = await inquirer.prompt([
    {
      type: 'list',
      name: 'option',
      message: 'Select what you want to book into eHour',
      choices: menuOptions,
    },
  ])

  try {
    switch (optionSelected.option) {
      case 'bookToday':
        await actions.bookToday()
        break
      case 'bookWeek':
        await actions.bookWeek()
        break
      default:
        return
    }
  } catch (err) {
    console.log(err)
  }
}

;(async function() {
  // await checkData()
  await menu()
})()
