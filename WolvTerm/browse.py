from webdriver import driver
from cookies import readCookies, writeCookies
from helpers import handleLogin, quitSess
from pages import Home, Student, StudentCenter, EmployeeSelfService
import time, os, sys

def main_menu():
    while True:
        #os.system('cls' if sys.platform == 'win32' else 'clear')
        print ("Welcome to WolvTerm 0.0.1!\n")
        print ("Please choose the menu you want to start:")
        print ("1. Home")
        print ("2. Student")
        print ("3. Employee Self-Service")
        print ("\n0. Quit")
        choice = input(">> ")
        exec_menu(choice)
    return

def exec_menu(choice):
    #os.system('cls' if sys.platform == 'win32' else 'clear')
    ch = choice.lower()
    if ch == '':
        menu_actions['main_menu']()
    else:
        try:
            menu_actions[ch]()
        except KeyError:
            print ("Invalid selection, please try again.\n")
            menu_actions['main_menu']()
    return

def exitSess():
    quitSess()
    exit()

menu_actions = {
    'main_menu': main_menu,
    '1': Home,
    '2': Student,
    '3': EmployeeSelfService,
    '0': exitSess
}

if __name__ == "__main__":
    Home()
    main_menu()
    # Home()
    #StudentCenter()
    # quitSess()