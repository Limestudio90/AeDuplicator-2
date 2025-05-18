// AE Duplicator - Ispirato al Duplicator di Cavalry
// Versione: 2.0
// Autore: Lorenzo Susca - Github : https://github.com/Limestudio90
// Questo script permette di duplicare una precomposizione in una griglia
// con controlli avanzati per distribuzione, offset e variazioni

(function(thisObj) {
    // Costanti e configurazione
    var SCRIPT_NAME = "AE Duplicator 2.0";
    var MIN_AE_VERSION = 13.0; // CC 2014
    
    // Verifica compatibilità versione AE
    function checkEnvironment() {
        if (parseFloat(app.version) < MIN_AE_VERSION) {
            alert("Questo script richiede Adobe After Effects CC 2014 (13.0) o superiore.");
            return false;
        }
        return true;
    }
    
    // Funzione principale per costruire l'interfaccia utente
    function buildUI(thisObj) {
        // Crea il pannello o la finestra
        var myPanel = (thisObj instanceof Panel) ? 
                      thisObj : 
                      new Window("palette", SCRIPT_NAME, undefined, {resizeable: true});
        
        // Configurazione pannello principale
        myPanel.orientation = "column";
        myPanel.alignChildren = ["fill", "top"];
        myPanel.spacing = 10;
        myPanel.margins = 16;
        
        // Gruppo per le impostazioni di distribuzione
        var distributionPanel = myPanel.add("panel", undefined, "Distribuzione");
        distributionPanel.orientation = "column";
        distributionPanel.alignChildren = ["fill", "top"];
        distributionPanel.spacing = 5;
        distributionPanel.margins = 10;
        
        // Dropdown per il tipo di distribuzione
        var distTypeGroup = distributionPanel.add("group");
        distTypeGroup.orientation = "row";
        distTypeGroup.alignChildren = ["left", "center"];
        distTypeGroup.add("statictext", undefined, "Tipo:");
        var distTypeDropdown = distTypeGroup.add("dropdownlist", undefined, ["Griglia", "Cerchio", "Spirale", "Linea"]);
        distTypeDropdown.selection = 0;
        
        // Pannello per le opzioni di griglia (visibile di default)
        var gridPanel = distributionPanel.add("panel", undefined, "Opzioni Griglia");
        gridPanel.orientation = "column";
        gridPanel.alignChildren = ["fill", "top"];
        gridPanel.spacing = 5;
        gridPanel.margins = 10;
        
        // Campi per righe e colonne
        var rowColGroup = gridPanel.add("group");
        rowColGroup.orientation = "row";
        rowColGroup.alignChildren = ["fill", "center"];
        
        rowColGroup.add("statictext", undefined, "Righe:");
        var rowsInput = rowColGroup.add("edittext", undefined, "3");
        rowsInput.characters = 4;
        
        rowColGroup.add("statictext", undefined, "Colonne:");
        var colsInput = rowColGroup.add("edittext", undefined, "3");
        colsInput.characters = 4;
        
        // Campi per spaziatura
        var spacingGroup = gridPanel.add("group");
        spacingGroup.orientation = "row";
        spacingGroup.alignChildren = ["fill", "center"];
        
        spacingGroup.add("statictext", undefined, "Spaziatura X (px):");
        var spacingXInput = spacingGroup.add("edittext", undefined, "200");
        spacingXInput.characters = 4;
        
        // Aggiungiamo uno slider per la spaziatura X
        var spacingXSlider = spacingGroup.add("slider", undefined, 200, 10, 1000);
        spacingXSlider.preferredSize.width = 100;
        
        spacingGroup.add("statictext", undefined, "Y (px):");
        var spacingYInput = spacingGroup.add("edittext", undefined, "200");
        spacingYInput.characters = 4;
        
        // Aggiungiamo uno slider per la spaziatura Y
        var spacingYSlider = spacingGroup.add("slider", undefined, 200, 10, 1000);
        spacingYSlider.preferredSize.width = 100;
        
        // Sincronizziamo gli slider con i campi di input
        spacingXSlider.onChanging = function() {
            spacingXInput.text = Math.round(this.value).toString();
        };
        
        spacingXInput.onChange = function() {
            var val = parseInt(this.text);
            if (!isNaN(val) && val >= 10 && val <= 1000) {
                spacingXSlider.value = val;
            }
        };
        
        spacingYSlider.onChanging = function() {
            spacingYInput.text = Math.round(this.value).toString();
        };
        
        spacingYInput.onChange = function() {
            var val = parseInt(this.text);
            if (!isNaN(val) && val >= 10 && val <= 1000) {
                spacingYSlider.value = val;
            }
        };
        
        // Pannello per le opzioni di cerchio (nascosto di default)
        var circlePanel = distributionPanel.add("panel", undefined, "Opzioni Cerchio");
        circlePanel.orientation = "column";
        circlePanel.alignChildren = ["fill", "top"];
        circlePanel.spacing = 5;
        circlePanel.margins = 10;
        circlePanel.visible = false;
        
        var radiusGroup = circlePanel.add("group");
        radiusGroup.add("statictext", undefined, "Raggio (px):");
        var radiusInput = radiusGroup.add("edittext", undefined, "300");
        radiusInput.characters = 5;
        
        // Aggiungiamo uno slider per il raggio
        var radiusSlider = radiusGroup.add("slider", undefined, 300, 10, 1000);
        radiusSlider.preferredSize.width = 150;
        
        radiusSlider.onChanging = function() {
            radiusInput.text = Math.round(this.value).toString();
        };
        
        radiusInput.onChange = function() {
            var val = parseInt(this.text);
            if (!isNaN(val) && val >= 10 && val <= 1000) {
                radiusSlider.value = val;
            }
        };
        
        // Aggiungiamo i campi mancanti per il cerchio
        var circleCountGroup = circlePanel.add("group");
        circleCountGroup.add("statictext", undefined, "Numero elementi:");
        var circleCountInput = circleCountGroup.add("edittext", undefined, "8");
        circleCountInput.characters = 5;
        
        var startAngleGroup = circlePanel.add("group");
        startAngleGroup.add("statictext", undefined, "Angolo iniziale (°):");
        var startAngleInput = startAngleGroup.add("edittext", undefined, "0");
        startAngleInput.characters = 5;
        
        // Aggiungiamo uno slider per l'angolo iniziale
        var startAngleSlider = startAngleGroup.add("slider", undefined, 0, 0, 360);
        startAngleSlider.preferredSize.width = 150;
        
        startAngleSlider.onChanging = function() {
            startAngleInput.text = Math.round(this.value).toString();
        };
        
        startAngleInput.onChange = function() {
            var val = parseInt(this.text);
            if (!isNaN(val) && val >= 0 && val <= 360) {
                startAngleSlider.value = val;
            }
        };
        
        // Pannello per le opzioni di spirale (nascosto di default)
        var spiralPanel = distributionPanel.add("panel", undefined, "Opzioni Spirale");
        spiralPanel.orientation = "column";
        spiralPanel.alignChildren = ["fill", "top"];
        spiralPanel.spacing = 5;
        spiralPanel.margins = 10;
        spiralPanel.visible = false;
        
        var spiralCountGroup = spiralPanel.add("group");
        spiralCountGroup.add("statictext", undefined, "Numero elementi:");
        var spiralCountInput = spiralCountGroup.add("edittext", undefined, "12");
        spiralCountInput.characters = 5;
        
        var spiralRadiusGroup = spiralPanel.add("group");
        spiralRadiusGroup.add("statictext", undefined, "Raggio iniziale (px):");
        var spiralStartRadiusInput = spiralRadiusGroup.add("edittext", undefined, "50");
        spiralStartRadiusInput.characters = 5;
        
        // Aggiungiamo uno slider per il raggio iniziale della spirale
        var spiralStartRadiusSlider = spiralRadiusGroup.add("slider", undefined, 50, 5, 500);
        spiralStartRadiusSlider.preferredSize.width = 120;
        
        spiralStartRadiusSlider.onChanging = function() {
            spiralStartRadiusInput.text = Math.round(this.value).toString();
        };
        
        spiralStartRadiusInput.onChange = function() {
            var val = parseInt(this.text);
            if (!isNaN(val) && val >= 5 && val <= 500) {
                spiralStartRadiusSlider.value = val;
            }
        };
        
        var spiralGrowthGroup = spiralPanel.add("group");
        spiralGrowthGroup.add("statictext", undefined, "Crescita raggio (px):");
        var spiralGrowthInput = spiralGrowthGroup.add("edittext", undefined, "20");
        spiralGrowthInput.characters = 5;
        
        // Aggiungiamo uno slider per la crescita del raggio
        var spiralGrowthSlider = spiralGrowthGroup.add("slider", undefined, 20, 1, 100);
        spiralGrowthSlider.preferredSize.width = 120;
        
        spiralGrowthSlider.onChanging = function() {
            spiralGrowthInput.text = Math.round(this.value).toString();
        };
        
        spiralGrowthInput.onChange = function() {
            var val = parseInt(this.text);
            if (!isNaN(val) && val >= 1 && val <= 100) {
                spiralGrowthSlider.value = val;
            }
        };
        
        // Aggiungiamo il campo mancante per l'angolo della spirale
        var spiralAngleGroup = spiralPanel.add("group");
        spiralAngleGroup.add("statictext", undefined, "Angolo step (°):");
        var spiralAngleInput = spiralAngleGroup.add("edittext", undefined, "30");
        spiralAngleInput.characters = 5;
        
        // Aggiungiamo uno slider per l'angolo della spirale
        var spiralAngleSlider = spiralAngleGroup.add("slider", undefined, 30, 1, 90);
        spiralAngleSlider.preferredSize.width = 120;
        
        spiralAngleSlider.onChanging = function() {
            spiralAngleInput.text = Math.round(this.value).toString();
        };
        
        spiralAngleInput.onChange = function() {
            var val = parseInt(this.text);
            if (!isNaN(val) && val >= 1 && val <= 90) {
                spiralAngleSlider.value = val;
            }
        };
        
        // Pannello per le opzioni di linea (nascosto di default)
        var linePanel = distributionPanel.add("panel", undefined, "Opzioni Linea");
        linePanel.orientation = "column";
        linePanel.alignChildren = ["fill", "top"];
        linePanel.spacing = 5;
        linePanel.margins = 10;
        linePanel.visible = false;
        
        var lineCountGroup = linePanel.add("group");
        lineCountGroup.add("statictext", undefined, "Numero elementi:");
        var lineCountInput = lineCountGroup.add("edittext", undefined, "5");
        lineCountInput.characters = 5;
        
        var lineSpacingGroup = linePanel.add("group");
        lineSpacingGroup.add("statictext", undefined, "Spaziatura (px):");
        var lineSpacingInput = lineSpacingGroup.add("edittext", undefined, "150");
        lineSpacingInput.characters = 5;
        
        // Aggiungiamo uno slider per la spaziatura della linea
        var lineSpacingSlider = lineSpacingGroup.add("slider", undefined, 150, 10, 500);
        lineSpacingSlider.preferredSize.width = 120;
        
        lineSpacingSlider.onChanging = function() {
            lineSpacingInput.text = Math.round(this.value).toString();
        };
        
        lineSpacingInput.onChange = function() {
            var val = parseInt(this.text);
            if (!isNaN(val) && val >= 10 && val <= 500) {
                lineSpacingSlider.value = val;
            }
        };
        
        var lineAngleGroup = linePanel.add("group");
        lineAngleGroup.add("statictext", undefined, "Angolo linea (°):");
        var lineAngleInput = lineAngleGroup.add("edittext", undefined, "0");
        lineAngleInput.characters = 5;
        
        // Aggiungiamo uno slider per l'angolo della linea
        var lineAngleSlider = lineAngleGroup.add("slider", undefined, 0, 0, 360);
        lineAngleSlider.preferredSize.width = 120;
        
        lineAngleSlider.onChanging = function() {
            lineAngleInput.text = Math.round(this.value).toString();
        };
        
        lineAngleInput.onChange = function() {
            var val = parseInt(this.text);
            if (!isNaN(val) && val >= 0 && val <= 360) {
                lineAngleSlider.value = val;
            }
        };
        
        // Aggiungiamo il pannello per le variazioni (mancante nel codice originale)
        var variationsPanel = myPanel.add("panel", undefined, "Variazioni");
        variationsPanel.orientation = "column";
        variationsPanel.alignChildren = ["fill", "top"];
        variationsPanel.spacing = 5;
        variationsPanel.margins = 10;
        
        // Checkbox per randomizzazione
        var randomCheck = variationsPanel.add("checkbox", undefined, "Randomizza valori");
        randomCheck.value = false;
        
        // Offset temporale
        var offsetGroup = variationsPanel.add("group");
        offsetGroup.orientation = "row";
        offsetGroup.alignChildren = ["left", "center"];
        
        offsetGroup.add("statictext", undefined, "Offset tempo (s):");
        var offsetInput = offsetGroup.add("edittext", undefined, "0.2");
        offsetInput.characters = 5;
        
        // Aggiungiamo uno slider per l'offset temporale
        var offsetSlider = offsetGroup.add("slider", undefined, 0.2, 0, 2);
        offsetSlider.preferredSize.width = 120;
        
        offsetSlider.onChanging = function() {
            offsetInput.text = this.value.toFixed(2);
        };
        
        offsetInput.onChange = function() {
            var val = parseFloat(this.text);
            if (!isNaN(val) && val >= 0 && val <= 2) {
                offsetSlider.value = val;
            }
        };
        
        // Variazioni di proprietà
        var propGroup1 = variationsPanel.add("group");
        propGroup1.orientation = "row";
        propGroup1.alignChildren = ["left", "center"];
        
        propGroup1.add("statictext", undefined, "Variazione scala (%):");
        var scaleInput = propGroup1.add("edittext", undefined, "0");
        scaleInput.characters = 5;
        
        // Aggiungiamo uno slider per la variazione di scala
        var scaleSlider = propGroup1.add("slider", undefined, 0, -100, 100);
        scaleSlider.preferredSize.width = 120;
        
        scaleSlider.onChanging = function() {
            scaleInput.text = Math.round(this.value).toString();
        };
        
        scaleInput.onChange = function() {
            var val = parseInt(this.text);
            if (!isNaN(val) && val >= -100 && val <= 100) {
                scaleSlider.value = val;
            }
        };
        
        propGroup1.add("statictext", undefined, "Rotazione (°):");
        var rotationInput = propGroup1.add("edittext", undefined, "0");
        rotationInput.characters = 5;
        
        // Aggiungiamo uno slider per la variazione di rotazione
        var rotationSlider = propGroup1.add("slider", undefined, 0, -180, 180);
        rotationSlider.preferredSize.width = 120;
        
        rotationSlider.onChanging = function() {
            rotationInput.text = Math.round(this.value).toString();
        };
        
        rotationInput.onChange = function() {
            var val = parseInt(this.text);
            if (!isNaN(val) && val >= -180 && val <= 180) {
                rotationSlider.value = val;
            }
        };
        
        var propGroup2 = variationsPanel.add("group");
        propGroup2.orientation = "row";
        propGroup2.alignChildren = ["left", "center"];
        
        propGroup2.add("statictext", undefined, "Variazione opacità (%):");
        var opacityInput = propGroup2.add("edittext", undefined, "0");
        opacityInput.characters = 5;
        
        // Aggiungiamo uno slider per la variazione di opacità
        var opacitySlider = propGroup2.add("slider", undefined, 0, -100, 100);
        opacitySlider.preferredSize.width = 120;
        
        opacitySlider.onChanging = function() {
            opacityInput.text = Math.round(this.value).toString();
        };
        
        opacityInput.onChange = function() {
            var val = parseInt(this.text);
            if (!isNaN(val) && val >= -100 && val <= 100) {
                opacitySlider.value = val;
            }
        };
        
        var randomAmountGroup = variationsPanel.add("group");
        randomAmountGroup.enabled = false;
        randomAmountGroup.add("statictext", undefined, "Intensità random (%):");
        var randomAmountInput = randomAmountGroup.add("edittext", undefined, "20");
        randomAmountInput.characters = 5;
        
        // Aggiungiamo uno slider per l'intensità della randomizzazione
        var randomAmountSlider = randomAmountGroup.add("slider", undefined, 20, 0, 100);
        randomAmountSlider.preferredSize.width = 120;
        
        randomAmountSlider.onChanging = function() {
            randomAmountInput.text = Math.round(this.value).toString();
        };
        
        randomAmountInput.onChange = function() {
            var val = parseInt(this.text);
            if (!isNaN(val) && val >= 0 && val <= 100) {
                randomAmountSlider.value = val;
            }
        };
        
        randomCheck.onClick = function() {
            randomAmountGroup.enabled = randomCheck.value;
        };
        
        // Opzioni aggiuntive
        var optionsPanel = myPanel.add("panel", undefined, "Opzioni");
        optionsPanel.orientation = "column";
        optionsPanel.alignChildren = ["fill", "top"];
        optionsPanel.spacing = 5;
        optionsPanel.margins = 10;
        
        // Checkbox per mantenere il livello originale
        var keepOriginalCheck = optionsPanel.add("checkbox", undefined, "Mantieni livello originale");
        keepOriginalCheck.value = true;
        
        // Checkbox per creare un controllo null
        var createNullCheck = optionsPanel.add("checkbox", undefined, "Crea controllo null");
        createNullCheck.value = true;
        
        // Checkbox per orientare verso il centro
        var orientToCenterCheck = optionsPanel.add("checkbox", undefined, "Orienta verso il centro");
        orientToCenterCheck.value = false;
        
        // Gruppo per i pulsanti
        var buttonGroup = myPanel.add("group");
        buttonGroup.orientation = "row";
        buttonGroup.alignChildren = ["center", "center"];
        buttonGroup.spacing = 10;
        
        // Pulsante di duplicazione
        var dupButton = buttonGroup.add("button", undefined, "Duplica");
        dupButton.preferredSize.width = 120;
        
        // Pulsante di reset
        var resetButton = buttonGroup.add("button", undefined, "Reset");
        resetButton.preferredSize.width = 80;
        
        // Etichetta di stato
        var statusText = myPanel.add("statictext", undefined, "");
        statusText.alignment = ["fill", "bottom"];
        
        // Funzione per validare gli input
        function validateInputs() {
            var values = {};
            
            // Valori comuni
            values.distType = distTypeDropdown.selection.index;
            values.offset = parseFloat(offsetInput.text);
            values.scaleVar = parseFloat(scaleInput.text);
            values.rotationVar = parseFloat(rotationInput.text);
            values.opacityVar = parseFloat(opacityInput.text);
            values.randomize = randomCheck.value;
            values.randomAmount = parseFloat(randomAmountInput.text) / 100;
            
            // Valori specifici per tipo di distribuzione
            switch(values.distType) {
                case 0: // Griglia
                    values.rows = parseInt(rowsInput.text);
                    values.cols = parseInt(colsInput.text);
                    values.spacingX = parseFloat(spacingXInput.text);
                    values.spacingY = parseFloat(spacingYInput.text);
                    
                    if (isNaN(values.rows) || isNaN(values.cols) || 
                        isNaN(values.spacingX) || isNaN(values.spacingY) ||
                        values.rows <= 0 || values.cols <= 0) {
                        alert("Errore: inserisci valori numerici validi per righe, colonne e spaziatura.");
                        return null;
                    }
                    break;
                    
                case 1: // Cerchio
                    values.radius = parseFloat(radiusInput.text);
                    values.count = parseInt(circleCountInput.text);
                    values.startAngle = parseFloat(startAngleInput.text) * Math.PI / 180;
                    
                    if (isNaN(values.radius) || isNaN(values.count) || isNaN(values.startAngle) ||
                        values.radius <= 0 || values.count <= 0) {
                        alert("Errore: inserisci valori numerici validi per raggio e numero elementi.");
                        return null;
                    }
                    break;
                    
                case 2: // Spirale
                    values.count = parseInt(spiralCountInput.text);
                    values.startRadius = parseFloat(spiralStartRadiusInput.text);
                    values.radiusGrowth = parseFloat(spiralGrowthInput.text);
                    values.angleStep = parseFloat(spiralAngleInput.text) * Math.PI / 180;
                    
                    if (isNaN(values.count) || isNaN(values.startRadius) || 
                        isNaN(values.radiusGrowth) || isNaN(values.angleStep) ||
                        values.count <= 0 || values.startRadius < 0) {
                        alert("Errore: inserisci valori numerici validi per la spirale.");
                        return null;
                    }
                    break;
                    
                case 3: // Linea
                    values.count = parseInt(lineCountInput.text);
                    values.spacing = parseFloat(lineSpacingInput.text);
                    values.angle = parseFloat(lineAngleInput.text) * Math.PI / 180;
                    
                    if (isNaN(values.count) || isNaN(values.spacing) || isNaN(values.angle) ||
                        values.count <= 0 || values.spacing <= 0) {
                        alert("Errore: inserisci valori numerici validi per la linea.");
                        return null;
                    }
                    break;
            }
            
            // Verifica valori comuni
            if (isNaN(values.offset) || isNaN(values.scaleVar) || 
                isNaN(values.rotationVar) || isNaN(values.opacityVar) ||
                (values.randomize && isNaN(values.randomAmount))) {
                alert("Errore: inserisci valori numerici validi per offset e variazioni.");
                return null;
            }
            
            return values;
        }
        
        // Funzione per resettare i campi ai valori predefiniti
        resetButton.onClick = function() {
            // Reset valori griglia
            rowsInput.text = "3";
            colsInput.text = "3";
            spacingXInput.text = "200";
            spacingYInput.text = "200";
            spacingXSlider.value = 200;
            spacingYSlider.value = 200;
            
            // Reset valori cerchio
            radiusInput.text = "300";
            radiusSlider.value = 300;
            circleCountInput.text = "8";
            startAngleInput.text = "0";
            startAngleSlider.value = 0;
            
            // Reset valori spirale
            spiralCountInput.text = "12";
            spiralStartRadiusInput.text = "50";
            spiralStartRadiusSlider.value = 50;
            spiralGrowthInput.text = "20";
            spiralGrowthSlider.value = 20;
            spiralAngleInput.text = "30";
            spiralAngleSlider.value = 30;
            
            // Reset valori linea
            lineCountInput.text = "5";
            lineSpacingInput.text = "150";
            lineSpacingSlider.value = 150;
            lineAngleInput.text = "0";
            lineAngleSlider.value = 0;
            
            // Reset valori comuni
            offsetInput.text = "0.2";
            offsetSlider.value = 0.2;
            scaleInput.text = "0";
            scaleSlider.value = 0;
            rotationInput.text = "0";
            rotationSlider.value = 0;
            opacityInput.text = "0";
            opacitySlider.value = 0;
            randomCheck.value = false;
            randomAmountGroup.enabled = false;
            randomAmountInput.text = "20";
            randomAmountSlider.value = 20;
            
            // Reset opzioni
            keepOriginalCheck.value = true;
            createNullCheck.value = true;
            orientToCenterCheck.value = false;
            
            // Reset tipo distribuzione
            distTypeDropdown.selection = 0;
            gridPanel.visible = true;
            circlePanel.visible = false;
            spiralPanel.visible = false;
            linePanel.visible = false;
            
            statusText.text = "Valori reimpostati";
            myPanel.layout.layout(true);
        };
        
        // Funzione principale per la duplicazione
        dupButton.onClick = function() {
            // Verifica che ci sia un progetto aperto
            if (!app.project) {
                alert("Nessun progetto aperto.");
                return;
            }
            
            // Verifica che ci sia una composizione attiva
            var comp = app.project.activeItem;
            if (!(comp instanceof CompItem)) {
                alert("Seleziona una composizione attiva.");
                return;
            }
            
            // Verifica che ci sia un livello selezionato
            if (comp.selectedLayers.length !== 1) {
                alert("Seleziona una sola precomposizione da duplicare.");
                return;
            }
            
            var selectedLayer = comp.selectedLayers[0];
            
            // Verifica che il livello selezionato abbia le proprietà necessarie
            try {
                // Verifica che il livello abbia le proprietà necessarie
                var testPos = selectedLayer.property("Position");
                var testScale = selectedLayer.property("Scale");
                var testRotation = selectedLayer.property("Rotation");
                var testOpacity = selectedLayer.property("Opacity");
            } catch (e) {
                alert("Il livello selezionato non ha tutte le proprietà necessarie (Position, Scale, Rotation, Opacity).");
                return;
            }
            
            // Valida gli input
            var values = validateInputs();
            if (!values) return;
            
            // Inizia il gruppo di undo
            app.beginUndoGroup("AE Duplicator");
            
            try {
                // Memorizza le proprietà del livello originale
                var basePos = selectedLayer.property("Position").value;
                var baseScale = selectedLayer.property("Scale").value;
                var baseRotation = selectedLayer.property("Rotation").value;
                var baseOpacity = selectedLayer.property("Opacity").value;
                
                // Array per tenere traccia di tutti i livelli creati
                var allLayers = [];
                if (keepOriginalCheck.value) {
                    allLayers.push(selectedLayer);
                }
                
                // Contatore per i livelli creati
                var createdLayers = 0;
                var positions = [];
                
                // Calcola le posizioni in base al tipo di distribuzione
                switch(values.distType) {
                    case 0: // Griglia
                        for (var r = 0; r < values.rows; r++) {
                            for (var c = 0; c < values.cols; c++) {
                                var posX = basePos[0] + c * values.spacingX;
                                var posY = basePos[1] + r * values.spacingY;
                                positions.push({
                                    x: posX, 
                                    y: posY,
                                    angle: 0
                                });
                            }
                        }
                        break;
                        
                    case 1: // Cerchio
                        for (var i = 0; i < values.count; i++) {
                            var angle = values.startAngle + (i * 2 * Math.PI / values.count);
                            var posX = basePos[0] + Math.cos(angle) * values.radius;
                            var posY = basePos[1] + Math.sin(angle) * values.radius;
                            positions.push({
                                x: posX,
                                y: posY,
                                angle: angle
                            });
                        }
                        break;
                        
                    case 2: // Spirale
                        for (var i = 0; i < values.count; i++) {
                            var angle = i * values.angleStep;
                            var radius = values.startRadius + (i * values.radiusGrowth);
                            var posX = basePos[0] + Math.cos(angle) * radius;
                            var posY = basePos[1] + Math.sin(angle) * radius;
                            positions.push({
                                x: posX,
                                y: posY,
                                angle: angle
                            });
                        }
                        break;
                        
                    case 3: // Linea
                        for (var i = 0; i < values.count; i++) {
                            var posX = basePos[0] + Math.cos(values.angle) * i * values.spacing;
                            var posY = basePos[1] + Math.sin(values.angle) * i * values.spacing;
                            positions.push({
                                x: posX,
                                y: posY,
                                angle: values.angle
                            });
                        }
                        break;
                }
                
                // Rimuovi la posizione originale se necessario
                if (!keepOriginalCheck.value) {
                    positions.shift(); // Rimuove la prima posizione (quella originale)
                }
                
                // Crea un null di controllo se richiesto
                var controlNull = null;
                if (createNullCheck.value) {
                    try {
                        controlNull = comp.layers.addNull();
                        controlNull.name = "Controllo_" + selectedLayer.name;
                        controlNull.property("Position").setValue([0, 0]); // Impostiamo la posizione a 0,0 invece di basePos
                        
                        // Aggiungiamo gli slider control per ogni elemento duplicato
                        if (controlNull) {
                            // Creiamo un gruppo di effetti per ogni elemento duplicato
                            for (var i = 0; i < positions.length; i++) {
                                // Salta il primo elemento se è l'originale
                                if (i === 0 && keepOriginalCheck.value) {
                                    // Aggiungiamo comunque controlli per l'originale
                                    var sliderGroupOriginal = controlNull.Effects.addProperty("ADBE Slider Control");
                                    sliderGroupOriginal.name = "Elemento Originale";
                                    
                                    // Aggiungiamo slider per posizione X
                                    var posXOriginal = controlNull.Effects.addProperty("ADBE Slider Control");
                                    posXOriginal.name = "Pos X Originale";
                                    posXOriginal.property("Slider").setValue(0);
                                    
                                    // Aggiungiamo slider per posizione Y
                                    var posYOriginal = controlNull.Effects.addProperty("ADBE Slider Control");
                                    posYOriginal.name = "Pos Y Originale";
                                    posYOriginal.property("Slider").setValue(0);
                                    
                                    // Aggiungiamo slider per scala
                                    var scaleOriginal = controlNull.Effects.addProperty("ADBE Slider Control");
                                    scaleOriginal.name = "Scala Originale";
                                    scaleOriginal.property("Slider").setValue(100);
                                    
                                    // Aggiungiamo slider per rotazione
                                    var rotationOriginal = controlNull.Effects.addProperty("ADBE Slider Control");
                                    rotationOriginal.name = "Rotazione Originale";
                                    rotationOriginal.property("Slider").setValue(0);
                                    
                                    // Aggiungiamo slider per opacità
                                    var opacityOriginal = controlNull.Effects.addProperty("ADBE Slider Control");
                                    opacityOriginal.name = "Opacità Originale";
                                    opacityOriginal.property("Slider").setValue(100);
                                    
                                    // Colleghiamo gli slider alle proprietà del livello originale
                                    var posExpr = "var nullLayer = thisComp.layer(\"" + controlNull.name + "\");\n" +
                                                 "var basePos = [" + basePos[0] + ", " + basePos[1] + "];\n" +
                                                 "basePos + [nullLayer.effect(\"Pos X Originale\")(\"Slider\"), nullLayer.effect(\"Pos Y Originale\")(\"Slider\")]";
                                    selectedLayer.property("Position").expression = posExpr;
                                    
                                    var scaleExpr = "var nullLayer = thisComp.layer(\"" + controlNull.name + "\");\n" +
                                                   "var baseScale = [" + baseScale[0] + ", " + baseScale[1] + "];\n" +
                                                   "baseScale * nullLayer.effect(\"Scala Originale\")(\"Slider\") / 100";
                                    selectedLayer.property("Scale").expression = scaleExpr;
                                    
                                    var rotExpr = "var nullLayer = thisComp.layer(\"" + controlNull.name + "\");\n" +
                                                 "var baseRot = " + baseRotation + ";\n" +
                                                 "baseRot + nullLayer.effect(\"Rotazione Originale\")(\"Slider\")";
                                    selectedLayer.property("Rotation").expression = rotExpr;
                                    
                                    var opacityExpr = "var nullLayer = thisComp.layer(\"" + controlNull.name + "\");\n" +
                                                     "var baseOpacity = " + baseOpacity + ";\n" +
                                                     "nullLayer.effect(\"Opacità Originale\")(\"Slider\")";
                                    selectedLayer.property("Opacity").expression = opacityExpr;
                                    
                                    continue;
                                }
                                
                                var elementIndex = i + 1;
                                var elementName = "Elemento " + elementIndex;
                                
                                // Aggiungiamo un separatore per ogni elemento
                                var sliderGroup = controlNull.Effects.addProperty("ADBE Slider Control");
                                sliderGroup.name = elementName;
                                
                                // Aggiungiamo slider per posizione X
                                var posX = controlNull.Effects.addProperty("ADBE Slider Control");
                                posX.name = "Pos X " + elementIndex;
                                posX.property("Slider").setValue(0);
                                
                                // Aggiungiamo slider per posizione Y
                                var posY = controlNull.Effects.addProperty("ADBE Slider Control");
                                posY.name = "Pos Y " + elementIndex;
                                posY.property("Slider").setValue(0);
                                
                                // Aggiungiamo slider per scala
                                var scale = controlNull.Effects.addProperty("ADBE Slider Control");
                                scale.name = "Scala " + elementIndex;
                                scale.property("Slider").setValue(100);
                                
                                // Aggiungiamo slider per rotazione
                                var rotation = controlNull.Effects.addProperty("ADBE Slider Control");
                                rotation.name = "Rotazione " + elementIndex;
                                rotation.property("Slider").setValue(0);
                                
                                // Aggiungiamo slider per opacità
                                var opacity = controlNull.Effects.addProperty("ADBE Slider Control");
                                opacity.name = "Opacità " + elementIndex;
                                opacity.property("Slider").setValue(100);
                            }
                        }
                    } catch (e) {
                        alert("Errore nella creazione degli slider: " + e.toString());
                    }
                }
                
                // Crea i duplicati
                for (var i = 0; i < positions.length; i++) {
                    // Salta la prima posizione se è quella originale e vogliamo mantenerla
                    if (i === 0 && keepOriginalCheck.value) continue;
                    
                    // Duplica il livello
                    var newLayer = selectedLayer.duplicate();
                    newLayer.name = selectedLayer.name + "_" + (i + 1);
                    
                    // Calcola le variazioni
                    var timeOffset = values.offset * i;
                    var scaleVariation = values.scaleVar * i;
                    var rotationVariation = values.rotationVar * i;
                    var opacityVariation = values.opacityVar * i;
                    
                    // Aggiungi randomizzazione se richiesto
                    if (values.randomize) {
                        timeOffset += (Math.random() - 0.5) * values.offset * values.randomAmount;
                        scaleVariation += (Math.random() - 0.5) * values.scaleVar * values.randomAmount;
                        rotationVariation += (Math.random() - 0.5) * values.rotationVar * values.randomAmount;
                        opacityVariation += (Math.random() - 0.5) * values.opacityVar * values.randomAmount;
                    }
                    
                    // Imposta la posizione
                    newLayer.property("Position").setValue([positions[i].x, positions[i].y]);
                    
                    // Imposta la rotazione (orienta verso il centro se richiesto)
                    if (orientToCenterCheck.value) {
                        var angleToCenter = Math.atan2(basePos[1] - positions[i].y, basePos[0] - positions[i].x);
                        newLayer.property("Rotation").setValue(baseRotation + (angleToCenter * 180 / Math.PI));
                    } else {
                        newLayer.property("Rotation").setValue(baseRotation + rotationVariation);
                    }
                    
                    // Imposta scala e opacità
                    var newScale = [baseScale[0] + scaleVariation, baseScale[1] + scaleVariation];
                    newLayer.property("Scale").setValue(newScale);
                    newLayer.property("Opacity").setValue(baseOpacity + opacityVariation);
                    
                    // Imposta l'offset temporale
                    if (timeOffset !== 0) {
                        newLayer.startTime += timeOffset;
                    }
                    
                    // Parenta al null di controllo se esiste
                    if (controlNull) {
                        newLayer.parent = controlNull;
                        
                        // Colleghiamo gli slider alle proprietà del livello
                        var elementIndex = i + 1;
                        
                        var posExpr = "var nullLayer = thisComp.layer(\"" + controlNull.name + "\");\n" +
                                     "var basePos = [" + positions[i].x + ", " + positions[i].y + "];\n" +
                                     "basePos + [nullLayer.effect(\"Pos X " + elementIndex + "\")(\"Slider\"), nullLayer.effect(\"Pos Y " + elementIndex + "\")(\"Slider\")]";
                        newLayer.property("Position").expression = posExpr;
                        
                        var scaleExpr = "var nullLayer = thisComp.layer(\"" + controlNull.name + "\");\n" +
                                       "var baseScale = [" + newScale[0] + ", " + newScale[1] + "];\n" +
                                       "baseScale * nullLayer.effect(\"Scala " + elementIndex + "\")(\"Slider\") / 100";
                        newLayer.property("Scale").expression = scaleExpr;
                        
                        var rotValue = orientToCenterCheck.value ? 
                                      baseRotation + (angleToCenter * 180 / Math.PI) : 
                                      baseRotation + rotationVariation;
                        
                        var rotExpr = "var nullLayer = thisComp.layer(\"" + controlNull.name + "\");\n" +
                                     "var baseRot = " + rotValue + ";\n" +
                                     "baseRot + nullLayer.effect(\"Rotazione " + elementIndex + "\")(\"Slider\")";
                        newLayer.property("Rotation").expression = rotExpr;
                        
                        var opacityExpr = "var nullLayer = thisComp.layer(\"" + controlNull.name + "\");\n" +
                                         "var baseOpacity = " + (baseOpacity + opacityVariation) + ";\n" +
                                         "nullLayer.effect(\"Opacità " + elementIndex + "\")(\"Slider\")";
                        newLayer.property("Opacity").expression = opacityExpr;
                    }
                    
                    // Aggiungi all'array dei livelli creati
                    allLayers.push(newLayer);
                    createdLayers++;
                }
                
                // Aggiorna il testo di stato
                statusText.text = "Creati " + createdLayers + " duplicati";
                
            } catch (e) {
                alert("Errore durante la duplicazione: " + e.toString());
            } finally {
                // Termina il gruppo di undo
                app.endUndoGroup();
            }
        };
        
        // Ridimensiona il pannello
        myPanel.onResizing = myPanel.onResize = function() {
            this.layout.resize();
        };
        
        // Mostra il pannello
        if (myPanel instanceof Window) {
            myPanel.center();
            myPanel.show();
        } else {
            myPanel.layout.layout(true);
        }
        
        return myPanel;
    }
    
    // Verifica l'ambiente e avvia lo script
    if (checkEnvironment()) {
        var myScriptPal = buildUI(thisObj);
    }
    
})(this);
