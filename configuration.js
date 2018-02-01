const fs       = require('fs-extra')
const path     = require('path')
const os       = require('os')
const inquirer = require('inquirer')
const chalk    = require('chalk')

const configPath = path.resolve(
    os.homedir() , '.ehourator.json'
)

let config

const defaultRequire = value => {
    if (!value)
        return console.log(chalk.red('Enter value'))
    return true
}

async function newConfig() {
    console.log(
        chalk.hex('#ADC6E5').bold("\n Let's configure your ehourator")
    )

    let exists = await fs.exists(configPath)
    let fileConfig
    if (exists)
        fileConfig = await getConfigObj()

    const response = await inquirer.prompt(
        [
            {
                type: 'input',
                name: 'username',
                message: 'Enter your eHour username',
                default: fileConfig && fileConfig.username,
                validate: defaultRequire
            },
            {
                type: 'password',
                name: 'password',
                message: 'Enter your eHour password',
                mask: '*',
                validate: defaultRequire
            },
            {
                type: 'input',
                name: 'url',
                message: 'Enter your eHour login url',
                default: fileConfig && fileConfig.url,
                validate: defaultRequire
            },
            {
                type: 'input',
                name: 'projectName',
                message: 'Enter the project name',
                default: fileConfig && fileConfig.projectName,
                validate: defaultRequire
            },
        ]
    )

    config = Object.assign({}, response)
    config.weekHours = "8,50"
    config.fridayHours = "6,50"
    config.headless = true

    await fs.writeFile(configPath, JSON.stringify(config))
}

async function getConfigObj() {
    let fileConfig = await fs.readFile(configPath, 'utf8')
    return JSON.parse(fileConfig)
}

async function getConfig() {
    let exists = await fs.exists(configPath)
    if (!exists)
        await newConfig()        

    return await getConfigObj()
}

module.exports.getConfig = getConfig
module.exports.newConfig = newConfig