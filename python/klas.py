import requests
from bs4 import BeautifulSoup


class KLAS():
    def __init__(self, userId, password):
        self.userId = userId
        self.password = password
        self.auth = False
        self.list_var = []

    def get_lecture_list(self):
        self.list_var = []
        userId = self.userId
        password = self.password

        login_info = {'USER_ID':userId, 'PASSWORD':password}
        base_url = 'https://klas.khu.ac.kr/'

        with requests.Session() as session:
            user_res = session.post(base_url + 'user/loginUser.do', data=login_info)
            
            user_res = session.get(base_url + 'classroom/viewClassroomCourseMoreList.do?courseType=ing')

            user_soup = BeautifulSoup(user_res.text, 'html.parser')

            if len(user_soup.select('noscript')) == 1:
                self.auth=False
                return self.auth
            else:
                self.auth=True
                

            lec_list_var1 = user_soup.select('#tbl > tbody > tr > td:nth-of-type(2)')
            lec_list_var2 = user_soup.select('#tbl > tbody > tr > td:nth-of-type(4)')
            
            lec_list1 = list(map(lambda x: x.text[:x.text.find('[')], lec_list_var1))
            lec_list2 = list(map(lambda x: x.text[x.text.find('[')+1:-1], lec_list_var1))
            lec_list3 = list(map(lambda x: x.text, lec_list_var2))
            
            

            for i in range(len(lec_list1)):
                self.list_var.append({"subject":lec_list1[i], "subjnum":lec_list2[i], "professor":lec_list3[i]})

            return self.auth
    
    def return_list(self):
        return self.list_var
        
        