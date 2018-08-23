import urllib3
from bs4 import BeautifulSoup

def soupObj(url):
    http = urllib3.PoolManager()
    response = http.request('GET', url)
    soup = BeautifulSoup(response.data, 'html.parser')
    return soup

def pre_url(dept, cat):
    mast_url = "http://www.lsa.umich.edu/cg/"
    url_pre = "cg_results.aspx?termArray=f_18_2210&cgtype=ug&show=100&department="
    url_post = "&catalog="
    url = mast_url+url_pre+dept+url_post+cat
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
        #print(sections[0].find('div', attrs={'class':'col-md-1'}).find('span'))
        for secs in sections:
            #print(secs.find('div', attrs={'class':'col-md-1'}).find('span').text.strip())
            #print(secs.find('span',attrs={'class':'badge'}).text.strip())
            dict[secs.find('div', attrs={'class':'col-md-1'}).find('span').text.strip()] = secs.find('span',attrs={'class':'badge'}).text.strip()
    else:
        dict["Error"]="Incorrect Input"
        #print(sections[0].find_all('div'))
        #print(len(sections))
    return dict

def find_sections(dept, cat):
    return list_sec(pre_url(dept, cat))

print(find_sections('EECSS', '280'))

#dept = 'MATH'
#cat = '215'






#print(soup)