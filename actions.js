const puppeteer   = require('puppeteer')
const config      = require('./config')

const projectName = config.projectName

// position of inputs in eHour app
const inputDays   = [7, 11, 15, 19, 23]
const today = new Date().getDay()

const sel = {
  login: {
    username: '#username',
    password: '#password',
    button:   '#loginSubmit'
  },
  saveButton: '#submitButtonTop',
}

let browser, page

function getStringDay(day) {
  return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][day - 1]
}

async function login() {
  await page.click(sel.login.username)
  await page.keyboard.type(config.username)

  await page.click(sel.login.password)
  await page.keyboard.type(config.password)

  await page.click(sel.login.button)
  await page.waitForSelector(sel.saveButton)  
}

async function init() {
  browser = await puppeteer.launch({
    headless: config.headless
  })
  page = await browser.newPage()
  await page.goto(config.url)

  await login()
}

async function saveAndClose() {
  await page.click(sel.saveButton)
  await page.waitFor(1000)
  await browser.close()
}

async function bookInput(day) {
  let hours = config.weekHours
  if (day === 5)
    hours = config.fridayHours

  let input = inputDays[day - 1]

  const inputId = await page.evaluate((projectName, input) => {
    return [...document.querySelectorAll(".projectName")].filter(
      project => project.innerHTML == projectName
    )[0].parentNode.parentNode.childNodes[input].childNodes[1].id
  }, projectName, input)

  const inputValue = await page.evaluate((inputId) => {
    return $(`#${inputId}`).val()
  }, inputId)

  if (!inputValue) {
    await page.click(`#${inputId}`)
    await page.keyboard.type(hours)
  }
}

async function bookToday () {
  console.log(`Booking hours for today...`)

  await init()
  await bookInput(today)
  await saveAndClose()

  console.log(`Project '${projectName}'. Today booked.`)
}

async function bookWeek() {
  console.log(`Booking hours for this week...`)

  await init()
  for (iterate in [...Array(today).keys()]) {
    await bookInput(parseInt(iterate) + 1)
  }
  await saveAndClose()

  console.log(`Project '${projectName}'. Week until today booked.`)
}

module.exports.bookToday = bookToday
module.exports.bookWeek  = bookWeek