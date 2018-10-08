from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.webdriver.chrome.options import Options
import time
import unittest


class WebPageTesting(unittest.TestCase):
	def setUp(self):
		chrome_options = Options()
		chrome_options.add_argument("--headless")
		self.browser = webdriver.Chrome(options=chrome_options)
		self.browser.get("http://127.0.0.1:3000")

	def testWastagePopupIsNotVisibleOnLoad(self):
		popup_element = self.browser.find_element_by_id('myModal')
		assert popup_element.is_displayed() == False

	def testWastagePopupIsVisibleAfterSelectingReportButton(self):
		popup_element = self.browser.find_element_by_id('myModal')
		report_button = self.browser.find_element_by_id('report-button')
		report_button.click()
		time.sleep(0.2)
		assert popup_element.is_displayed() == True
		
	def tearDown(self):
		self.browser.close()

if __name__ == "__main__":
	unittest.main()
