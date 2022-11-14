function ResizeBokehChart(bokehIndex, scaleWidth) {

  if(Object.keys(Bokeh.index).length > 0) {
    var bokehObject = Bokeh.index[Object.keys(Bokeh.index)[bokehIndex]].model;  
    bokehObject.plot_height = graphContainer.clientHeight;  

    // Breite beim Barchart zu skalieren ist Contra-Produktiv, da sich dann Labels ueberlappen
    if (scaleWidth) {
      bokehObject.plot_width = graphContainer.clientWidth;
    }
  }
};

function ResizeGraph() {
  ResizeBokehChart(0, true);
}

function ResizeBarChart() {
  // horizontales resizing deaktiviert, da bei zu kleinen Fenstern text ueberlappt - wird mit scrollbar geloest
  ResizeBokehChart(1, false);
}

function ResizePieChart() {
  ResizeBokehChart(2, true);
}

function HandleWindowResizeForBokehCharts() {
  ResizeGraph();
  ResizeBarChart();  
  //ResizePieChart(); // PieChart rausgeschmissen
}


function RenderGraph(idSourceJson) {
    console.log("Starte GraphRender Aufruf fuer JsonObjekt mit ID: " + idSourceJson);

    // Div leeren
    graphContainer.innerHTML = "";

    // Graph rendern
    globalJsonID = idSourceJson;
    BokehGraphRenderer(globalJsonID);

    // Bokeh-Controls entfernen (Zeile zum debuggen auskommentieren) 
    var bokehControls = document.querySelector("div[class='bk bk-toolbar bk-right']");
    if(typeof bokehControls !== 'undefined' && bokehControls != null)
      bokehControls.innerHTML = "";
}

function RenderCharts(bundesland) {
  for(var i = 0; i < 3; i++)
    RenderChart(bundesland, i);
}

function RenderChart(bundesland, chartIndex) {
  // PieChart nicht plotten
  if (chartIndex > 1) {
    return;
  }


  // g_chartArray wird dynamisch via Python erzeugt (TensorVinceC19Charts.js)
  // Die Indeces sind wie unten beschrieben (GraphJson, BarchartJson, PieChartJson)
  var idArr = ["graphContainer", "barChartContainer", "pieChartContainer"];
  var datarootContainerArr = ["DataRootGraphContainer", "DataRootBarChartContainer", "DataRootPieChartContainer"];


  var resultJson = g_chartArr[chartIndex][bundesland];

  //console.log(resultJson);
  //BokehGraphRendererViaJsonStr(resultJson, idArr[chartIndex], idArr[chartIndex], "DataRootGraphContainer"); 
  //console.log("dataRootContainer: " + datarootContainerArr[chartIndex]);
  //BokehGraphRendererViaJsonStr(resultJson, idArr[chartIndex], idArr[chartIndex], datarootContainerArr[chartIndex]); 
  //BokehGraphRendererViaJsonStr(resultJson, idArr[chartIndex], idArr[chartIndex], idArr[chartIndex]); 
  BokehGraphRendererViaJsonStr(resultJson, idArr[chartIndex], idArr[chartIndex], "DataRootGraphContainer"); 
  HandleWindowResizeForBokehCharts();
}

// docID:  Der erste String der bei der generierten JSON steht z.B. "a30e5890-4f5d-4d42-8d9b-f41183d5ded0" in  {"a30e5890-4f5d-4d42-8d9b-f41183d5ded0":{"defs":[],"roots":{"references":[{"attributes":{"end":359},"id": ...
// divID:  Die id vom div-container indem das Chart platziert wird z.B. "graphContainer" in <div class="bk-root I" id="graphContainer" data-root-id="DataRootGraphContainer"></div>
// rootID: das Attribut root-id vom div-container indem das Chart platziert wird z.B. "DataRootGraphContainer" in <div class="bk-root I" id="graphContainer" data-root-id="DataRootGraphContainer"></div> 
function BokehGraphRendererViaJsonStr(jsonStr, docID, divID, rootID) {
  /*
  console.log("Argumente:");
  console.log(jsonStr);
  console.log(docID);
  console.log(divID);
  console.log(rootID);
  console.log("---------------------------------");
  */

  // Inhalt zuruecksetzen, da sonst Chart einfach drangehaengt wird
  document.getElementById(divID).innerHTML = "";
  
  // Das eigentliche Rendern von Bokeh kommt jetzt:
  (function() {
    var fn = function() {
      Bokeh.safely(function() {
        (function(root) {
          function embed_document(root) {
            

            var docs_json = jsonStr; 
            //console.log(docs_json);
            // Originaler Aufruf:
            // var render_items = [{"docid":"263ae538-836b-4bfb-8fc5-2622f96794ba","root_ids":["4923"],"roots":{"4923":"8296a37e-88d0-4d84-9497-10a43595378e"}}];
            //
            // Folgender Aufruf plottet den Graphen
            // var render_items = [{"docid": docID ,"root_ids":[rootID],"roots":{"DataRootGraphContainer": divID}}];
            //var render_items = [{"docid": docID ,"root_ids":[rootID],"roots":{"DataRootGraphContainer": divID}}]; // 

            // An der Stelle wo "barChartContainer" erwartet wird uebergab ich vorher versehentlich "DataRootBarChartContainer"
            var render_items = [{"docid": docID ,"root_ids":[rootID],"roots":{"DataRootGraphContainer": divID}}]; // 

            
            console.log("DOCS_JSON: " + docs_json);
            console.log("Render_ITEMS: " + render_items);
            console.log("JSON TYP: " + typeof docs_json);
            var j = JSON.parse(docs_json);
            console.log(j)

            root.Bokeh.embed.embed_items(docs_json, render_items); 
          }
          if (root.Bokeh !== undefined) {
            embed_document(root);
          } else {
            var attempts = 0;
            var timer = setInterval(function(root) {
              if (root.Bokeh !== undefined) {
                clearInterval(timer);
                embed_document(root);
              } else {
                attempts++;
                if (attempts > 100) {
                  clearInterval(timer);
                  console.log("Bokeh: ERROR: Unable to run BokehJS code because BokehJS library is missing");
                }
              }
            }, 10, root)
          }
        })(window);
      });
    };
    if (document.readyState != "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  })();
                console.log("REEEEEEEEEEEESIZING!");

                HandleWindowResizeForBokehCharts();
}
function BokehGraphRenderer(globalJsonID) {
  (function() {
    var fn = function() {
      Bokeh.safely(function() {
        (function(root) {
          function embed_document(root) {
            
          console.log(globalJsonID);
          var docs_jsonElement = document.getElementById(globalJsonID);
          console.log(document.body);

          if (docs_jsonElement != null) {
            console.log("Lade JSON-Code und gebe ermittelten JSON-Code gleich danach aus...");
            var docs_json = docs_jsonElement.textContent;
            console.log(docs_json);
            var render_items = [{"docid":"a30e5890-4f5d-4d42-8d9b-f41183d5ded0","root_ids":["DataRootGraphContainer"],"roots":{"DataRootGraphContainer":"graphContainer"}}];
            root.Bokeh.embed.embed_items(docs_json, render_items);

            }
            else {
              console.log("Fehler: docs_jsonElement ist NULL!!!");
            }
        
          }
          if (root.Bokeh !== undefined) {
            embed_document(root);
          } else {
            var attempts = 0;
            var timer = setInterval(function(root) {
              if (root.Bokeh !== undefined) {
                clearInterval(timer);
                embed_document(root);
              } else {
                attempts++;
                if (attempts > 100) {
                  clearInterval(timer);
                  console.log("Bokeh: ERROR: Unable to run BokehJS code because BokehJS library is missing");
                }
              }
            }, 10, root)
          }
        })(window);
      });
    };
    if (document.readyState != "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  })();
}
