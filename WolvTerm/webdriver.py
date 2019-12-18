from selenium import webdriver
from sys import platform as _platform
import platform

driver = ""
opts = webdriver.ChromeOptions()
# opts.add_argument('headless')
opts.add_argument('remote-debugging-port=9222')
if _platform.startswith("linux"):
        driver = webdriver.Chrome(executable_path="webdrivers/chromedriver-linux", options=opts)
elif _platform == "darwin":
    driver = webdriver.Chrome(executable_path="webdrivers/chromedriver-mac", options=opts)
elif _platform == "win32" or _platform == "win64":
    driver = webdriver.Chrome(executable_path="webdrivers/chromedriver-windows.exe", options=opts)

# driver.close()