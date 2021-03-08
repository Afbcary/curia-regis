# Curia Regis

A suite of tools to advise the king on Dominion gameplay. 

Summon index.html in your interweb chariot to access your personal counsel, my liege.

## Development

Currently the rank data is a CSV download from [Dominion Card Glicko](https://docs.google.com/spreadsheets/d/1CaVOd1pgAgmjJHXPM1tVMVnlJOLDZaq8BxjW4I1NI1E/edit#gid=0). `Scrape.py` then looks up each card on [wiki.dominionstrategy.com](wiki.dominionstrategy.com) and snags the html for the synergies and antisynergies sections. Scrape finishes by writing the data to `cards.js` as a big JSON object. 

A static site provides an easy lookup for the data during gameplay. 

## Python dependencies
pip install requests

pip install requests-HTML

## Ideas
* filter out mentioned cards that aren't on the board
* map phrases to lists of cards
* add and secondary sort by cost in table
* chrome extension which loads page from current cards on dominion.games
* write tests and QA test bad input
* cron job to update every night
* host site on github pages
