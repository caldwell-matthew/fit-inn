// Generated by Selenium IDE
const { Builder, By, Key, until } = require('selenium-webdriver')
const assert = require('assert')

describe('Login SSO', function() {
  this.timeout(30000)
  let driver
  let vars
  beforeEach(async function() {
    driver = await new Builder().forBrowser('chrome').build()
    vars = {}
  })
  afterEach(async function() {
    await driver.quit();
  })
  async function waitForWindow(timeout = 2) {
    await driver.sleep(timeout)
    const handlesThen = vars["windowHandles"]
    const handlesNow = await driver.getAllWindowHandles()
    if (handlesNow.length > handlesThen.length) {
      return handlesNow.find(handle => (!handlesThen.includes(handle)))
    }
    throw new Error("New window did not appear before timeout")
  }
  it('Login SSO', async function() {
    await driver.get("http://localhost:3000/")
    await driver.manage().window().setRect({ width: 1630, height: 1320 })
    await driver.findElement(By.css(".MuiSvgIcon-fontSizeLarge")).click()
    await driver.findElement(By.css(".makeStyles-sublink-4")).click()
    vars["windowHandles"] = await driver.getAllWindowHandles()
    await driver.findElement(By.css(".active span")).click()
    vars["win9691"] = await waitForWindow(2000)
    vars["root"] = await driver.getWindowHandle()
    await driver.switchTo().window(vars["win9691"])
    await driver.manage().window().setRect({ width: 900, height: 900 })
    await driver.findElement(By.id("identifierId")).click()
    await driver.findElement(By.id("identifierId")).sendKeys("fitinncsus@gmail.com")
    await driver.findElement(By.css(".VfPpkd-LgbsSe-OWXEXe-k8QpJ > .VfPpkd-vQzf8d")).click()
    await driver.wait(until.elementLocated(By.id("password")), 30000)
    await driver.findElement(By.name("password")).click()
    await driver.findElement(By.name("password")).sendKeys("fitinnpassword")
    //await driver.findElement(By.css(".WEQkZc")).click()
    await driver.findElement(By.css(".VfPpkd-LgbsSe-OWXEXe-k8QpJ > .VfPpkd-vQzf8d")).click()
    await driver.switchTo().window(vars["root"])
  })
})