#!/usr/bin/env node

const actions       = require('./actions')
const inquirer      = require('inquirer')
const configuration = require('./configuration')
const chalk         = require('chalk');
const program       = require('commander')

async function menu(config) {
  console.log(
    chalk.hex('#ADC6E5').bold(`\n Project ${config.projectName} \n`)
  )
  const menuOptions = [
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
      name: 'Change configuration',
      value: 'config'
    },
    new inquirer.Separator(),
    {
      name: 'Exit',
      value: 'exit'
    },
  ]
  const optionSelected = await inquirer.prompt([
    {
      type: 'list',
      name: 'option',
      message: 'What do you want to do?',
      choices: menuOptions,
    },
  ])

  try {
    switch (optionSelected.option) {
      case 'bookToday':
        await actions.bookToday(config)
        break
      case 'bookWeek':
        await actions.bookWeek(config)
        break
      case 'config':
        await configuration.newConfig()
        await start()
        break
      default:
        return
    }
  } catch (err) {
    console.log(err)
  }
}

async function start() {
  const config = await configuration.getConfig()

  program
    .option('-d, --day',  'Book today')
    .option('-w, --week', 'Book week until today')
    .parse(process.argv);

  if (program.day)
    await actions.bookToday(config)
  else if (program.week)
    await actions.bookWeek(config)
  else
    await menu(config)
}

;(async function() {
  program
    .version(require('./package.json').version)
  await start()
})()