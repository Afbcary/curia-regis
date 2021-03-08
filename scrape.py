import csv
import json
import requests
from requests.exceptions import HTTPError
from requests_html import HTMLSession
import time

class Card(dict):
    def __init__(self, name, rank, url):
        dict.__init__(self, name=name, rank=rank, url=url)
        self.name = name
        self.rank = rank
        self.url = url

_session = HTMLSession()

def get(url):
    try:
        return _session.get(url)
    except requests.exceptions.RequestException as e:
        print(e)
    
def get_rank_cards():
    # CSV downloaded from content in 
    # https://docs.google.com/spreadsheets/d/1CaVOd1pgAgmjJHXPM1tVMVnlJOLDZaq8BxjW4I1NI1E/edit#gid=0
    with open('Dominion Card Glicko - Cards.csv', newline='') as csvfile:
        cards = {}
        reader = csv.reader(csvfile)
        next(reader) # skip first header row
        for row in reader:
            cards[row[1]] = Card(row[1], row[0], 'http://wiki.dominionstrategy.com/index.php/%s' % row[1])

    return cards


def get_card_html(url):
    response = requests.get(url)
    return str(response.content)
    
def get_section(raw_html, section_title):
    near_start  = raw_html.find('title="Edit section: %s"' % section_title)
    start = raw_html.find('<ul>', near_start)
    end1  = raw_html.find('<h2>', start + 5)
    end2  = raw_html.find('<h3>', start + 5)
    end = end1 if end1 < end2 and end1 != -1 else end2
    section = raw_html[start:end]
    #TODO: character encoding bug
    section = section.replace('/images/thumb', 'http://wiki.dominionstrategy.com/images/thumb')
    section = section.replace('\\n', '')
    section = section.replace('\\t', '')
    section = section.replace('href=\\"/index.php/', 'http://wiki.dominionstrategy.com/index.php/')
    return section

cards = get_rank_cards()
for card in cards.values():
    print('getting ' + card.name)
    time.sleep(0.5) # rate limit requests
    card_html = get_card_html(card.url)
    card['synergies'] = get_section(card_html, 'Synergies/Combos')
    card['antisynergies'] = get_section(card_html, 'Antisynergies')

with open('cards.js', 'w') as outfile:
    outfile.write('cards = ')
    json.dump(cards, outfile)