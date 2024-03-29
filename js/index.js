// Slightly modified copied autocomplete
function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function (e) {
    var a,
      b,
      i,
      val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*html encode apostrophes*/
        encoded = arr[i].replace("'", "&apos;")
        /*make the matching letters bold:*/
        b.innerHTML = "<strong>" + encoded + "</strong>";
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + encoded + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function (e) {
          /*insert the value for the autocomplete text field:*/
          addCard(this.getElementsByTagName("input")[0].value)
          inp.value = ''
          /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) {
      //up
      /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

selectedCardNames = []

function load() {
    const cardNames = [];  
    Object.getOwnPropertyNames(cards).forEach(prop => {
        cardNames.push(prop);
    });
    autocomplete(document.getElementById("cardInput"), cardNames);
}

function compareRank(a, b) {
    return parseInt(a['rank']) < parseInt(b['rank']) ? -1 : 1;
}

function getHeader(text) {
  header = document.createElement('th');
  header.innerHTML = text;
  return header;
}

function getTd(text, html, card) {
  td = document.createElement('td')
  if (text != null) {
    td.innerText = text
  }
  if (html != null) {
    if (html != ''){
      html = html.replace('/', '\/')
      td.innerHTML = html
    } else {
      td.innerHTML = `<li>You can improve the <a href=\"${card['url']}">wiki<\a> for ${card['name']}.</li>` 
    }
  }
  return td
}

function addCard(card_to_add) {
  selectedCardNames.push(card_to_add);
    selectedCards = [];

    for (card_name of selectedCardNames){
      selectedCards.push(cards[card_name]);
    }
    selectedCards = selectedCards.sort((a, b) => compareRank(a,b))
    
    table = document.createElement('table')
    table.id = 'table'

    headerRow = document.createElement('tr')
    for (const header of ['Card', 'Rank', 'Synergies', 'Antisynergies']) {
      headerRow.appendChild(getHeader(header))
    }
    table.appendChild(headerRow)

    for (selectedCard of selectedCards) {
        dataRow = document.createElement('tr')
        dataRow.appendChild(getTd(selectedCard['name'], null))
        dataRow.appendChild(getTd(selectedCard['rank'], null))
        dataRow.appendChild(getTd(null, selectedCard['synergies'], selectedCard))
        dataRow.appendChild(getTd(null, selectedCard['antisynergies'], selectedCard))
        table.appendChild(dataRow)
    }

    container = document.getElementById('table-container')
    for (node of container.children) {
        container.removeChild(node)
    }
    container.appendChild(table)
}