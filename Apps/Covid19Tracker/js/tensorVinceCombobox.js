// Klassen- & Funktionsdefinitionen
function InitializeCombobox() {
    InitializeCloseComboboxEventhandler();
    SelectCmbItem(document.querySelectorAll(".ComboboxItem")[1]);

    // Combobox-Click-Eventhandler (erstes item skippen da Auswahl)
    // Wird nun manuell im Code gesetzt, da bessere Lesbarkeit bei Aufruf von 2 verschiedenen Click-Funktionen 
    /*
    var elemente = document.getElementsByClassName("ComboboxItem");
    for(var i = 1; i < elemente.length; i++) {
      elemente[i].onclick = function() { SelectCmbItem(this); };
    } */
}

function InitializeCloseComboboxEventhandler() {
  targetDiv = document.getElementById("Combobox");
  auswahl = document.getElementById("ComboboxAuswahl");

  document.addEventListener('click', function(event) {
    var isClickInsideCombobox = targetDiv.contains(event.target);

    if (!isClickInsideCombobox) {
        HideComboboxDropdown();
    }});
}

function ShowComboboxDropdown(targetObj) {
  if(document.getElementById("ComboboxDropdown").className == "I") {
       document.getElementById("ComboboxDropdown").className = "O" // nach 2tem draufdrucken verstecken
  }
  else {
    document.getElementById("ComboboxDropdown").className = "I";
  }    
}

function HideComboboxDropdown() {
  document.getElementById("ComboboxDropdown").className = "O";
}

function SelectCmbItem(myElement) {
  // Aktives Element setzen
  var myElementText = myElement.textContent || myElement.innerText;
  var myElementImgClass = myElement.getElementsByTagName("div")[0].className;
  //console.log(myElement);
  //document.getElementById("ComboboxAuswahl").textContent = myElementText;
  document.getElementById("ComboboxText").textContent = myElementText;
  document.getElementById("ComboboxImg").className = myElementImgClass;

  // Items in Combobox reseten
  document.querySelectorAll(".ComboboxItem").forEach(ci => ci.className = "ComboboxItem I");

  // Selektiertes Item in Combobox verstecken
  myElement.className = "ComboboxItem O";

  // ComboboxDropdown verstecken
  HideComboboxDropdown();
}
