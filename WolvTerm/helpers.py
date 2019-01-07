from webdriver import driver
from cookies import readCookies, writeCookies
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import getpass

def enterTextId(id, text):
    elem = driver.find_element_by_id(id)
    elem.clear()
    elem.send_keys(text)

def pressEnterId(id):
    elem = driver.find_element_by_id(id)
    elem.send_keys(Keys.RETURN)

def enterLogin():
    if 'Weblogin' in driver.title:
        try:
            usr = getpass.getpass('Username [Hidden]: ')
            password = getpass.getpass('Password [Hidden]: ')
            enterTextId('login', usr)
            enterTextId('password', password)
            pressEnterId('password')
        except Exception as e:
            print("Oops, something went wrong...")
            print(str(e))
    waitId('PT_NAVBAR')

def waitId(id):
    wait = WebDriverWait(driver, 60)
    try:
        wait.until(EC.presence_of_element_located((By.ID, id)))
    finally:
        driver.quit()

def waitTitle(str):
    wait = WebDriverWait(driver, 60)
    try:
        wait.until(not EC.title_is(str))
    finally:
        driver.quit()

def navTo(url):
    driver.get(url)

def close():
    driver.close()

def quitSess():
    writeCookies()
    driver.close()
    driver.quit()

def handleLogin(func, args=None):
    if 'Weblogin' in driver.title:
        enterLogin()
        waitId('PT_NAVBAR')
        #waitTitle('WebLogin')
    if args:
        func(args)
    else:
        func()
    