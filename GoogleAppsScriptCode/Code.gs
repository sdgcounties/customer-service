
//*****Setup Functions*****
/**
* A special function that runs when the spreadsheet is open, used to add a
* custom menu to the spreadsheet.
*/
function onOpen(){
  var spreadsheet = SpreadsheetApp.getActive();
  var menuItems = [
    {name: 'Create Folders (only needs to run once)', functionName: 'createFolders'},
    {name: 'Update Forms Step 1 of 2: Update Forms', functionName: 'updateForms'},
    {name: 'Update Forms Step 2 of 2: Update Form Links', functionName: 'updateFormLinks'},
    {name: 'Email Customer Service Links', functionName:'emailCustomerServiceLinks'}
  ];
  spreadsheet.addMenu('Customer Service', menuItems);
}
//These functions are run when the menu buttons are pressed

function createFolders(){
  SDGSettings.setup.setupAllFolders();
}
function updateForms(){
  SDGForms.forms.create('Case', 'Case');
  SDGForms.forms.create('Action', 'Action');
  SDGForms.forms.create('DeleteCase', 'Delete Case');
  SDGForms.forms.create('DeleteAction', 'Delete Action');
}
function updateFormLinks(){
    SDGForms.forms.updateFormLinks();
}

function emailCustomerServiceLinks(){
  var ui = SpreadsheetApp.getUi();
  var response = ui.prompt("Enter an email address to send the appropirate Customer Service Links", ui.ButtonSet.OK_CANCEL);
  SDGNotification.sendCustomServiceLinks(response.getResponseText());
}

//*****Form Trigger Funcitons Start*****
// trigger functions need to be in the Code.gs File. otherwise they do not run 
/**
* onFormSubmitCase - calls the onSubmit event
* @param {object} e - the information available from the submitted form event
*/
function onSubmitCase(e){
  SDGForms.forms.onSubmitCase(e);
}
/**
* onFormSubmitAction - calls the onSubmit event
* @param {object} e - the information available from the submitted form event
*/
function onSubmitAction (e){
  SDGForms.forms.onSubmitAction(e);
}
/**
* onSubmitDeleteCase - calls the onSubmit event
* @param {object} e - the information available from the submitted form event
*/
function onSubmitDeleteCase(e){
  SDGForms.forms.onSubmitDeleteCase(e);
}
/**
* onSubmitDeleteAction - calls the onSubmit event
* @param {object} e - the information available from the submitted form event
*/
function onSubmitDeleteAction(e){
  SDGForms.forms.onSubmitDeleteAction(e);
}
//*****Web App Funcitons Start*****

/**
* doGet - required for a web app
* @param {object} e - the parameters from the request url
*/
function doGet(e) {
  var urlparameters = JSON.stringify(e);
  var newhtmlservice = HtmlService.createTemplateFromFile('Index');
  newhtmlservice.urlparameters = urlparameters;
  return newhtmlservice.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

function include(filename) { //used to add in extra files such as javascript.html
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getAssignedToOptions(){
  var sheetname = SDGSettings.spreadsheet.sheetNameListAssignCase;
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetname);
  var dataArray = sh.getDataRange().getValues();
  return JSON.stringify(dataArray);
}

function filterCasesWebApp(cases, criteria){
    var cols = SDGSettings.sheetInfo.detailCase;
    var passedCases = [];
    var hasPassed = true;
    
    for (i=1;i< cases.length;i++){
      //check criteria
      //assignedTo
      if (criteria.assignedTo == 'All' || criteria.assignedTo == cases[i][cols.colAssingedTo-1]){
        //pass 
      }else{
        hasPassed = false;
      }
      //status
      if (criteria.status == 'All' || criteria.status == cases[i][cols.colStatus-1]){
        //pass 
      }else{
        hasPassed = false;
      }
      //isDeleted
      if (criteria.isDeleted == 'All' || criteria.isDeleted == cases[i][cols.colIsDeleted-1]){
        //pass 
      }else{
        hasPassed = false;
      }
      //check hasPassed
      if (hasPassed == true){
        passedCases.push(cases[i]); 
      }
      hasPassed = true;
    }
    return passedCases;
  }

function getCasesWithActions(passedobject){
  var starttime = Date.now();
  var searchobject = JSON.parse(passedobject)
  var value = searchobject.searchtext; 
  var returnobject = {};
  var searchresults = []; 
  var cols = SDGSettings.sheetInfo; 
  var criteria = {};
  criteria.assignedTo = searchobject.assignedto;
  criteria.status = searchobject.status;
  criteria.isDeleted = searchobject.isdeleted;
  var casesheetname = SDGSettings.spreadsheet.sheetNameDetailCase;
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(casesheetname);
  var cases = sh.getDataRange().getValues();
  var actions = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SDGSettings.spreadsheet.sheetNameDetailAction).getDataRange().getValues();
  cases = filterCasesWebApp(cases, criteria);
  
  var skipvaluecheck;
  if(searchobject.searchtext){
    skipvaluecheck = false;
  }else{
    skipvaluecheck = true;
  }
  var skipcaseidcheck;
  if(searchobject.caseid){
    skipcaseidcheck = false;
  }else{
    skipcaseidcheck = true;
  }
    var columnstocheck = [];
    columnstocheck.push(Number(SDGSettings.sheetInfo.detailCase.colName)-1);
    columnstocheck.push(Number(SDGSettings.sheetInfo.detailCase.colLocation)-1);
    columnstocheck.push(Number(SDGSettings.sheetInfo.detailCase.colCaseId)-1);
    var colFormDataStart = columnstocheck.push(Number(SDGSettings.sheetInfo.detailCase.colFormDataStart)-1);
    var lastcolnum = sh.getLastColumn();
    //Add All data columns
    for(var colnum = colFormDataStart;colnum<lastcolnum;colnum++){
      columnstocheck.push(colnum);
    }
  
    for(var i = 0; i < cases.length;i++){//rows
      for(var j = 0; j < cases[i].length;j++){//columns
         if(cases[i][Number(SDGSettings.sheetInfo.detailCase.colCaseId)-1] == searchobject.caseid || skipcaseidcheck == true) { //check if the caseid matches
           //Good One! - do nothing
         }else{
           //Bad One so skip it with a break
           break;
         }
           
        if(columnstocheck.indexOf(j) != -1){//check if it should compare the column
          if(cases[i][j]) { //check if the cell has a value
            var strcellvalue = cases[i][j].toString().toLowerCase();
            strcellvalue = strcellvalue.substring(strcellvalue.indexOf("=")+1);
            var strvalue = searchobject.searchtext.toString().toLowerCase();
            if(strcellvalue.indexOf(strvalue) >=0 || skipvaluecheck == true) { //check if the value matches the search term
              var searchresult = {};
              searchresult.matchingcelladdress = i+","+j; //holds the matching cells value
              searchresult.matchingcellvalue = strvalue; //holds the matching cells address
              searchresult.datarow = cases[i];//holds the row of data
              //Get associated actions
              searchresult.actions = getMatchingActions(cases[i][Number(SDGSettings.sheetInfo.detailCase.colCaseId)-1], actions);
              searchresult.actioncount = searchresult.actions.length;
              searchresults.push(searchresult);
              break;
              }
            }
          }
        }
      }
    returnobject.searchvalue = value;
    returnobject.searchtime = Date.now() - starttime;
    returnobject.searchresultcount = searchresults.length;
    returnobject.searchresults = searchresults;
    return JSON.stringify(returnobject);
}


function getMatchingActions(caseId, actions){
  var matchingactions = [];
  var cols = SDGSettings.sheetInfo; 
  for(var i = 0; i < actions.length;i++){
    if(caseId == actions[i][Number(cols.detailAction.colCaseId)-1]){
     //Action matches the case
      matchingactions.push(actions[i]);
    }
  }
  return matchingactions;
}

function getSheetInfo(){
  return JSON.stringify(SDGSettings.sheetInfo);
}
function getAddCaseLink(){
   return SDGSettings.index.getUrlByLinkName("CaseFormAddNew");
}
/**================================================================================================**/
/** Temporarly Testing and trouble shooting funcitons 
- any funcitons here can be safely deleted they are only used to troubleshoot problems. 
**/
