class StatFrame {
    constructor(playerName) {
        //typeDisplayed 0 =basic
        // 1 = advanced
        this.basicPlayerInfo = "";
        this.typeDisplayed = 1;
        this.data = "initialData";
        this.url = "http://127.0.0.1:5000/playerData";
        this.outerDiv = document.createElement("div");
        this.outerDiv.id = "outerDiv";
        this.outerDiv.style.position = "absolute";
        this.outerDiv.style.zIndex = 9999;
        this.playerName = playerName;
        this.frame = document.createElement("iframe");
        this.frame.id = "statFrame";
        this.frame.style.zIndex = 1;
        this.frame.style.position = "absolute";
        this.frame.style.height = "100vh";
        this.frame.style.width = "100vw";
        this.outerDiv.append(this.frame);
        this.iframeContent = document.createElement("div");
        this.iframeHeaderDiv = document.createElement("div");
        //this.iframeHeaderDiv.innerHTML = '<img src ="https://d2cwpp38twqe55.cloudfront.net/req/202005142/images/players/jamesle01.jpg/">';
        // this.iframeHeaderDiv.style.width = "25%";
        // this.iframeHeaderDiv.style.height = "25%";
        // this.iframeHeaderDiv.innerText = "Hello";
        this.frameStyle;
        this.statTemplate = '<body>\n' +
            '<table style = "width:100%; border:1px solid black" id="statTable" \n' +
            '</table>\n'+
            '</body>\n';
        this.iframeContent.innerHTML = this.statTemplate;

    }

    returnFrame() {
        return this.frame;
    }

    returnIFrameContent() {
        return this.iframeContent;
    }

    setFrameContent() {
        this.frame.contentDocument.body.append(this.iframeHeaderDiv);
        this.frame.contentDocument.body.append(this.iframeContent);
    }

    createHeaderDivContent() {
        
    }

    // populateUI(obj) {
    //     obj.processStatTable(obj);
    // }

    processPlayerInfo(obj) {

    }

    processStatTable(obj) {
        let jsonData = JSON.parse(obj.data);
        obj.data = jsonData;
        let regularSeasonStat = jsonData.resultSets[0].rowSet;
        console.log(jsonData.resultSets[0].headers);
        if (obj.typeDisplayed === 0) {
            obj.addBasicStatHeader(obj);
        } else {
            obj.addAdvancedStatHeader(obj);
        }
        for (let i = 0; i < regularSeasonStat.length; i ++) {
            let ar = regularSeasonStat[i];
            let selectedData;
            if (obj.typeDisplayed === 0) {
                selectedData = obj.selectBasicStat(ar);
            } else {
                selectedData = obj.selectAdvancedStat(ar);
            }
            obj.addStatTableRow(obj, selectedData);
        }
    }

    selectBasicStat(ar) {
        //The index list is the index of ar that correspond to these stats
        // [Season, Age, Team, PTS, AST, BLK, STL, RBD]
        let indexList = [1,5,4,26,21,23,22,20];
        let selectedStat = [];
        for (let i = 0; i < indexList.length; i ++) {
            selectedStat.push(ar[indexList[i]]);
        }
        return selectedStat;
    }

    selectAdvancedStat(ar) {
        let indexList = [1,5,4,26,21,23,22,20,24,6,7,8,9,10,11,13,14,15,16,17,18,19];
        let selectedStat = [];
        for (let i = 0; i < indexList.length; i ++) {
            selectedStat.push(ar[indexList[i]]);
        }
        return selectedStat;
    }

    addBasicStatHeader(obj) {
        let basicStatHeader = ['Season', 'Age', 'Team', 'PTS', 'AST', 'BLK', 'STL', 'RBD'];
        obj.addStatTableRow(obj,basicStatHeader);
    }

    addAdvancedStatHeader(obj) {
        let advancedStatHeader = ['Season', 'Age', 'Team', "PTS", "AST", "BLK", "STL", "RBD", "TOV","GP", "GS", "MIN", "FGM", "FGA", "FG%", "3PA", "3P%", "FTM", "FTA", "FT%", "ORDB", "DRBD"];
        obj.addStatTableRow(obj, advancedStatHeader);
    }

    addStatTableRow(obj,ar) {
        let newTableRow = document.createElement("tr");
        newTableRow.style.border = "1px solid black";
        for (let i =0; i < ar.length; i++) {
            let newTableData = document.createElement("td");
            newTableData.style.border = "1px solid black";
            newTableData.innerText = " " + ar[i] + "  ";
            newTableRow.appendChild(newTableData);
        }
        obj.iframeContent.appendChild(newTableRow);
    }

    applyStyleSheet(obj) {
        obj.frame.contentDocument;
        let style = document.createElement("style");
        style.type = 'text/css';
    }
    

    async getPlayerStatFromAPI(obj){
        let d = {
            playerName: this.playerName
        };
        await $.post(this.url, d).done(function(data) {
            obj.data =(data);//func1(obj);
            obj.processStatTable(obj)
        });
    };

    async getPlayerBasicInfoFromAPI(obj) {
        let requestUrl = "http://127.0.0.1:5000/basicPlayerInfo";
        let d = {
            playerName: this.playerName
        };
        await $.post(this.requestUrl,d).done(function(data){
            this.basicPlayerInfo = data;
            obj.populateUI(obj);
        });
    };
}