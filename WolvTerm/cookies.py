import pickle, getpass
from webdriver import driver
def readCookies():
    if driver.title == '' or driver.title == None:
        print("Title is not valid!")
        from pages import Home
        Home()
        
    try:
        with open('cookies.pkl', 'rb') as j:
            cookies = pickle.load(j)
            for cookie in cookies:
                driver.add_cookie(cookie)
        print("Using cookies")
    except Exception as e:
        print(str(e))
        #print("Continuing without cookies")
        from pages import Student
        from helpers import enterLogin, navTo, enterTextId, pressEnterId, waitId
        print(driver.title)
        print("Getting cookies now...")
        navTo('https://csprod.dsc.umich.edu/services/student')
        print(driver.title)
        
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
        
        

def writeCookies():
    #pickle.dump(driver.get_cookies(), open("cookies.pkl", "wb"))
    with open('cookies.pkl', 'wb') as j_out:
        pickle.dump(driver.get_cookies(), j_out)