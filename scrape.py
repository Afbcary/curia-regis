import requests
from requests.exceptions import HTTPError
from requests_html import HTMLSession

def get(url):
    try:
        session = HTMLSession()
        return session.get(url)
    except requests.exceptions.RequestException as e:
        print(e)

cards_response = get('http://wiki.dominionstrategy.com/index.php/Cards')

# table.wikitable > tbody > tr > td:first-child > span > a
# https://css2xpath.github.io/
print(cards_response.html.xpath('//table[contains(concat(" ",normalize-space(@class)," ")," wikitable ")]/tbody/tr/td[not(preceding-sibling::*)]/span/a'))

links = cards_response.html.absolute_links
# print(links)