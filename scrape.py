import csv
import json
import requests
from requests.exceptions import HTTPError
from requests_html import HTMLSession
import time
import urllib

class Card(dict):
    def __init__(self, name, rank):
        dict.__init__(self, name=name, rank=rank)
        self.name = name
        self.rank = rank

_session = HTMLSession()

def get(url):
    try:
        return _session.get(url)
    except requests.exceptions.RequestException as e:
        print(e)
    
def get_rank_cards():
    # CSV downloaded from content in 
    # https://docs.google.com/spreadsheets/d/1CaVOd1pgAgmjJHXPM1tVMVnlJOLDZaq8BxjW4I1NI1E/edit#gid=0
    with open('data/Dominion Card Glicko - Cards.csv', newline='') as csvfile:
        cards = {}
        reader = csv.reader(csvfile)
        next(reader) # skip first header row
        for row in reader:
            cards[row[1]] = Card(row[1], row[0])

    return cards


def get_card_html(url):
    response = requests.get(url)
    return str(response.content)

def get_section(raw_html, html_id, backup_id):
    near_start  = raw_html.find('id="' + html_id)
    if near_start == -1 and backup_id:
        near_start  = raw_html.find('id="' + backup_id)
    if near_start == -1:
        return 'No %s found.' % html_id
    start = raw_html.find('<ul>', near_start)
    end = raw_html.find('</ul>', near_start) + 5
    return clean(raw_html[start:end])
    
def clean(section):
    section = section.replace('/images/thumb', 'http://wiki.dominionstrategy.com/images/thumb')
    section = section.replace('\\n', '')
    section = section.replace('\\t', '')
    section = section.replace("\\'", "'")
    section = section.replace('href=\"/index.php/', 'http://wiki.dominionstrategy.com/index.php/')
    # TODO fix links like engine, Big Money
    return section

cards = get_rank_cards()
for card in cards.values():
    print('getting ' + card.name)
    time.sleep(0.5) # rate limit requests
    card_html = get_card_html('http://wiki.dominionstrategy.com/index.php/' + urllib.parse.quote_plus(card.name.replace(' ', '_')))
    card['synergies'] = get_section(card_html, 'Synergies', '')
    card['antisynergies'] = get_section(card_html, 'Anti-synergies', 'Antisynergies')

with open('data/cards.js', 'w') as outfile:
    outfile.write('cards = ')
    json.dump(cards, outfile)