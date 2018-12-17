from cookies import readCookies, writeCookies
from webdriver import driver
from helpers import handleLogin, quitSess
from pages import Home, Student, StudentCenter, EmployeeSelfService
from helpers import navTo

#cookies = pickle.load(open("cookies.pkl", "rb"))
readCookies()
# Home()
# print(driver.title)
# # Student()
# navTo('https://csprod.dsc.umich.edu/services/student')
# print(driver.title)
# # StudentCenter()
# StudentCenter()
# print(driver.title)
# #assert "No results found." not in driver.page_source
#quitSess()
driver.quit()