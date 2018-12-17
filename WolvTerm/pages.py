from webdriver import driver
from helpers import navTo, handleLogin

def Home():
    navTo('https://wolverineaccess.umich.edu')

def Student():
    navTo('https://csprod.dsc.umich.edu/services/student')

def StudentCenter():
    Student()
    driver.execute_script("LaunchURL(this,'https://csprod.dsc.umich.edu/psp/csprodnonop_newwin/EMPLOYEE/SA/c/SA_LEARNER_SERVICES.SSS_STUDENT_CENTER.GBL',0,'bGrouplet@1;','')")

def EmployeeSelfService():
    navTo('https://hcmprod.dsc.umich.edu/services/employee')