// function getCards() {
//   fetch("./cards.json").then((response) => {
//     return response.json();
//   });
// }

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
        /*make the matching letters bold:*/
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
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
        // TODO REMOVE THIS addCard(x[currentFocus].children[1].value)
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

selected_card_names = []

function load() {
    const card_names = [];  
    Object.getOwnPropertyNames(cards).forEach(prop => {
        card_names.push(prop);
    });
    autocomplete(document.getElementById("cardInput"), card_names);
}

function compareRank(a, b) {
    return parseInt(a['rank']) < parseInt(b['rank']) ? -1 : 1;
}

function addCard(card_to_add) {
    selected_card_names.push(card_to_add)
    // selected_card_names.push(document.getElementById("cardInput").value)
    selected_cards = []
    for (card_name of selected_card_names){
        selected_cards.push(cards[card_name])
    }
    selected_cards = selected_cards.sort((a, b) => compareRank(a,b))
    header1 = document.createElement('th')
    header1.innerHTML = 'Card'
    header2 = document.createElement('th')
    header2.innerHTML = 'Rank'
    header3 = document.createElement('th')
    header3.innerHTML = 'Synergies'
    header4 = document.createElement('th')
    header4.innerHTML = 'Antisynergies'
    headerRow = document.createElement('tr')
    headerRow.appendChild(header1)
    headerRow.appendChild(header2)
    headerRow.appendChild(header3)
    headerRow.appendChild(header4)
    table = document.createElement('table')
    table.id = 'table'
    table.appendChild(headerRow)
    for (selected_card of selected_cards) {
        dataRow = document.createElement('tr')

        nameTd = document.createElement('td')
        nameTd.innerText = selected_card['name']
        dataRow.appendChild(nameTd)

        rankTd = document.createElement('td')
        rankTd.innerText = selected_card['rank']
        dataRow.appendChild(rankTd)
      
        synergiesTd = document.createElement('td')
        synergiesTd.innerHTML = selected_card['synergies']
        dataRow.appendChild(synergiesTd)

        antisynergiesTd = document.createElement('td')
        antisynergiesTd.innerHTML = selected_card['antisynergies']
        dataRow.appendChild(antisynergiesTd)

        table.appendChild(dataRow)
    }

    container = document.getElementById('table-container')
    for (node of container.children) {
        container.removeChild(node)
    }
    container.appendChild(table)
}