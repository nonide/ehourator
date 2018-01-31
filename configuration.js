const fs = require('fs-extra')
const path = require('path')
const os = require('os')
const inquirer = require('inquirer')

const configPath =  path.resolve(os.homedir() , '.ehourator.json')

let config

async function newConfig() {
    console.log("Let's configure your ehourator")
    console.log('-----------------------------------------')

    const response = await inquirer.prompt(
        [
            {
                type: 'input',
                name: 'username',
                message: 'Enter your eHour username',
            },
            {
                type: 'password',
                name: 'password',
                message: 'Enter your eHour password',
            },
            {
                type: 'input',
                name: 'url',
                message: 'Enter your eHour LOGIN URL',
            },
            {
                type: 'input',
                name: 'projectName',
                message: 'Enter the project name',
            },
        ]
    )

    config = Object.assign({}, response)
    config.weekHours = "8,50"
    config.fridayHours = "6,50"
    config.headless = true

    await fs.writeFile(configPath, JSON.stringify(config))
}

async function getConfig() {
    let exists = await fs.exists(configPath)
    if (!exists)
        await newConfig()        

    let fileConfig = await fs.readFile(configPath, 'utf8')
    return JSON.parse(fileConfig)
}

module.exports.getConfig = getConfig
module.exports.newConfig = newConfig