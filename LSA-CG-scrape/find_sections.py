import urllib3
from bs4 import BeautifulSoup
import re # importing regex functionality

def soupObj(url):
    http = urllib3.PoolManager()
    response = http.request('GET', url)
    soup = BeautifulSoup(response.data, 'html.parser')
    return soup

# Function to retrieve the 'termArray' query for the current semester
# Thereby future-proofing the script :)
# The previous version was 'stuck' on Fall 2018
def get_term():
    soup = soupObj('http://www.lsa.umich.edu/cg/default.aspx')
    # The LSA CG webpage has a navbar with a button to browse all UG subjects being offered in the current term
    # One of the queries in the href attribute of this button contains the current term ID
    # The line below obtains a string of this format: 
    #   cg_subjectlist.aspx?termArray=f_19_2260&cgtype=ug&allsections=true
    link = soup.find('a', attrs={'id': 'hyperlinkBrowseUGSubjectList'})['href']
    # Using a regular expression to match the value for 'termArray'
    matches = re.findall(r'[\?&]termArray=([^&$\s]*)', link)
    term = matches[0]
    # Return the term ID, for example, 'f_19_2260'
    return term

# Added an argument for the term ID
def pre_url(dept, cat, term):
    mast_url = "http://www.lsa.umich.edu/cg/"
    url_pre = "cg_results.aspx"
    # Split the URL into more parts so the term ID can be appended
    url_query_term = "?termArray=" + term
    url_query_others = "&cgtype=ug&show=100&department="
    url_post = "&catalog="
    url = mast_url+url_pre+url_query_term+url_query_others+dept+url_post+cat # URL construction modified to suit above changes
    soup = soupObj(url)
    if soup.find('div', attrs={'id':'contentMain_panelError'}) == None:
        classlinks = soup.find('div', attrs={'class':'row ClassRow ClassHyperlink result'})
        url = mast_url+classlinks.get('data-url')
        return url

def list_sec(pre_url):
    dict = {}
    if pre_url != None:
        soup = soupObj(pre_url)
        sections = soup.find_all('div', attrs={'class':'row clsschedulerow toppadding_main bottompadding_main'})
        for secs in sections:
            dict[secs.find('div', attrs={'class':'col-md-1'}).find('span').text.strip()] = secs.find('span',attrs={'class':'badge'}).text.strip()
    else:
        dict["Error"]="Incorrect Input"
    return dict

def find_sections(dept, cat):
    return list_sec(pre_url(dept, cat, get_term())) # Get term ID and pass it to pre_url()
    
dept = 'EECS'
cnum = '445'

print(find_sections(dept, cnum))