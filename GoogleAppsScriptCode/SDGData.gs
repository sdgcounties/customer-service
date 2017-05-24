//SDG Settings  
var SDGData = (function () {
  var ss;
  var sh;
  var SDGData = {};
  ss = SpreadsheetApp.getActiveSpreadsheet();
  //Data Operations
  SDGData.getRowData = getRowData;
  SDGData.getMatchingRows = getMatchingRows;
  SDGData.clearAllDetailCaseFormLinks = clearAllDetailCaseFormLinks;
  SDGData.clearAllDetailActionFormLinks = clearAllDetailActionFormLinks;
  SDGData.updateAllDetailCaseFormLinks = updateAllDetailCaseFormLinks;
  SDGData.updateAllDetailActionFormLinks = updateAllDetailActionFormLinks;

  //Case
  SDGData.getDeleteCaseLink = getDeleteCaseLink;
  SDGData.getDeleteActionLink = getDeleteActionLink;
  SDGData.getCaseEditLink = getCaseEditLink;
  SDGData.getActionEditLink = getActionEditLink;
  SDGData.getCaseAddActionLink = getCaseAddActionLink;
  
  return SDGData;
  
  //***** Public Functions***** 
    /**
  * clearAllDetailCaseFormLinks - updates the detail case form links
  */
  function clearAllDetailCaseFormLinks(){
    var sheetName = SDGSettings.spreadsheet.sheetNameDetailCase; 
    var ss = SpreadsheetApp.getActiveSpreadsheet();  
    var sh = ss.getSheetByName(sheetName);
    var cols = SDGSettings.sheetInfo.detailCase;
    var values = sh.getDataRange().getValues();
    
    //clear caseaEditLinks
    sh.getRange(2, cols.colEditCaseLink,values.length,1).clearContent();
    //clear caseDeleteLinks
    sh.getRange(2, cols.colDeleteCaseLink,values.length,1).clearContent();
    //clear caseAddActionLinks
    sh.getRange(2, cols.colAddActionLink,values.length,1).clearContent();
  }
      /**
  * clearAllDetailActionFormLinks - updates the detail case form links
  */
  function clearAllDetailActionFormLinks(){
    var sheetName = SDGSettings.spreadsheet.sheetNameDetailAction; 
    var ss = SpreadsheetApp.getActiveSpreadsheet();  
    var sh = ss.getSheetByName(sheetName);
    var cols = SDGSettings.sheetInfo.detailAction;
    var values = sh.getDataRange().getValues();
    
    //clear EditActionLink
    sh.getRange(2, cols.colEditActionLink,values.length,1).clearContent();
    //clear DeleteActionLink
    sh.getRange(2, cols.colDeleteActionLink,values.length,1).clearContent();

  }
  /**
  * updateAllDetailCaseFormLinks - updates the detail case form links
  */
  function updateAllDetailCaseFormLinks(){
    var sheetName = SDGSettings.spreadsheet.sheetNameDetailCase; 
    var ss = SpreadsheetApp.getActiveSpreadsheet();  
    var sh = ss.getSheetByName(sheetName);
    var cols = SDGSettings.sheetInfo.detailCase;
    var values = sh.getDataRange().getValues();
    
    for (var j=1; j<values.length; j++){ 
        var caseId = values[j][cols.colCaseId-1];
      //Edit
      if (sh.getRange(j+1, cols.colEditCaseLink).isBlank()){
        var caseEditLink = SDGData.getCaseEditLink(caseId);
        sh.getRange(j+1, cols.colEditCaseLink).setValue(caseEditLink);      
      }
      //Delete
      if (sh.getRange(j+1, cols.colDeleteCaseLink).isBlank()){
        var caseDeleteLink = SDGData.getDeleteCaseLink(caseId);
        sh.getRange(j+1, cols.colDeleteCaseLink).setValue(caseDeleteLink);
      }
        
      //Add Action
      if (sh.getRange(j+1, cols.colAddActionLink).isBlank()){      
        var caseAddActionLink = SDGData.getCaseAddActionLink(caseId);
        sh.getRange(j+1, cols.colAddActionLink).setValue(caseAddActionLink);
      }
      
    }
  }
  /**
  * updateAllDetailActionFormLinks - updates the detail case form links
  */
  function updateAllDetailActionFormLinks(){
    var sheetName = SDGSettings.spreadsheet.sheetNameDetailAction; 
    var ss = SpreadsheetApp.getActiveSpreadsheet();  
    var sh = ss.getSheetByName(sheetName);
    var cols = SDGSettings.sheetInfo.detailAction;
    var values = sh.getDataRange().getValues();
    for (var j=1; j<values.length; j++){ 
      var id = values[j][cols.colActionId-1];
      //Edit Link
      if (sh.getRange(j+1, cols.colEditActionLink).isBlank()){
      var editLink = SDGData.getActionEditLink(id);
      sh.getRange(j+1, cols.colEditActionLink).setValue(editLink);
      }
      //Delete Link
      if (sh.getRange(j+1, cols.colDeleteActionLink).isBlank()){
      var deleteLink = SDGData.getDeleteActionLink(id);
      sh.getRange(j+1, cols.colDeleteActionLink).setValue(deleteLink);
      }
    }
  }
  
    /**
  * getDeleteActionLink - gets the delete action link 
  * @param {string} actionID - the action Id
  */
  function getDeleteActionLink(actionId){
    var baseUrl = SDGSettings.index.getUrlByLinkName('DeleteActionForm');
    var questions = SDGSettings.form.getFormQuestions('DeleteAction');
    var colNumQuestionTitle = SDGSettings.sheetInfo.question.colTitle;
    var colUrlPrefillPart = SDGSettings.sheetInfo.question.colUrlPrefillPart;
    var linkEnd = '?';
    var needAmpersand = false;
	var cols = SDGSettings.sheetInfo.detailAction ;
	//get actionDetails
	var actionDetails = getRowData(actionId,SDGSettings.spreadsheet.sheetNameDetailAction,cols.colActionId)
	
    for (var i=1;i<questions.length;i++){
      if (questions[i][colNumQuestionTitle-1] == 'Action ID'){
        if (needAmpersand == true) { linkEnd = linkEnd + '&' }
        linkEnd = linkEnd + questions[i][colUrlPrefillPart-1] + actionId;  
        needAmpersand = true;
      }
	 if (questions[i][colNumQuestionTitle-1] == 'Case ID'){
        if (needAmpersand == true) { linkEnd = linkEnd + '&' }
        linkEnd = linkEnd + questions[i][colUrlPrefillPart-1] + actionDetails[cols.colCaseId-1];  
        needAmpersand = true;
      }
      if (questions[i][colNumQuestionTitle-1] == 'Action Information'){
        if (needAmpersand == true) { linkEnd = linkEnd + '&' }
        linkEnd = linkEnd + questions[i][colUrlPrefillPart-1] + actionDetails[cols.colFormDataStart-1] ; 
        needAmpersand = true;
      }
    }
    var link = baseUrl + linkEnd
    link = link.replace(/ /g,'+');
    return link
  }
  
  
  /**
  * getDeleteCaseLink - gets the add action link for a case
  * @param {string} caseID - the case Id
  */
  function getDeleteCaseLink(caseId){
    var baseUrl = SDGSettings.index.getUrlByLinkName('DeleteCaseForm');
    var questions = SDGSettings.form.getFormQuestions('DeleteCase');
    var colNumQuestionTitle = SDGSettings.sheetInfo.question.colTitle;
    var colUrlPrefillPart = SDGSettings.sheetInfo.question.colUrlPrefillPart;
    var linkEnd = '?';
    var needAmpersand = false;
	var cols = SDGSettings.sheetInfo.detailCase ;
	//get casedetails
	var caseDetails = getRowData(caseId,SDGSettings.spreadsheet.sheetNameDetailCase,cols.colCaseId)
	
	
    for (var i=1;i<questions.length;i++){
      if (questions[i][colNumQuestionTitle-1] == 'Case ID'){
        if (needAmpersand == true) { linkEnd = linkEnd + '&' }
        linkEnd = linkEnd + questions[i][colUrlPrefillPart-1] + caseId;  
        needAmpersand = true;
      }
      if (questions[i][colNumQuestionTitle-1] == 'Case Information'){
        if (needAmpersand == true) { linkEnd = linkEnd + '&' }
        linkEnd = linkEnd + questions[i][colUrlPrefillPart-1] + 'Location: ' + caseDetails[cols.colLocation-1] + ' - Name: ' + caseDetails[cols.colName-1]; 
        needAmpersand = true;
      }
    }
    var link = baseUrl + linkEnd
    link = link.replace(/ /g,'+');
    return link
  }
  
  /**
  * getCaseAddActionLink - gets the add action link for a case
  * @param {string} caseID - the case Id
  */
  function getCaseAddActionLink(caseId){
    var baseUrl = SDGSettings.index.getUrlByLinkName('ActionForm');
    var questions = SDGSettings.form.getFormQuestions('Action');
    var colNumQuestionTitle = SDGSettings.sheetInfo.question.colTitle;
    var colUrlPrefillPart = SDGSettings.sheetInfo.question.colUrlPrefillPart;
    var linkEnd = '?';
    var needAmpersand = false;
    for (var i=1;i<questions.length;i++){
      if (questions[i][colNumQuestionTitle-1] == 'Case ID'){
        if (needAmpersand == true) { linkEnd = linkEnd + '&' }
        linkEnd = linkEnd + questions[i][colUrlPrefillPart-1] + caseId;  
        needAmpersand = true;
      }
      if (questions[i][colNumQuestionTitle-1] == 'Action ID'){
        if (needAmpersand == true) { linkEnd = linkEnd + '&' }
        linkEnd = linkEnd + questions[i][colUrlPrefillPart-1] + 'New ID'; 
        needAmpersand = true;
      }
    }
    var link = baseUrl + linkEnd
    link = link.replace(/ /g,'+');
    return link
  }
  
  /**
  * getCaseEditLink - gets the edit link for a case
  * @param {string} caseID - the case Id
  */
function getCaseEditLink(caseId){
  var baseUrl = SDGSettings.index.getUrlByLinkName('CaseForm'); 
  var caseDetails = SDGData.getRowData(caseId,SDGSettings.spreadsheet.sheetNameDetailCase,'1');
  var questions = SDGSettings.form.getFormQuestions('Case');
  var cols = SDGSettings.sheetInfo;
  var linkEnd = '?';
  var link;
  var needAndSymbol = 'no'
  for (var i=1;i<questions.length;i++){
    if (needAndSymbol == 'yes'){linkEnd = linkEnd +'&';} //and ampersand if needed
    var entry = questions[i][cols.question.colUrlPrefillPart-1];
    var title = questions[i][cols.question.colTitle-1];
    var value ='';
    if (title == 'Case ID'){
      value = caseId;
    }else
    {
      for (var j=cols.detailCase.colFormDataStart-1;j<caseDetails.length;j++){
        var casequestion = getEntryQuestion(caseDetails[j]);
        if (title == casequestion){
          var value = getEntryValue(caseDetails[j]);
        }
      }
    }
    linkEnd = linkEnd + entry +  value;
    needAndSymbol = 'yes';
  }
  var link = baseUrl + linkEnd;
  link = link.replace(/ /g,'+');
  return link; 
}
  /**
  * getCaseEditLink - gets the edit link for a case
  * @param {string} actionId - the action Id
  */
  function getActionEditLink(actionId){
  var baseUrl = SDGSettings.index.getUrlByLinkName('ActionForm'); 
  var actionDetails = SDGData.getRowData(actionId,SDGSettings.spreadsheet.sheetNameDetailAction,'1');
  var questions = SDGSettings.form.getFormQuestions('Action');
  var cols = SDGSettings.sheetInfo;    
  var linkEnd = '?';
  var link;
  var needAndSymbol = 'no'
  for (var i=1;i<questions.length;i++){
    if (needAndSymbol == 'yes'){linkEnd = linkEnd +'&';} //and ampersand if needed 
    var entry = questions[i][cols.question.colUrlPrefillPart-1];
    var title = questions[i][cols.question.colTitle-1];
    var value ='';
    if (title == 'Action ID'){
      value = actionId;
    }else
    {
      var count = 0;
      for (var j=cols.detailAction.colFormDataStart-1;j<actionDetails.length;j++){
        count ++;
        var actionquestion = getEntryQuestion(actionDetails[j]);
        if (title == actionquestion){
          var value = getEntryValue(actionDetails[j]);
        }
      }
    }
    linkEnd = linkEnd + entry +  value;
    needAndSymbol = 'yes';
  }
  var link = baseUrl + linkEnd;
  link = link.replace(/ /g,'+');
  return link; 
}
  /**
  * getRowData - gets a single row of data based on the passed in Id
  * @param {string} Id - the Id
  * @param {string} sheetName - the name of the sheet that holds the data
  * @param {string} colNumId = the column number that holds the Id
  */
  function getRowData(Id,sheetName,colNumId){
    var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName); // gets the sheet
    var rangeValues = sh.getDataRange().getValues();//get the sheets data
    var bolExists = false;
    var matchingRowIndex;
    for (j=0; j<rangeValues.length; j++){ //loop through each row
      if (Number(rangeValues[j][colNumId-1]) == Number(Id)){//Check if ID matches
        bolExists = true;
        matchingRowIndex = j;//note the last matching row
      }
    }
    if (bolExists == true){
      return  rangeValues[matchingRowIndex]//return the row data
    } else{
      return "No match found"; 
    }
  }
  /**
  * getMatchingRows - gets all rows that match the id
  * @param {string} Id - the Id
  * @param {string} sheetName - the name of the sheet that holds the data
  * @param {string} colNumId = the column number that holds the Id
  */
  function getMatchingRows(Id,sheetName,colNumId){
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName); // gets the sheet
  var rangeValues = sh.getDataRange().getValues();//get the sheets data
  var bolExists = false;
  var matchingRows = [];
  for (j=0; j<rangeValues.length; j++){ //loop through each row
    if (Number(rangeValues[j][colNumId-1]) == Number(Id)){//Check if ID matches
      bolExists = true;
      matchingRows.push(rangeValues[j]);//add row to matchingrows
    }
  }
  if (bolExists == true){
    return  matchingRows;
  } else{
    return []; 
  }

  }
  
  //*****Private Helper Functions***** 
  /**
  * getEntryValue - gets the value from a submitted entry (entries are stored with the name of the question)
  * @param {string} entryText - the text with the [question title]= [the awnser to the question]
  */
  function getEntryValue(entryText){
    var indexOfFirstEqual = entryText.indexOf('=');
    var value = entryText.substring(indexOfFirstEqual+2,entryText.length);
    return value;
  }
    /**
  * getEntryQuestion - gets the value from a submitted entry (entries are stored with the name of the question)
  * @param {string} entryText - the text with the [question title]= [the awnser to the question]
  */
  function getEntryQuestion(entryText){
    var indexOfFirstEqual = entryText.indexOf('=');
    var value = entryText.substring(0,indexOfFirstEqual);
    return value;
  }
})();