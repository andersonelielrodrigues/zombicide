/*
    main.js v 1.3   Zombicide
    v 1.3   2019-02-15  Anderson E A Rodrigues - andersonelielrodrigues@gmail.com
                        Vinicius Minotti - viniminotti@hotmail.com
    v 1.2   2019-02-08
    v 1.1   2019-02-07
    v 1.0   2019-02-06
*/
constructor();

function constructor() {
    // carrega as div containers
    this.oControls = document.getElementById("controls");
    this.oTable = document.getElementById("table");

    // carrega variáveis de drag n drop
    this.vTop = this.vLeft = this.vStartX = this.vStartY = this.vEndX = this.vEndY = 0;

    // carrega arquivo de configurações
    this.jConfig = loadSet("resources/config.json");

    // carrega spritesheets
    loadSprites();

    // carrega arquivo de missões
    this.jMissions = loadSet("resources/missions.json");

    // carrega combo de missões
    loadComboMission();

    // carrega arquivo de itens
    this.jDeckItem = loadSet("resources/items.json");

    this.vLastItemId = null;
    
    // carrega deck de itens
    this.oDeckItem = loadDeck(this.jConfig.itemdeck);

    // carrega arquivo de spawns
    this.jDeckSpawn = loadSet("resources/spawns.json");

    this.vLastSpawnId = null;
    
    // carrega deck de spawns
    this.oDeckSpawn = loadDeck(this.jConfig.spawndeck);

    // carrega fonte dos contadores
    loadFonts("LandSpeedRecord");
}

// carrega objeto JSON
function loadSet(pFile) {
    return $.ajax({
        url: pFile,
        dataType: "json",
        async: false,
        success: function(oResponse) {
            return oResponse;
        }
    }).responseJSON;
}

// carrega spritesheets
function loadSprites() {
    // carrega charset - spritesheet de personagens
    this.jCharset = loadSet(this.jConfig.charset);

    this.oCharset = loadObject(this.jCharset);

    this.jLogo = this.jCharset.logo;

    this.jCharGeneral = this.jCharset.frames.general;
    this.jSurvivors = this.jCharset.frames.survivors;
    this.jZombies = this.jCharset.frames.zombies;
    this.jCharMisc = this.jCharset.frames.misc;

    // carrega tileset - spritesheet de tabuleiro
    this.jTileset = loadSet(this.jConfig.tileset);

    this.oTileset = loadObject(this.jTileset);

    this.jTileGeneral = this.jTileset.frames.general;
    this.jTiles = this.jTileset.frames.tiles;

    // carrega tokenset - spritesheet de tokens
    this.jTokenset = loadSet(this.jConfig.tokenset);

    this.oTokenset = loadObject(this.jTokenset);

    this.jTokenGeneral = this.jTokenset.frames.general;
    this.jDoors = this.jTokenset.frames.doors;
    this.jObjectives = this.jTokenset.frames.objectives;
    this.jSpawnTokens = this.jTokenset.frames.spawns;
    this.jTokenMisc = this.jTokenset.frames.misc;

    // carrega itemset - spritesheet de itens
    this.jItemset = loadSet(this.jConfig.itemset);

    this.oItemset = loadObject(this.jItemset);

    this.jItemGeneral = this.jItemset.frames.general;
    this.jItems = this.jItemset.frames.items;

    // carrega spawnset - spritesheet de spawns
    this.jSpawnset = loadSet(this.jConfig.spawnset);

    this.oSpawnset = loadObject(this.jSpawnset);

    this.jSpawnGeneral = this.jSpawnset.frames.general;
    this.jSpawns = this.jSpawnset.frames.spawns;

    // carrega sheetset - spritesheet de ficha de personagem
    this.jSheetset = loadSet(this.jConfig.sheetset);

    this.oSheetset = loadObject(this.jSheetset);

    this.jSheetGeneral = this.jSheetset.frames.general;
    this.jSheets = this.jSheetset.frames.sheet;
}

// carrega objeto imagem
function loadObject(pSet) {
    var oSet = new Image();

    oSet.id = pSet.image.id;
    oSet.width = pSet.image.width;
    oSet.height = pSet.image.height;
    oSet.src = pSet.image.src;

    return oSet;
}

// carrega combo de missões
function loadComboMission() {
    var oMissions = document.getElementById("sMissions"),
        vCount = Object.keys(this.jMissions).length,
        oOption;

    for(var i = 0; i < vCount; i++) {
        oOption = document.createElement("option");

        oOption.value = i;
        oOption.innerHTML = this.jMissions[i].title;

        oMissions.appendChild(oOption);
    }
}

// carrega decks
function loadDeck(pQtd) {
    var oDeck = [];

    for(var i = 1; i <= pQtd; i++) {
        oDeck.push(i);
    }

    // emabaralha o deck
    return shuffleDeck(oDeck);
}

// embaralha o deck
function shuffleDeck(pDeck) {
    var vRand, vTmp;

    for(var i = 0; i < pDeck.length; i++) {
        vRand = Math.floor(Math.random() * pDeck.length);
        vTmp = pDeck[i];

        pDeck[i] = pDeck[vRand];
        pDeck[vRand] = vTmp;
    }

    return pDeck;
}

// carrega fontes
function loadFonts(pFont) {
    var oFont = new FontFace(pFont, "url(resources/fonts/" + pFont + ".ttf)");

    oFont.load().then(function(pFont) {
        document.fonts.add(pFont);
    });
}

// inicia tela
window.onload = function() {
    // carrega logo
    var oLogoOptions = loadOptions();

    loadImage(this.jLogo, this.oCharset, oLogoOptions, null, null);

    // carrega missão
    loadMission(0);

    // carrega personagens
    var oCharOptions = loadOptions(this.jCharset);

    // carrega sobreviventes
    loadImage(this.jSurvivors.Amy, this.oCharset, oCharOptions, null, null);
    loadImage(this.jSurvivors.Doug, this.oCharset, oCharOptions, null, null);
    loadImage(this.jSurvivors.Josh, this.oCharset, oCharOptions, null, null);
    loadImage(this.jSurvivors.Ned, this.oCharset, oCharOptions, null, null);
    loadImage(this.jSurvivors.Phil, this.oCharset, oCharOptions, null, null);
    loadImage(this.jSurvivors.Wanda, this.oCharset, oCharOptions, null, null);

    oCharOptions.Open = false;

    // carrega zumbis
    loadImage(this.jZombies.Walker, this.oCharset, oCharOptions, null, null);
    loadImage(this.jZombies.Runner, this.oCharset, oCharOptions, null, null);
    loadImage(this.jZombies.Fatty, this.oCharset, oCharOptions, null, null);
    loadImage(this.jZombies.Abomination, this.oCharset, oCharOptions, null, null);

    // carrega carros
    oCharOptions.Rotate = true;

    loadImage(this.jCharMisc.Police_Car, this.oCharset, oCharOptions, null, null);
    loadImage(this.jCharMisc.Pimp_Car, this.oCharset, oCharOptions, null, null);

    oCharOptions.Rotate = false;

    loadImage(this.jCharMisc.Noise, this.oCharset, oCharOptions, null, null);

    // carrega tokens
    var oTokenOptions = loadOptions(this.jTokenset);

    // carrega portas
    oTokenOptions.Flip = true;

    oTokenOptions.FTop = this.jDoors.Door_Open.top;
    oTokenOptions.FLeft = this.jDoors.Door_Open.left;
    oTokenOptions.UTop = this.jDoors.Door.top;
    oTokenOptions.ULeft = this.jDoors.Door.left;

    loadImage(this.jDoors.Door, this.oTokenset, oTokenOptions, null, null);

    // carrega portas azuis
    oTokenOptions.FTop = this.jDoors.Blue_Door_Open.top;
    oTokenOptions.FLeft = this.jDoors.Blue_Door_Open.left;
    oTokenOptions.UTop = this.jDoors.Blue_Door.top;
    oTokenOptions.ULeft = this.jDoors.Blue_Door.left;

    loadImage(this.jDoors.Blue_Door, this.oTokenset, oTokenOptions, null, null);

    // carrega portas verdes
    oTokenOptions.FTop = this.jDoors.Green_Door_Open.top;
    oTokenOptions.FLeft = this.jDoors.Green_Door_Open.left;
    oTokenOptions.UTop = this.jDoors.Green_Door.top;
    oTokenOptions.ULeft = this.jDoors.Green_Door.left;

    loadImage(this.jDoors.Green_Door, this.oTokenset, oTokenOptions, null, null);

    // carrega objetivos
    oTokenOptions.Flip = false;
    oTokenOptions.Rotate = false;

    loadImage(this.jObjectives.Objective, this.oTokenset, oTokenOptions, null, null);

    // carrega objetivos azuis
    loadImage(this.jObjectives.Blue_Objective, this.oTokenset, oTokenOptions, null, null);

    // carrega objetivos verdes
    loadImage(this.jObjectives.Green_Objective, this.oTokenset, oTokenOptions, null, null);

    oTokenOptions.Rotate = true;

    // carrega spawns
    loadImage(this.jSpawnTokens.Spawn, this.oTokenset, oTokenOptions, null, null);

    // carrega spawns azuis
    loadImage(this.jSpawnTokens.Blue_Spawn, this.oTokenset, oTokenOptions, null, null);

    // carrega exit
    loadImage(this.jTokenMisc.Exit, this.oTokenset, oTokenOptions, null, null);

    // carrega entry
    oTokenOptions.Rotate = false;

    loadImage(this.jTokenMisc.Entry, this.oTokenset, oTokenOptions, null, null);

    oTokenOptions.Rotate = true;
    
    // carrega opções de items
    var oItemOptions = loadOptions(this.jItemset);

    // carrega opções de texto de items
    var oItemTxt = loadText(this.jItemset, this.jConfig.itemdeck);
   
    // carrega verso do deck de itens
    loadImage(this.jItems.Verso, this.oItemset, oItemOptions, oItemTxt, null);

    // carrega opções de spawns
    var oSpawnOptions = loadOptions(this.jSpawnset);

    // carrega opções de texto de spawns
    var oSpawnTxt = loadText(this.jSpawnset, this.jConfig.spawndeck);

    // carrega verso do deck de spawns
    loadImage(this.jSpawns.Verso, this.oSpawnset, oSpawnOptions, oSpawnTxt, null);

    //carrega itens da missão
    var jMission = loadSet(this.jMissions[0].src);

    loadMissionItems(jMission.items);
}

// carrega missão
function loadMission(pId) {
    var jMission = loadSet(this.jMissions[pId].src);

    var oTileOptions = loadOptions(this.jTileset),
        vCount = Object.keys(jMission.tiles).length,
        vTile;

    for(var i = 0; i < vCount; i++) {
        vTile = jMission.tiles[i].tile;

        this.jTiles[vTile].x = jMission.tiles[i].x;
        this.jTiles[vTile].y = jMission.tiles[i].y;

        loadImage(this.jTiles[vTile], this.oTileset, oTileOptions, null, 1);

        if(jMission.tiles[i].rotate > 0) {
            for(var j = 0; j < jMission.tiles[i].rotate; j++) {
                rotateImg(this.jTiles[vTile].id + "_1");
            }
        }
    }
}

// carrega itens da missão
function loadMissionItems(pItems) {
    var vCount = Object.keys(pItems).length,
        vItem;

    for(var i = 0; i < vCount; i++) {
        vItem = pItems[i];

        var oImg = document.getElementById(vItem.item);

        var vPosition = oImg.style.position,
            vRotate = oImg.style.transform,
            vZIndex = oImg.style["z-index"];

        oImg.style = "position:" + vPosition + ";left:" + vItem.left + ";top:" + vItem.top + ";transform:" + vRotate + ";z-index:" + vZIndex;

        if(vItem.rotate > 0) {
            for(var j = 0; j < vItem.rotate; j++) {
                rotateImg(vItem.item);
            }
        }

        if(vItem.flip) {
            flipImg(vItem.item);
        }
    }
}

// carrega opções (configurações)
function loadOptions(pSet) {
    var oOptions =[];

    if(!pSet) {
        oOptions.Mime = this.jCharset.image.mime;
        oOptions.Position = this.jCharset.logo.position;
        oOptions.Container = this.jCharset.logo.container;
        
        oOptions.Drag = oOptions.Rotate = oOptions.Flip = oOptions.Destroy = oOptions.Draw = oOptions.Open = false;
    } else {
        oOptions.Mime = pSet.image.mime;
        oOptions.Position = pSet.frames.general.position;
        oOptions.Container = pSet.frames.general.container;
        oOptions.Drag = pSet.frames.general.drag;
        oOptions.Rotate = pSet.frames.general.rotate;
        oOptions.Flip = pSet.frames.general.flip;
        oOptions.Destroy = pSet.frames.general.destroy;
        oOptions.DrawItem = pSet.frames.general.drawItem;
        oOptions.DrawSpawn = pSet.frames.general.drawSpawn;
        oOptions.Open = pSet.frames.general.open;
    }

    oOptions.FTop = oOptions.FLeft = oOptions.UTop = oOptions.ULeft = 0;

    return oOptions;
}

// carrega texto
function loadText(pSet, pTxt) {
    var oTxt = [];

    oTxt.Font = pSet.frames.general.text.font;
    oTxt.Size = pSet.frames.general.text.size;
    oTxt.FillStyle = pSet.frames.general.text.fillStyle;
    oTxt.ShadowOffset = pSet.frames.general.text.shadowOffset;
    oTxt.ShadowColor = pSet.frames.general.text.shadowColor;
    oTxt.ShadowBlur = pSet.frames.general.text.shadowBlur;
    oTxt.TxtX = pSet.frames.general.text.txtX;
    oTxt.TxtY = pSet.frames.general.text.txtY;
    oTxt.Text = pTxt;

    return oTxt;
}

// carrega imagens
function loadImage(pImage, pSet, pOptions, pTxt, pId) {
    for(var i = 1; i <= pImage.copies; i++) {
        var oImg = new Image(), vId;

        if(pId) {
            vId = pId;
        } else {
            vId = i;
        }

        oImg.id = pImage.id + "_" + vId;
        oImg.width = pImage.width;
        oImg.height = pImage.height;
        oImg.style.position = pOptions.Position;
        oImg.style.top = oImg["data-top"] = pImage.y;
        oImg.style.left = oImg["data-left"] = pImage.x;

        if(pImage.title && pImage.copies > 1) {
            oImg.title = pImage.title + " " + i;
        } else {
            oImg.title = pImage.title;
        }
        
        oImg["data-mime"] = pOptions.Mime;
        oImg["data-flipped"] = false;
        oImg["data-ftop"] = pOptions.FTop;
        oImg["data-fleft"] = pOptions.FLeft;
        oImg["data-utop"] = pOptions.UTop;
        oImg["data-uleft"] = pOptions.ULeft;
        oImg.style["z-index"] = pImage["z-index"];

        // corta e desenha imagem
        oImg.src = drawImg(oImg, pImage.top, pImage.left, pSet, pTxt);

        // carrega evento de drag n drop
        if(pOptions.Drag) {
            oImg.addEventListener("dragstart", function(event) {
                dragStart(event.target.id);
            });

            oImg.addEventListener("dragend", function(event) {
                dragEnd(event.target.id);
            });
        }

        // carrega evento de rotação
        if(pOptions.Rotate) {
            oImg.addEventListener("contextmenu", function(event) {
                rotateImg(event.target.id, null);
            });
        } else {
            oImg.addEventListener("contextmenu", function(event) {
                event.preventDefault();
            });
        }

        // carrega evento de flip
        if(pOptions.Flip) {
            oImg.addEventListener("click", function(event) {
                flipImg(event.target.id);
            });
        }

        // carrega evento de destruição
        if(pOptions.Destroy) {
            oImg.addEventListener("dblclick", function(event) {
                destroyImg(event.target.id, 0);
            });
        }

        // carrega evento de compra de item
        if(pOptions.DrawItem) {
            oImg.addEventListener("click", function() {
                drawCard("Item");
            });
        }

        // carrega evento de compra de spawn
        if(pOptions.DrawSpawn) {
            oImg.addEventListener("click", function() {
                drawCard("Spawn");
            });
        }

        // carrega evento de abertura da ficha
        if(pOptions.Open) {
            oImg.addEventListener("contextmenu", function() {
                openSheet(pImage.title);
            });
        }

        // carrega imagem no container
        eval("this." + pOptions.Container + ".appendChild(oImg);");
    }
}

// corta e desenha a imagem
function drawImg(pImg, pTop, pLeft, pSet, pTxt) {
    var oCanvas = document.createElement("canvas"),
        oContext = oCanvas.getContext("2d");
    
    oCanvas.width = pImg.width;
    oCanvas.height = pImg.height;

    oContext.drawImage(pSet, (pLeft * -1), (pTop * -1));

    if(pTxt !== null) {
        oContext.font = pTxt.Size + " " + pTxt.Font;
        oContext.fillStyle = pTxt.FillStyle;
        oContext.shadowOffsetX = oContext.shadowOffsetY = pTxt.ShadowOffset;
        oContext.shadowColor = pTxt.ShadowColor;
        oContext.shadowBlur = pTxt.ShadowBlur;
        oContext.fillText(pTxt.Text, pTxt.TxtY, pTxt.TxtX);
    }

    return oCanvas.toDataURL(pImg["data-mime"]);
}

// evento de drag n drop (start)
function dragStart(pId) {
    var oImg = document.getElementById(pId);

    this.vTop = oImg.offsetTop;
    this.vLeft = oImg.offsetLeft;

    this.vStartX = event.clientX;
    this.vStartY = event.clientY;
}

// evento de drag n drop (end)
function dragEnd(pId) {
    this.vEndX = event.clientX;
    this.vEndY = event.clientY;

    var vPosX = (this.vEndX - (this.vStartX - this.vLeft)),
        vPosY = (this.vEndY - (this.vStartY - this.vTop));

    var oImg = document.getElementById(pId);

    var vPosition = oImg.style.position,
        vRotate = oImg.style.transform,
        vZIndex = oImg.style["z-index"];

    oImg.style = "position:" + vPosition + ";left:" + vPosX + ";top:" + vPosY + ";transform:" + vRotate + ";z-index:" + vZIndex;
}

// evento de rotação
function rotateImg(pId) {
    var oImg = document.getElementById(pId);

    var vLeft = oImg.offsetLeft,
        vTop = oImg.offsetTop,
        vRotate = oImg.style.transform,
        vPosition = oImg.style.position,
        vZIndex = oImg.style["z-index"];

    event.preventDefault();

    switch (vRotate) {
        case "":
        case "rotate(0deg)":
            oImg.setAttribute("style", "position:" + vPosition + ";left: " + vLeft + ";top: " + vTop + ";transform:rotate(90deg);z-index:" + vZIndex);
            break;
        case "rotate(90deg)":
            oImg.setAttribute("style", "position:" + vPosition + ";left: " + vLeft + ";top: " + vTop + ";transform:rotate(180deg);z-index:" + vZIndex);
            break;
        case "rotate(180deg)":
            oImg.setAttribute("style", "position:" + vPosition + ";left: " + vLeft + ";top: " + vTop + ";transform:rotate(270deg);z-index:" + vZIndex);
            break;
        case "rotate(270deg)":
            oImg.setAttribute("style", "position:" + vPosition + ";left: " + vLeft + ";top: " + vTop + ";transform:rotate(0deg);z-index:" + vZIndex);
            break;
    }
}

// evento de flip
function flipImg(pId) {
    var oImg = document.getElementById(pId),
        vTop, vLeft;

    if(!oImg["data-flipped"]) {
        vTop = oImg["data-ftop"];
        vLeft = oImg["data-fleft"];

        oImg["data-flipped"] = true;
    } else {
        vTop = oImg["data-utop"];
        vLeft = oImg["data-uleft"];

        oImg["data-flipped"] = false;
    }

    oImg.src = drawImg(oImg, vTop, vLeft, this.oTokenset, null);
}

// monta ID para retorno da imagem para a posição inicial
function destroyImg(pId, pCopies) {
    if(pCopies > 0) {
        for(var i = 1; i <= pCopies; i++) {
            resetImg(pId + "_" + i);
        }
    } else {
        resetImg(pId);
    }
}

// retorna a imagem para a posição inicial
function resetImg(pId) {
    oImg = document.getElementById(pId);

    oImg.style.left = oImg["data-left"];
    oImg.style.top = oImg["data-top"];
    oImg.style.transform = "";

    if(oImg["data-flipped"]) {
        flipImg(pId);
    }
}

// evento de compra de carta (item/spawn)
function drawCard(pType) {
    eval("var oOptions = loadOptions(this.j" + pType + "set);");
    eval("var oDeck = this.oDeck" + pType + "[0];");
    eval("var vLast = this.vLast" + pType + "Id;");

    if(!oDeck) {
        removeLast(vLast);

        eval("this.vLast" + pType + "Id = null;");

        eval("this.oDeck" + pType + " = loadDeck(this.jConfig." + pType.toLowerCase() + "deck);");

        eval("rebuildDeck(this.jConfig." + pType.toLowerCase() + "deck, oOptions, '" + pType + "');");

        return;
    } else if(vLast) {
        removeLast(vLast);
    }

    eval("var oCard = this.j" + pType + "s[this.jDeck" + pType + "." + pType.toLowerCase() + "s[this.oDeck" + pType + "[0]]." + pType.toLowerCase() + "];");

    eval("oOptions.Draw" + pType + " = false;");
    
    eval("loadImage(oCard, this.o" + pType + "set, oOptions, null, this.oDeck" + pType + "[0]);");

    eval("oOptions.Draw" + pType + " = true;");

    eval("this.vLast" + pType + "Id = oCard.id + '_' + this.oDeck" + pType + "[0];");

    eval("this.oDeck" + pType + ".shift();");

    eval("rebuildDeck(this.oDeck" + pType + ".length, oOptions, '" + pType + "');");
}

// remove última carta
function removeLast(pId) {
    var oImg = document.getElementById(pId);

    this.oControls.removeChild(oImg);
}

// remonta o deck
function rebuildDeck(pNumber, pOptions, pType) {
    eval("var vId = this.j" + pType + "s.Verso.id + '_1';");
    
    var oImg = document.getElementById(vId);

    this.oControls.removeChild(oImg);

    eval("var oTxt = loadText(this.j" + pType + "set, '" + pNumber + "');");

    eval("loadImage(this.j" + pType + "s.Verso, this.o" + pType + "set, pOptions, oTxt, null);");
}

// abertura da ficha
function openSheet(pId) {
    var oCharset = this.jCharset.frames.survivors[pId],
        oSheetOptions = loadOptions(this.jSheetset),
        oSheet = document.createElement("DIV");

    oSheet.id = "sheet";

    var oSpanMinus = loadButton("minus", "Descer nível"),
        oSpanPlus =  loadButton("plus", "Subir nível");

    oSheet.appendChild(oSpanMinus);
    oSheet.appendChild(oSpanPlus);

    new $.Zebra_Dialog(
        {
            width: 800,
            height: 457,
            buttons: false,
            message: oSheet
        }
    );

    loadImage(this.jSheets.sheet, this.oSheetset, oSheetOptions, null, null);

    this.jSheets.level.x = (oCharset.sheet.level + 1) * this.jConfig.levelsize;

    loadImage(this.jSheets.level, this.oSheetset, oSheetOptions, null, null);

    loadImage(this.jSheets[pId.toLowerCase()], this.oSheetset, oSheetOptions, null, null);

    loadSheetTxt("sheet_name", pId, "", true);

    var oActions = oCharset.sheet.actions;

    loadSheetTxt("action_blue_0", oActions.blue[0].title, oActions.blue[0].help, false);
    loadSheetTxt("action_yellow_0", oActions.yellow[0].title, oActions.yellow[0].help, false);
    loadSheetTxt("action_orange_0", oActions.orange[0].title, oActions.orange[0].help, false);
    loadSheetTxt("action_orange_1", oActions.orange[1].title, oActions.orange[1].help, false);
    loadSheetTxt("action_red_0", oActions.red[0].title, oActions.red[0].help, false);
    loadSheetTxt("action_red_1", oActions.red[1].title, oActions.red[1].help, false);
    loadSheetTxt("action_red_2", oActions.red[2].title, oActions.red[2].help, false);
}

// carregar botões de nível
function loadButton(pIcon, pTitle) {
    var oSpan = document.createElement("SPAN"),
        oItem = document.createElement("I");

    oSpan.id = pIcon;

    oItem.className = "fa fa-" + pIcon + "-circle fa-lg " + pIcon + "_button";
    oItem.title = pTitle;

    oItem.addEventListener("click", function(event) {
        changeLevel(event);
    });

    oSpan.appendChild(oItem);

    return oSpan;
}

// muda nível
function changeLevel(event) {
    var vId = event.target.parentElement.id,
        vSurv = document.getElementById("sheet_name").innerText,
        oSheetOptions = loadOptions(this.jSheetset);

    var oCharset = this.jCharset.frames.survivors[vSurv]

    if(vId === "plus") {
        if(oCharset.sheet.level < this.jConfig.levelmax) {
            oCharset.sheet.level++;
        }
    } else if(vId === "minus") {
        if(oCharset.sheet.level > this.jConfig.levelmin) {
            oCharset.sheet.level--;
        }
    }

    document.getElementById("level_1").remove();

    this.jSheets.level.x = (oCharset.sheet.level + 1) * this.jConfig.levelsize;

    loadImage(this.jSheets.level, this.oSheetset, oSheetOptions, null, null);
}

// carregar habilidades
function loadSheetTxt(pClass, pText, pTitle, pId) {
    var oSpan = loadSpan(pClass, pText, 0);

    oSpan.title = pTitle;

    if(pId) {
        oSpan.id = pClass;
    }

    document.getElementById("sheet").appendChild(oSpan);
}

// troca a missão
function onChangeMission() {
    var vCount = this.oTable.children.length - 1;

    resetObjects();

    for(var i = vCount; i >= 0; i--) {
        document.getElementById(this.oTable.children[i].id).remove();
    }

    var vId = document.getElementById("sMissions").selectedIndex;

    loadMission(vId);

    var jMission = loadSet(this.jMissions[vId].src);

    loadMissionItems(jMission.items);
}

// reinicia posição de personagens e tokens
function resetObjects() {
    destroyImg(this.jSurvivors.Amy.id, this.jSurvivors.Amy.copies);
    destroyImg(this.jSurvivors.Doug.id, this.jSurvivors.Doug.copies);
    destroyImg(this.jSurvivors.Josh.id, this.jSurvivors.Josh.copies);
    destroyImg(this.jSurvivors.Ned.id, this.jSurvivors.Ned.copies);
    destroyImg(this.jSurvivors.Phil.id, this.jSurvivors.Phil.copies);
    destroyImg(this.jSurvivors.Wanda.id, this.jSurvivors.Wanda.copies);

    destroyImg(this.jZombies.Walker.id, this.jZombies.Walker.copies);
    destroyImg(this.jZombies.Runner.id, this.jZombies.Runner.copies);
    destroyImg(this.jZombies.Fatty.id, this.jZombies.Fatty.copies);
    destroyImg(this.jZombies.Abomination.id, this.jZombies.Abomination.copies);

    destroyImg(this.jCharMisc.Police_Car.id, this.jCharMisc.Police_Car.copies);
    destroyImg(this.jCharMisc.Pimp_Car.id, this.jCharMisc.Pimp_Car.copies);

    destroyImg(this.jCharMisc.Noise.id, this.jCharMisc.Noise.copies);

    destroyImg(this.jDoors.Door.id, this.jDoors.Door.copies);
    destroyImg(this.jDoors.Blue_Door.id, this.jDoors.Blue_Door.copies);
    destroyImg(this.jDoors.Green_Door.id, this.jDoors.Green_Door.copies);

    destroyImg(this.jObjectives.Objective.id, this.jObjectives.Objective.copies);
    destroyImg(this.jObjectives.Blue_Objective.id, this.jObjectives.Blue_Objective.copies);
    destroyImg(this.jObjectives.Green_Objective.id, this.jObjectives.Green_Objective.copies);

    destroyImg(this.jSpawnTokens.Spawn.id, this.jSpawnTokens.Spawn.copies);
    destroyImg(this.jSpawnTokens.Blue_Spawn.id, this.jSpawnTokens.Blue_Spawn.copies);

    destroyImg(this.jTokenMisc.Exit.id, this.jTokenMisc.Exit.copies);
    destroyImg(this.jTokenMisc.Entry.id, this.jTokenMisc.Entry.copies);

    if(this.vLastItemId) {
        removeLast(this.vLastItemId);

        this.vLastItemId = null;
    }

    this.oDeckItem = loadDeck(this.jConfig.itemdeck);

    var oItemOptions = loadOptions(this.jItemset);

    rebuildDeck(this.oDeckItem.length, oItemOptions, "Item");

    if(this.vLastSpawnId) {
        removeLast(this.vLastSpawnId);

        this.vLastSpawnId = null;
    }

    this.oDeckSpawn = loadDeck(this.jConfig.spawndeck);

    var oSpawnOptions = loadOptions(this.jSpawnset);

    rebuildDeck(this.oDeckSpawn.length, oSpawnOptions, "Spawn");
}

// abre briefing da missão
function openBriefing() {
    var oMissions = document.getElementById("sMissions");

    var vId = oMissions.selectedIndex;

    var jMission = loadSet(this.jMissions[vId].src);

    var vTxt = jMission.title;

    var oTitle = loadSpan("mission_title", "Missão " + vId + " - " + vTxt);

    var oMsg = loadMsg(jMission);

    new $.Zebra_Dialog(
        {
            width: 1200,
            buttons: false,
            title: oTitle,
            message: oMsg
        }
    );
}

// monta mensagem
function loadMsg(pMission) {
    var oMsg = document.createElement("DIV"),
        oSpan;

    oSpan = loadSpan("mission_bold", pMission.mode + " / " + pMission.survivors + " Sobreviventes " + " / " + pMission.time, 2);

    oMsg.appendChild(oSpan);

    oSpan = loadDesc("mission_desc", pMission.description, false, 2);

    oMsg.appendChild(oSpan);

    oSpan = loadSpan("mission_bold", "Mapas necessários: ", 0);
    oSpan = loadTiles(pMission, oSpan, 2);

    oMsg.appendChild(oSpan);

    oSpan = loadSpan("mission_subtitle", "Objetivo", 0);

    oMsg.appendChild(oSpan);

    oSpan = loadDesc("mission_desc", pMission.objective, true, 2);

    oMsg.appendChild(oSpan);

    oSpan = loadSpan("mission_subtitle", "Regras Especiais", 0);

    oMsg.appendChild(oSpan);

    oSpan = loadDesc("mission_desc", pMission.special_rules, true, 0);

    oMsg.appendChild(oSpan);

    return oMsg;
}

// monta span
function loadSpan(pClass, pTxt, pBr) {
    var oSpan = document.createElement("SPAN"),
        vTxt = document.createTextNode(pTxt);

    oSpan.appendChild(vTxt);
    oSpan.className = pClass;

    for(var i = 1; i <= pBr; i++) {
        oSpan.appendChild(document.createElement("BR"));
    }

    return oSpan;
}

// monta descritivos das missões
function loadDesc(pClass, pSet, pList, pBr) {
    var oSpan = document.createElement("SPAN"),
        vTxt = "", vSend = false, i;

    oSpan.className = pClass;

    for(i = 0; i < pSet.length; i++) {
        if(pList && pSet[i].substr(0, 1) === "-") {
            if(vTxt) {
                vTxt = document.createTextNode(vTxt);
                oSpan.appendChild(vTxt);

                vTxt = "";
            }

            oSpan.appendChild(document.createElement("BR"));
        } else if(pList && pSet[i].substr(0, 1) === "*") {
            oSpan.appendChild(document.createElement("BR"));
            oSpan.appendChild(document.createElement("BR"));

            vSend = true;
        }

        vTxt = vTxt + pSet[i];

        if(vSend) {
            vTxt = document.createTextNode(vTxt);
            oSpan.appendChild(vTxt);

            vTxt = "";
            vSend = false;
        }
    }

    vTxt = document.createTextNode(vTxt);
    oSpan.appendChild(vTxt);

    for(var i = 1; i <= pBr; i++) {
        oSpan.appendChild(document.createElement("BR"));
    }

    return oSpan;
}

// monta tiles
function loadTiles(pMission, pSpan, pBr) {
    var oSpan = document.createElement("SPAN"),
        vCount = Object.keys(pMission.tiles).length,
        vTiles = "", i;

    for(i = 0; i < vCount; i++) {
        vTiles = vTiles + pMission.tiles[i].tile;

        if(i === (vCount - 2)) {
            vTiles = vTiles + " e ";
        } else if(i === (vCount - 1)) {
            vTiles = vTiles + ".";
        } else {
            vTiles = vTiles + ", ";
        }
    }

    vTiles = document.createTextNode(vTiles);
    pSpan.appendChild(vTiles);

    for(i = 1; i <= pBr; i++) {
        pSpan.appendChild(document.createElement("BR"));
    }

    return pSpan;
}
