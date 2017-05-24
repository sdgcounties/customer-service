var SDGForms = (function() {
  var SDGForms = {};
  SDGForms.folders = {};
  SDGForms.forms = {};
  SDGForms.forms.create = formCreate;
  SDGForms.forms.resetCaseLinks = resetCaseLinks;
  SDGForms.forms.resetActionLinks = resetActionLinks;
  SDGForms.forms.updateFormLinks = updateFormLinks;
  SDGForms.forms.updateCaseLinks = updateCaseLinks;
  SDGForms.forms.updateActionLinks = updateActionLinks;
  SDGForms.forms.onSubmitCase = onSubmitCase;
  SDGForms.forms.onSubmitAction = onSubmitAction;
  SDGForms.forms.onSubmitDeleteCase = onSubmitDeleteCase;
  SDGForms.forms.onSubmitDeleteAction = onSubmitDeleteAction;
  SDGForms.forms.updateCaseStatus = updateCaseStatus;
   SDGForms.forms.getPreFilledActionLink = getPreFilledActionLink;
  return SDGForms
  
  //***Public Functions***
  /**
  * formscreate - the process for creating and setting up a new form
  * @param {string} formName - name of the form
  * @param {string} folderName = name of the folder
  */
  function formCreate(formName, formTitle){
    var formId = createForm(formName); //create form
    removeAnyQuestionsOnForm(formId);
    addQuestionsToForm(formName, formId, formTitle); //add questions to form
    setupOnSubmitTriggers(formName, formId); //setup trigger
    updateQuestionSheetWithFormEntryParts(formName,formId);//adds the entry parts to the questions sheet
    var form = FormApp.openById(formId);
    SDGSettings.index.updateLink(formName +'Form', form.getPublishedUrl(), formId);
    if (formName == 'Case'){
      var urlAddNewCase = form.getPublishedUrl() +'?'+ getUrlEntryPart(formName,'Case ID');
      SDGSettings.index.updateLink('CaseFormAddNew',urlAddNewCase,formId);
    }
  }
  /**
  * resetCaseLinks - Clears the case form links - this way you can tell what has been updated
  */
  function resetCaseLinks(){
    SDGData.clearAllDetailCaseFormLinks();
  }
    /**
  * resetActionLinks - Clears the action form links - this way you can tell what has been updated
  */
  function resetActionLinks(){
    SDGData.clearAllDetailActionFormLinks();
  }
  /**
  * updateFormLinks - Updates From Links on detailCase and detailAction
  */
  function updateFormLinks(){
    //Update detailCase
    SDGData.updateAllDetailActionFormLinks();
    //Update detailAction
    SDGData.updateAllDetailCaseFormLinks();
  }
    function updateCaseLinks(){
    //Update detailCase
    SDGData.updateAllDetailCaseFormLinks();
  }
    function updateActionLinks(){
    //Update detailAction
    SDGData.updateAllDetailActionFormLinks();
  }
  
  
  //*****Event Functions*****
  /**
  * onSubmitCaseInfo - the Case Info Form's onSubmit event
  * @param {object} e - the information available from the submitted form event
  */
  function onSubmitCase (e) {
    try{
      var formId = SDGSettings.index.getIdByLinkName('CaseForm');
      //---Record Submitted Data---
      var sheetNameLogDataCase = SDGSettings.spreadsheet.sheetNameLogDataCase; //Log the data that was submitted
      var ss = SpreadsheetApp.getActiveSpreadsheet()   //Open the Spreadsheet
      var sh = ss.getSheetByName(sheetNameLogDataCase); // gets the sheet
      var itemResponses = e.response.getItemResponses();  //get submitted item responses
      var newrow =sh.getLastRow()+1; //gets the row number of the next available blank row
      var colnum = 1;
      //---Get Case ID---
      var caseID;
      var assignedto = "nobody";
      var submittedCaseID = getCaseIDFromResponse(itemResponses);
      if (isCaseIDValid(submittedCaseID) == true){
        caseID = submittedCaseID;
        assignedto = getAssignedToFromCaseId(caseID);//gets who it is currently assigned to
      }else {
        caseID = getNextAvailableCaseID(sh);
      }
      //---Add Data to logdataCase Sheet---
      sh.getRange(newrow, colnum).setValue(caseID);// add caseID to row
      colnum ++; 
      for(i = 0; i< itemResponses.length; i++) {//add all other data
        sh.getRange(newrow, colnum).setValue(itemResponses[i].getItem().getTitle() + '= ' + itemResponses[i].getResponse());//adds the quesiton text and the data  
        colnum ++;
      }
      var timestamp = "Added= " + Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "yyyy-MM-dd'T'HH:mm:ss z");
      sh.getRange(newrow, colnum).setValue(timestamp);//adds a time stamp to the last column 
      colnum ++;
      //---Update detailCase---
      updateDetailCaseSheet(caseID, itemResponses);
      
      //Notify Assigned to
      SDGNotification.sendCaseInfoToAssignedTo(caseID);
    }
    catch (err){
      SDGErrors.custom('onSubmitCase Error message = ' + err); 
    }
  }
  /**
  * onSubmitActionInfo - the Action Info Form's onSubmit event
  * @param {object} e - the information available from the submitted form event
  */
   function onSubmitAction (e){ 
     try{
       var formId =SDGSettings.index.getIdByLinkName('ActionForm');
       var sheetName = SDGSettings.spreadsheet.sheetNameLogDataAction;
       var ss = SpreadsheetApp.getActiveSpreadsheet();   //Open the Spreadsheet
       var shActionLog = ss.getSheetByName(sheetName); // gets the sheet
       var itemResponses = e.response.getItemResponses();  //get submitted item responses
       var newrow =shActionLog.getLastRow()+1; //gets the row number of the next available blank row
       var colnum = 1;

       //---Get Action ID---
       var actionID;
       var submittedActionID = getActionIDFromResposne(itemResponses);    
       if (isActionIDValid(submittedActionID) == true){
         actionID = submittedActionID;
       }else {
         actionID = getNextAvailableActionID(shActionLog);
       }

       //---Get Case ID---
       var caseID;
       var submittedCaseID = getCaseIDFromResponse(itemResponses);
       if (isCaseIDValid(submittedCaseID) == true){
         caseID = submittedCaseID;
       }else {
         caseID = submittedCaseID + 'Error - CaseID is invalid';
         SDGErrors.custom('The Case ID is invalid. Case ID= ' + submittedCaseID + '. The Action was not added correctly to the dataAction sheet');
       }

       //---Add Data to Log---
       shActionLog.getRange(newrow, colnum).setValue(caseID);// add caseID to row
       colnum ++; 
       shActionLog.getRange(newrow, colnum).setValue(actionID);// add actionID to row
       colnum ++; 
       for(i = 0; i< itemResponses.length; i++) {//add all other data
         shActionLog.getRange(newrow, colnum).setValue(itemResponses[i].getItem().getTitle() + '= ' + itemResponses[i].getResponse());//adds the quesiton text and the data  
         colnum ++;
       }
       //---Add Timestamp---
       var timestamp = "Added= " + Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "yyyy-MM-dd'T'HH:mm:ss z");
       shActionLog.getRange(newrow, colnum).setValue(timestamp);//adds a time stamp to the last column 
       colnum ++;
       
       //Update detailAction sheet
       updateDetailActionSheet(actionID, caseID, itemResponses)
       
       //Update detailCase sheet
       SDGForms.forms.updateCaseStatus(caseID);
     }
     catch (err){
       SDGErrors.custom('onSubmitAction Error message = ' + err); 
     }
   }
  /**
  * onSubmitDeleteCase - the Delete Case Form's onSubmit event
  * @param {object} e - the information available from the submitted form event
  */
  function onSubmitDeleteCase(e){
    try{
      //---Record Submitted Data---
      var sheetNameLogDataCase = SDGSettings.spreadsheet.sheetNameLogDataCase; //Log the data that was submitted
      
      var ss = SpreadsheetApp.getActiveSpreadsheet()   //Open the Spreadsheet
      var sh = ss.getSheetByName(sheetNameLogDataCase); // gets the sheet
      var itemResponses = e.response.getItemResponses();  //get submitted item responses
      var newrow =sh.getLastRow()+1; //gets the row number of the next available blank row
      var colnum = 1;
      //---Get Case ID---
      var caseID;
      var submittedCaseID = getCaseIDFromResponse(itemResponses);
      if (isCaseIDValid(submittedCaseID) == true){
        caseID = submittedCaseID;
      }else {
        caseID = 'not entered or invalid Id';
      }
      //---Add Data to logdataCase Sheet---
      sh.getRange(newrow, colnum).setValue(caseID);// add caseID to row
      colnum ++; 
      for(i = 0; i< itemResponses.length; i++) {//add all other data
        sh.getRange(newrow, colnum).setValue(itemResponses[i].getItem().getTitle() + '= ' + itemResponses[i].getResponse());//adds the quesiton text and the data  
        colnum ++;
      }
      var timestamp = "Added= " + Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "yyyy-MM-dd'T'HH:mm:ss z");
      sh.getRange(newrow, colnum).setValue(timestamp);//adds a time stamp to the last column 
      colnum ++;
      //---Update detailCase sheet---
      var sheetNameDetailCase = SDGSettings.spreadsheet.sheetNameDetailCase;//The name of the sheet where the index data will be stored
      sh =  ss.getSheetByName(sheetNameDetailCase); // gets the sheet
      var cols = SDGSettings.sheetInfo.detailCase;
      var action = getActionToTakeFromResponse(itemResponses);
	  var lastUpdated = Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "yyyy-MM-dd'T'HH:mm:ss z");
      //---Get Case ID and matching row---
      var values = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SDGSettings.spreadsheet.sheetNameDetailCase).getDataRange().getValues();
      var bolExists = false;
      var matchingRowNum;
      //Get the Row Number
      for (j=0; j<values.length; j++){ //Go through the existing caseID values
        if (Number(values[j][cols.colCaseId-1]) == Number(caseID)){//Check if caseID matches
          bolExists = true;
          matchingRowNum = j+1;
        }
      }
      if (bolExists == false){
		//no match found do nothing
      }else{
        if (action == "Delete"){
          sh.getRange(matchingRowNum, cols.colIsDeleted).setValue('Yes');
          sh.getRange(matchingRowNum, cols.colLastUpdated).setValue(lastUpdated);
        }else if (action == "Undelete"){
          sh.getRange(matchingRowNum, cols.colIsDeleted).setValue('No');
          sh.getRange(matchingRowNum, cols.colLastUpdated).setValue(lastUpdated); 
        }else {
          //do nothing
        }
      }
      
    }
    catch (err){
      SDGErrors.custom('onSubmitDeleteCase Error message = ' + err); 
    }
  }
  
  /**
  * onSubmitDeleteAction - the Delete Action Form's onSubmit event
  * @param {object} e - the information available from the submitted form event
  */
  function onSubmitDeleteAction(e){
    try{
      //---Record Submitted Data---
      var sheetNameLogDataAction = SDGSettings.spreadsheet.sheetNameLogDataAction; //Log the data that was submitted

      var ss = SpreadsheetApp.getActiveSpreadsheet()   //Open the Spreadsheet
      var sh = ss.getSheetByName(sheetNameLogDataAction); // gets the sheet
      var itemResponses = e.response.getItemResponses();  //get submitted item responses
      var newrow =sh.getLastRow()+1; //gets the row number of the next available blank row
      var colnum = 1;
      //---Get IDs---
      var caseID;
      var submittedCaseID = getCaseIDFromResponse(itemResponses);
      if (isCaseIDValid(submittedCaseID) == true){
        caseID = submittedCaseID;
      }else {
        caseID = 'not entered or invalid Id';
      }      
      var actionID;
      var submittedActionID = getActionIDFromResposne(itemResponses);
      if (isActionIDValid(submittedActionID) == true){
        actionID = submittedActionID;
      }else {
        actionID = 'not entered or invalid Id';
      }
      //---Add Data to logdataCase Sheet---
      sh.getRange(newrow, colnum).setValue(caseID);// add caseID column
      colnum ++; 
      sh.getRange(newrow, colnum).setValue(actionID);// add actionID to row
      colnum ++; 
      for(i = 0; i< itemResponses.length; i++) {//add all other data
        sh.getRange(newrow, colnum).setValue(itemResponses[i].getItem().getTitle() + '= ' + itemResponses[i].getResponse());//adds the quesiton text and the data  
        colnum ++;
      }
      var timestamp = "Added= " + Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "yyyy-MM-dd'T'HH:mm:ss z");
      sh.getRange(newrow, colnum).setValue(timestamp);//adds a time stamp to the last column 
      colnum ++;
      //---Update detailAction sheet---
      deleteAction(actionID, itemResponses);

       //Update detailCase sheet
       SDGForms.forms.updateCaseStatus(caseID);
    }
    catch (err){
      SDGErrors.custom('onSubmitDeleteAction Error message = ' + err); 
    }
  }
  
  
  
  //*****Private Helper Functions***** 
    /**
  * deleteAction - updates the indexAction sheet
  * @param {actionID} string - the actionID
  * @param {itemResponses} object - the form responses 
  */
  function deleteAction(actionID, itemResponses){
    var sheetName = SDGSettings.spreadsheet.sheetNameDetailAction;//The name of the sheet where the index data will be stored
    var ss = SpreadsheetApp.getActiveSpreadsheet()   //Open the Spreadsheet
    var sh = ss.getSheetByName(sheetName); // gets the sheet
    var cols = SDGSettings.sheetInfo.detailAction;

	var action = getActionToTakeFromResponse(itemResponses);
	var lastUpdated = Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "yyyy-MM-dd'T'HH:mm:ss z");
    //---Get Case ID---
    var values = sh.getDataRange().getValues();
    var bolExists = false;
    var matchingRowNum;

    //Get the Row Number
    for (j=0; j<values.length; j++){ //Go through the existing caseID values
      if (Number(values[j][cols.colActionId-1]) == Number(actionID)){//Check if caseID matches
        bolExists = true;
        matchingRowNum = j+1;
      }
    }

    if (bolExists == false){
      
		//no match found do nothing
    }else{
		
		if (action == "Delete"){
			sh.getRange(matchingRowNum, cols.colIsDeleted).setValue('Yes');
			sh.getRange(matchingRowNum, cols.colLastUpdated).setValue(lastUpdated); 
		}else if (action == "Undelete"){
			sh.getRange(matchingRowNum, cols.colIsDeleted).setValue('No');
			sh.getRange(matchingRowNum, cols.colLastUpdated).setValue(lastUpdated); 
		}else {
			//do nothing
		}
	}
  }
  /**
  * setupOnSubmitTriggers - creates or updates the on Submit Triggers
  * @param {string} formName - the name of the form
  */
  function setupOnSubmitTriggers(formName, formID){
    //---Triggers---
    //The onSubmit... funciton is in the Code.gs file - a problem was encountered when trying to directly trigger the onSubmit... code in SDGForms.gs
    var triggers = ScriptApp.getProjectTriggers();
    for (var i in triggers){
      var functionName = triggers[i].getHandlerFunction();
      if (functionName == 'onSubmit'+ formName){
        ScriptApp.deleteTrigger(triggers[i]);  
      }
    }
    ScriptApp.newTrigger('onSubmit' + formName).forForm(formID).onFormSubmit().create();
  }
  
  /**
  * updateQuestionSheetWithFormEntryParts - saves the prefilled url entry parts to the form's question sheet
  */
  function updateQuestionSheetWithFormEntryParts(formName,formId){
    //---Get Prefilled Url Entry Parts and save to the Question Sheets---
    var urlPreFilled = getPreFilledActionLink(formId);
    getUrlPreFilledParts(formName, urlPreFilled); 
    var intStart = 0
    var intEnd = urlPreFilled.indexOf('?') +1;
    var urlBase = urlPreFilled.substring(intStart,intEnd );
  }

  /**
  * getUrlEntryPart - gets the url entry Part from the question sheet
  * @param {questionName} string - the name of the form entry
  * @param {entryValue} string - the value to populate the form entry
  */
  function getUrlEntryPart(formName, questionName,entryValue){
    var ss = SpreadsheetApp.getActive();
    var sh = ss.getSheetByName('question' + formName);
    var rowNum = 1;//start after the header
    var rowNumQuestion;
    var cols = SDGSettings.sheetInfo.question;
    var values = sh.getDataRange().getValues();
    for (i=0; i<values.length; i++){ 
      if (values[i][cols.colTitle-1] == questionName){
        rowNumQuestion = i+1;
      }
    }
    var urlEntryPart = sh.getRange(rowNumQuestion, cols.colUrlPrefillPart).getValue();// get urlEntryPart 
    var urlEntryValue;
    if(typeof entryValue === "undefined"){
      urlEntryValue = sh.getRange(rowNumQuestion, cols.colDefaultValue).getValue();// get urlEntry Value  
    }else{
      urlEntryValue = entryValue; 
    }
    
    return urlEntryPart + urlEntryValue;
  }
  
  
  /**
  * getUrlPreFillParts - saves the prefilled entry parts to the quesiton sheet
  * @param {formName} string - the form Name
  * @param {url} string - the prefilled url
  */
  function getUrlPreFilledParts(formName,url){
    var ss = SpreadsheetApp.getActive();
    var sh = ss.getSheetByName('question' + formName);
    var rowNum = 2;//start after the header
    var cols = SDGSettings.sheetInfo.question;
    //an entry starts with "entry." and ends with = (eg entry.896260134=)
    var entryText = 'entry.';
    var startPosition = 0;
    var indexStartOfEntry;// = url.indexOf(entryText,startPosition);
    var indexEndOfEntry;// = url.indexOf("=",indexStartOfEntry);
    var urlEntryPart;// = url.substring(indexStartOfEntry,indexEndOfEntry+1);
    for (indexStartOfEntry = url.indexOf(entryText,startPosition);//start at the first index
         indexStartOfEntry>=0; //keep going until the text cannot be found which will result in -1
         indexStartOfEntry = url.indexOf(entryText, indexStartOfEntry+1)) //go to the next entry
    {
      indexEndOfEntry = url.indexOf("=",indexStartOfEntry); //get the end position of the url entry part
      urlEntryPart = url.substring(indexStartOfEntry,indexEndOfEntry+1);//get the url entry part
      sh.getRange(rowNum, cols.colUrlPrefillPart).setValue(urlEntryPart);// add urlEntryPart to row
      rowNum ++;
    } 
  }
  /**
  * getPreFilledActionLink - returns the prefilled url
  * @param {formName} string - the form Name
  * @return {url} the prefilled url
  */
  function getPreFilledActionLink(formID){
    var form = FormApp.openById(formID);
    var items = form.getItems(); //gets all of the items, which include section heads, queistons, and page breaks
    var formResponse = form.createResponse();
    var formItem;
    var response; 
    var multiplechoiceoptions;
    for (j=0; j<items.length; j++){ 
      if(items[j].getType() == FormApp.ItemType.CHECKBOX){
        
      }else if(items[j].getType() == FormApp.ItemType.DATE){
        formItem = items[j].asDateItem();
        dateObject = new Date();
        response = formItem.createResponse(dateObject );
        formResponse.withItemResponse(response);
      }else if(items[j].getType() == FormApp.ItemType.DATETIME){
        formItem = items[j].asDateItem();
        dateObject = new Date();
        response = formItem.createResponse(dateObject );
        formResponse.withItemResponse(response);
      }else if(items[j].getType() == FormApp.ItemType.DURATION){
        
      }else if(items[j].getType() == FormApp.ItemType.GRID){
        
      }else if(items[j].getType() == FormApp.ItemType.IMAGE){
        
      }else if(items[j].getType() == FormApp.ItemType.LIST){
        
      }else if(items[j].getType() == FormApp.ItemType.MULTIPLE_CHOICE){
        formItem = items[j].asMultipleChoiceItem();
        multiplechoiceoptions = formItem.getChoices()
        response = formItem.createResponse( multiplechoiceoptions[0].getValue() );//sets the value to the first option
        formResponse.withItemResponse(response);
      }else if(items[j].getType() == FormApp.ItemType.PAGE_BREAK){
        
      }else if(items[j].getType() == FormApp.ItemType.PARAGRAPH_TEXT){
        
      }else if(items[j].getType() == FormApp.ItemType.SCALE){
        
      }else if(items[j].getType() == FormApp.ItemType.SECTION_HEADER){
        
      }else if(items[j].getType() == FormApp.ItemType.TEXT){
        formItem = items[j].asTextItem();
        response = formItem.createResponse(items[j].getTitle().replace(/ /g,'') );
        formResponse.withItemResponse(response);
      }else if(items[j].getType() == FormApp.ItemType.TIME){
        
      }
    }
    var url = formResponse.toPrefilledUrl();//gets the prefilled placeholder url
    return url;  
}
  
  /**
  * updateDetailCaseSheet - updates the indexCase sheet
  * @param {caseID} string - the caseID
  * @param {assignedTo} string - who the case is assigned to 
  * @return {bolean}
  */
  function updateDetailCaseSheet(caseID, itemResponses){
    try{
    var SheetNameLogDataCase = SDGSettings.spreadsheet.sheetNameLogDataCase; //The name of the sheet where the data will be stored
    var sheetNameDetailCase = SDGSettings.spreadsheet.sheetNameDetailCase;//The name of the sheet where the index data will be stored
    var ss = SpreadsheetApp.getActiveSpreadsheet()   //Open the Spreadsheet
    var sh = ss.getSheetByName(sheetNameDetailCase); // gets the sheet
    var newrow =sh.getLastRow()+1; //gets the row number of the next available blank row
    var cols = SDGSettings.sheetInfo.detailCase;
    var colnumFormDataStart = cols.colFormDataStart;
    var values = sh.getDataRange().getValues();
    var bolExists = false;
    var matchingRowNum;
    
    //Get the Row Number
    for (j=0; j<values.length; j++){ //Go through the existing caseID values
      if (Number(values[j][cols.colCaseId-1]) == Number(caseID)){//Check if caseID matches
        bolExists = true;
        matchingRowNum = j+1;
      }
    }

    if (bolExists == false){
      matchingRowNum = newrow;
      sh.getRange(matchingRowNum, cols.colCaseId).setValue(caseID);// add caseID to row
      sh.getRange(matchingRowNum, cols.colStatus).setValue('Open'); //add default status
      sh.getRange(matchingRowNum, cols.colIsDeleted).setValue('No'); //add default isdeleted
    }
    
    //---Add Form Data---
    for(i = 0; i< itemResponses.length; i++) {//add all other data
      sh.getRange(matchingRowNum, colnumFormDataStart).setValue(itemResponses[i].getItem().getTitle() + '= ' + itemResponses[i].getResponse());//adds the quesiton text and the data  
      colnumFormDataStart ++;
    }
      
    //Add Name
    var name = getValueFromResponse('Name', itemResponses);
    sh.getRange(matchingRowNum, cols.colName).setValue(name);
    
    //Add Location
    var location = getValueFromResponse('Location', itemResponses);
    sh.getRange(matchingRowNum, cols.colLocation).setValue(location);    
    
    //Add Assigned To
    var assignedTo = getAssignedToFromResponse(itemResponses);
    sh.getRange(matchingRowNum, cols.colAssingedTo).setValue(assignedTo);
    
    //Edit Case Link
    var linkCaseEdit = SDGData.getCaseEditLink(caseID);
    sh.getRange(matchingRowNum, cols.colEditCaseLink).setValue(linkCaseEdit);
    
    //Delete Case Link
    var linkDeleteCase = SDGData.getDeleteCaseLink(caseID);
    sh.getRange(matchingRowNum, cols.colDeleteCaseLink).setValue(linkDeleteCase);
    
    //Add Action Link
    var linkAddAction = SDGData.getCaseAddActionLink(caseID);
    sh.getRange(matchingRowNum, cols.colAddActionLink).setValue(linkAddAction);
    
    //---Add Last Updated---
    var lastUpdated = Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "yyyy-MM-dd'T'HH:mm:ss z");
    sh.getRange(matchingRowNum, cols.colLastUpdated).setValue(lastUpdated); 
    
    }
    catch (err){
      SDGErrors.custom('SDGFroms.updateDetailCaseSheet caseId='+ caseID +' Error message = ' + err); 
      throw err;
    }

  }
  
  /**
  * updateDetailActionSheet - updates the indexCase sheet
  * @param {actionId} string - the actionId  
  * @param {caseID} string - the caseID
  * @param {itemResponses} string - the data from the form submission 
  * @return {bolean}
  */
  function updateDetailActionSheet(actionId, caseId, itemResponses){
    
    var sheetName = SDGSettings.spreadsheet.sheetNameDetailAction;//The name of the sheet where the index data will be stored
    var ss = SpreadsheetApp.getActiveSpreadsheet()   //Open the Spreadsheet
    var sh = ss.getSheetByName(sheetName); // gets the sheet
    var newrow =sh.getLastRow()+1; //gets the row number of the next available blank row
    var cols = SDGSettings.sheetInfo.detailAction;
    var colNumFormDataStart = cols.colFormDataStart;
    var rangeValues = sh.getDataRange().getValues();
    var bolExists = false;
    var matchingRowNum;
    //Get the Row Number
    for (j=0; j<rangeValues.length; j++){
      if (Number(rangeValues[j][cols.colActionId-1]) == Number(actionId)){
        bolExists = true;
        matchingRowNum = j+1;
      }
    }
    if (bolExists == false){
      matchingRowNum = newrow;
      sh.getRange(matchingRowNum, cols.colActionId).setValue(actionId);
      sh.getRange(matchingRowNum, cols.colCaseId).setValue(caseId);
      sh.getRange(matchingRowNum, cols.colIsDeleted).setValue('No'); //add default status
      
    }
    //---Add Case Resolved---
    var caseResolved = getCaseResolvedFromResponse(itemResponses);
    sh.getRange(matchingRowNum, cols.colCaseResolved).setValue(caseResolved);
    
    //---Add Timestamp---
    var lastUpdated = Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "yyyy-MM-dd'T'HH:mm:ss z");
    sh.getRange(matchingRowNum, cols.colLastUpdated).setValue(lastUpdated); 
    //---Add Form Data---
    for(i = 0; i< itemResponses.length; i++) {//add all other data
      sh.getRange(matchingRowNum, colNumFormDataStart).setValue(itemResponses[i].getItem().getTitle() + '= ' + itemResponses[i].getResponse());//adds the quesiton text and the data  
      colNumFormDataStart ++;
    }
    //Add link Edit Action
    var linkActionEdit = SDGData.getActionEditLink(actionId);  
    sh.getRange(matchingRowNum, cols.colEditActionLink).setValue(linkActionEdit);
    
    //Add link Delete Action
    var linkActionEdit = SDGData.getDeleteActionLink(actionId);  
    sh.getRange(matchingRowNum, cols.colDeleteActionLink).setValue(linkActionEdit);
        
  }
  
  /**
  * updateCaseStatus - updates the indexCase sheet when an action happens
  * @param {caseID} string - the caseID
  */
  function updateCaseStatus(caseId){  
    var sheetNameDetailCase = SDGSettings.spreadsheet.sheetNameDetailCase;//The name of the sheet where the index data will be stored
    var ss = SpreadsheetApp.getActiveSpreadsheet();   //Open the Spreadsheet
    var sh = ss.getSheetByName(sheetNameDetailCase); // gets the sheet
    var cols = SDGSettings.sheetInfo.detailCase;
    var values = sh.getDataRange().getValues()
    var bolExists = false;
    var matchingCaseRowNum;
    //Get the Row Number
    for (j=1; j<values.length; j++){ //Go through the existing caseID values
      if (Number(values[j][cols.colCaseId-1]) == Number(caseId)){//Check if caseID matches
        bolExists = true;
        matchingCaseRowNum = j+1;
      }
    }
    
    //get Updated Case Data
    var detailActionRows = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SDGSettings.spreadsheet.sheetNameDetailAction).getDataRange().getValues();
    var action_colCaseId = SDGSettings.sheetInfo.detailAction.colCaseId;
    var action_colCaseResolved = SDGSettings.sheetInfo.detailAction.colCaseResolved;
    var caseStatus;
    for each (row in detailActionRows){
      if (row[action_colCaseId-1] == caseId){
        caseStatus = row[action_colCaseResolved-1] 
      }
    }
    //Update Case Status
    if (caseStatus == 'Yes'){
      sh.getRange(matchingCaseRowNum, cols.colStatus).setValue('Closed');  
    }else{
      sh.getRange(matchingCaseRowNum, cols.colStatus).setValue('Open');
    }

    //---Add Last Updated---
    var lastUpdated = Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "yyyy-MM-dd'T'HH:mm:ss z");
    sh.getRange(matchingCaseRowNum, cols.colLastUpdated).setValue(lastUpdated); 
    
  }
  
  /**
  * getCaseIDFromResponse - gets the caseID from the response
  * @param {itemResponses} itemResponses - the reponses from the form submission
  * @return {number} the submitted caseID
  */
  function getCaseIDFromResponse(itemResponses){
    var submittedCaseID="Could not Determine CaseID";
    for(i = 0; i< itemResponses.length; i++) { //Go through repsonses and get the Submitted Case ID
      if (itemResponses[i].getItem().getTitle() === "Case ID"){ //check for caseID question
        submittedCaseID = itemResponses[i].getResponse()//get the submitted caseID value
      }
    }
    return submittedCaseID;
  }
  
  /**
  * getValueFromResponse - gets the AddedBy data from the response
  * @param {itemResponses} itemResponses - the reponses from the form submission
  * @param {title} string - the title of the question 
  * @return {string} the AddedBy text
  */
  function getValueFromResponse(title, itemResponses){
    var answer="Could not Determine " + title;
    for(i = 0; i< itemResponses.length; i++) { //Go through repsonses and get the Added By value
      if (itemResponses[i].getItem().getTitle() === title){ 
        answer = itemResponses[i].getResponse()//get the  value
      }
    }
    return answer;
  }
  
  /**
  * getDeleteActionFromResponse - gets the delete action data from the response
  * @param {itemResponses} itemResponses - the reponses from the form submission
  * @return {string} the AddedBy text
  */
  function getActionToTakeFromResponse(itemResponses){
    var action="Could not Determine Action To Take";
    for(i = 0; i< itemResponses.length; i++) { //Go through repsonses and get the Action To Take value
      if (itemResponses[i].getItem().getTitle() === "Action To Take"){ 
        action = itemResponses[i].getResponse()//get the  value
      }
    }
    return action;
  }
  
  /**
  * getAssignedToFromResponse - gets the AddedBy data from the response
  * @param {itemResponses} itemResponses - the reponses from the form submission
  * @return {string} the AddedBy text
  */
  function getAssignedToFromResponse(itemResponses){
    var addedBy="Could not Determine Assign Case";
    for(i = 0; i< itemResponses.length; i++) { //Go through repsonses and get the Added By value
      if (itemResponses[i].getItem().getTitle() === "Assign Case"){ 
        addedBy = itemResponses[i].getResponse()//get the  value
      }
    }
    return addedBy;
  }
  
    /**
  * getAssignedToFromCaseId - gets the Assigned To form the Detail Case Sheet by using the Case ID
  * @param {string} caseId - the case ID
    * @return {string} the AssignedTo text
  */
  function getAssignedToFromCaseId(caseId){
    var sheetNameDetailCase = SDGSettings.spreadsheet.sheetNameDetailCase;//The name of the sheet where the index data will be stored
    var ss = SpreadsheetApp.getActiveSpreadsheet();   //Open the Spreadsheet
    var sh = ss.getSheetByName(sheetNameDetailCase); // gets the sheet
    var cols = SDGSettings.sheetInfo.detailCase;
    var values = sh.getDataRange().getValues()
    var bolExists = false;
    var matchingCaseRowNum;
    //Get the Row Number
    for (j=1; j<values.length; j++){ //Go through the existing caseID values
      if (Number(values[j][cols.colCaseId-1]) == Number(caseId)){//Check if caseID matches
        bolExists = true;
        matchingCaseRowNum = j+1;
      }
    }
    return sh.getRange(matchingCaseRowNum, cols.colAssingedTo).getValue();   
  }
  
  /**
  * getCaseResolvedFromResponse - gets the AddedBy data from the response
  * @param {itemResponses} itemResponses - the reponses from the form submission
  * @return {string} the AddedBy text
  */
  function getCaseResolvedFromResponse(itemResponses){
    var value="Could not Determine";
    for(i = 0; i< itemResponses.length; i++) { //Go through repsonses and get the Added By value
      if (itemResponses[i].getItem().getTitle() === "Case Resolved"){ 
        value = itemResponses[i].getResponse()//get the  value
      }
    }
    return value;
  }
  
  /**
  * isCaseIDValid - checks if the caseID is valid
  * @param {submittedCaseID} number - the caseID
  * @param {sh} sheet - the sheet with the case info
  * @return {bolean}
  */
  function isCaseIDValid(submittedCaseID){
    var sheetName = SDGSettings.spreadsheet.sheetNameDetailCase;
    var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName); 
    
    var columnLetterForID = 'A'; // the column holding the id
    var refRangeForAllIDs = columnLetterForID + '1' + ':' + columnLetterForID + sh.getLastRow(); //range for all ids (eg 'A1:A')
    
    var caseIDValues = sh.getRange(refRangeForAllIDs).getValues();// get all the values in the ID column
    
    var bolCaseIDExists = false;
    //Check if the case id matches a Case ID
    for (j=0; j<caseIDValues.length; j++){ //Go through the existing caseID values
      if (Number(caseIDValues[j]) == Number(submittedCaseID)){//Check if submittedCaseID is valid
        bolCaseIDExists = true;
      }
    }
    //Check if the case id is numeric
    
    if (isNumeric(submittedCaseID)){
      //do nothing the case id is numeric
    }else
    {
      //Set to false - the submittedCaseID is not numeric
      bolCaseIDExists = false;
    }
    return bolCaseIDExists;
  }
   /**
  * getActionIDFromResposne - gets the actionID from the form response
  * @param {itemResponses} itemResponses - the reponses from the form submission
  * @return {number} the submitted actionID
  */
  function getActionIDFromResposne(itemResponses){
    var submittedActionID="Could not Determine ActionID";
    for(i = 0; i< itemResponses.length; i++) { //Go through repsonses and get the Submitted ActionID
      if (itemResponses[i].getItem().getTitle() === "Action ID"){ //check for actionID question
        submittedActionID = itemResponses[i].getResponse()//get the submitted actionID value
      }
    }
    return submittedActionID;
  }
  /**
  * isActionIDValid - checks if the actionID is valid
  * @param {actionId} string - the actionID
  * @return {bolean}
  */
  function isActionIDValid(actionId){
    var sheetName = SDGSettings.spreadsheet.sheetNameDetailAction;
    var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    var values = sh.getDataRange().getValues();
    var colActionId = SDGSettings.sheetInfo.detailAction.colActionId;
    var bolExists = false;
    for (j=0; j<values.length; j++){ 
      if (Number(values[j][colActionId-1]) == Number(actionId)){//Check if submittedActionID is valid
        bolExists = true;
      }
    }
    //Check if the action id is numeric
    if (isNumeric(actionId)){
      //do nothing the case id is numeric
    }else
    {
      //Set to false - the submittedActionID is not numeric
      bolExists = false;
    }
    return bolExists;
  }
  /**
  * isNumeric - gets the next available Case ID
  * @param {n} number - the caseID number to check
  * @return {boolean} 
  */
  function isNumeric(n){
    //Code From: http://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric?page=1&tab=votes#tab-top
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
  /**
  * getNextAvailableCaseID - gets the next available Case ID
  * @param {sh} sheet - the sheet with the case info
  * @return {number} returns the ID
  */
  function getNextAvailableCaseID(sh){
    var columnLetterForID = 'A'; // the column holding the id
    var refRangeForAllIDs = columnLetterForID + '1' + ':' + columnLetterForID+ sh.getLastRow(); //range for all ids (eg 'A1:A')
    var caseIDValues = sh.getRange(refRangeForAllIDs).getValues();// get all the values in the ID column
    var maxCaseID=0;
    for (j=0; j<caseIDValues.length; j++){ //Go through the existing caseID values      
      if (isNumeric(caseIDValues[j])) {
        if (Number(caseIDValues[j]) > maxCaseID){
              maxCaseID = Number(caseIDValues[j]);   
        }
      }
    }
    return Number(maxCaseID) +1; 
  }
  /**
  * getNextAvailableActionID - gets the next available Action ID
  * @param {sh} sheet - the sheet with the action info
  * @return {number} returns the ID
  */
  function getNextAvailableActionID(sh){
    var columnLetterForID = 'B'; // the column holding the id
    var refRangeForAllIDs = columnLetterForID + '1' + ':' + columnLetterForID+ sh.getLastRow(); //range for all ids (eg 'A1:A')
    var actionIDValues = sh.getRange(refRangeForAllIDs).getValues();// get all the values in the ID column
    var maxActionID=0;
    for (j=0; j<actionIDValues.length; j++){ //Go through the existing actionID values      
      if (isNumeric(actionIDValues[j])) {
        if (Number(actionIDValues[j]) > maxActionID){
              maxActionID = Number(actionIDValues[j]);   
        }
      }
    }
    return Number(maxActionID) +1; 
  }
  
  /**
  * createForm - creates a form in a folder
  * @param {string} formName - name of the form
  * @param {string} folderName = name of the folder
  * @return {string} returns the ID of the created form
  */
  function createForm(formName){

    var form;
    var formId;
    var folderId = SDGSettings.index.getIdByLinkName('FormsFolder');
    var folder = DriveApp.getFolderById(folderId);
    var descriptionOfChange;
    formId = SDGSettings.index.getIdByLinkName(formName+'Form');
    if (formId == 'Not Found'){ //the form does not exist
      form = FormApp.create(formName);//creates the form in the root folder  
      formId = form.getId();
      var fileForm = DriveApp.getFileById(formId);
      folder.addFile(fileForm); //add new parent folder to file
      DriveApp.getRootFolder().removeFile(fileForm);//remove the root folder as a parent to the file
      descriptionOfChange = "Created a New " + formName + " Form";
      //Update indexLink
      SDGSettings.index.updateLink(formName+'Form', form.getPublishedUrl(), formId);
    }else{
      form = FormApp.openById(formId); 
      descriptionOfChange = "Updated an Existing " + formName + " Form";
    }
    //Update Log
    var ss = SpreadsheetApp.getActive();
    var sheetname = SDGSettings.spreadsheet.getFormLogSheetName(formName);
    var sh = ss.getSheetByName(sheetname)
    var timestamp = Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "yyyy-MM-dd'T'HH:mm:ss z");
    var useremail = Session.getEffectiveUser().getEmail();
    sh.appendRow([timestamp,useremail,descriptionOfChange,formId])
    return formId;
  }
  /**
  * removeAnyQuestionsOnForm - removes all the form items
  * @param {string} formID = the forms ID
  */
  function removeAnyQuestionsOnForm(formID){
    var form = FormApp.openById(formID);
    var items = form.getItems() 
    for(i = 0; i< items.length; i++){
      var item = items[i];
      form.deleteItem(item);
    }
  }
  /**
  * addQuestionsToForm - manages the process of adding questions to a form
  * @param {string} formName - name of the form
  * @param {string} formID = the forms ID
  * @param {string} formTitle = the forms Title
  * @return {string} returns the ID of the created form
  */
  function addQuestionsToForm(formName, formID, formTitle){
   var questions = SDGSettings.form.getFormQuestions(formName);//get questions data
    var form = FormApp.openById(formID);
    form.setTitle(formTitle);
    var currentSection;
    var currentPage = 1;
    var pagebreaks = [];
    var cols = SDGSettings.sheetInfo.question;
    
    
//    var columnPage = 0;
//    var columnSection = 1;
//    var columnTitle = 2;
//    var columnHelpText = 3
//    var columnTypeOfControl = 4;
//    var columnChoiceList = 5;
//    var columnDatabaseColumn = 6;
    
    var count = 0;
    //***Add Questions***
    questions.forEach(function(row){
      if (count > 0){ //skips header row
        if (currentPage != row[cols.colPage-1]){ //Pages
          pagebreaks.push(form.addPageBreakItem()); //Add new page break
        }
        if (currentSection != row[cols.colSection-1]){ //Sections
          form.addSectionHeaderItem().setTitle(row[cols.colSection-1]); //Add new Header
        }

        addFormQuestion(row, form,cols.colTitle, cols.colHelpText,cols.colTypeOfControl,cols.colChoiceList);     
        currentPage = row[cols.colPage-1];
        currentSection = row[cols.colSection-1];
      }
      count = count + 1;
    }); 
  }
   /** addFormQuestion - adds a question to a form
  * @param [array] row - the row of data from the Questions sheet - this holds the quesitons details
  * @param {form} form - the form that will have the question added to it
  * @param {number} columnQuestionText - the column number that has the question text
  * @param {number} columnHelpText - the column number that has the help text
  * @param {number} columnTypeOfControl - the column number that has the type of control 
  * @param {number} columnChoiceList - the column number that has the choice list name 
  */
  function addFormQuestion(row, form, columnQuestionText, columnHelpText,columnTypeOfControl, columnChoiceList){ 
//    Logger.log('formid='+form.getId());
//     Logger.log('row='+ row);
//    Logger.log('columnTypeOfControl='+columnTypeOfControl);
//    Logger.log('************************************' + row[columnTypeOfControl]);
    
    var typeofquestion = row[columnTypeOfControl-1];
    var newItem;
    if (typeofquestion == 'TextItem'){
      newItem = form.addTextItem();
    }else if(typeofquestion == 'TimeItem'){
      newItem = form.addTimeItem();
    }else if(typeofquestion == 'VideoItem'){
      newItem = form.addVideoItem();
    }else if(typeofquestion == 'ScaleItem'){
      newItem = form.addScaleItem();
    }else if(typeofquestion == 'ParagraphTextItem'){
      newItem = form.addParagraphTextItem();
    }else if(typeofquestion == 'MultipleChoiceItem'){
      newItem = form.addMultipleChoiceItem();
      addChoiceLists(newItem,row[columnChoiceList-1]);
    }else if(typeofquestion == 'ListItem'){
      newItem = form.addListItem();
    }else if(typeofquestion == 'ImageItem'){
      newItem = form.addImageItem()
    }else if(typeofquestion == 'GridItem'){
      newItem = form.addGridItem();
    }else if(typeofquestion == 'DurationItem'){
      newItem = form.addDurationItem();
    }else if(typeofquestion == 'DateTimeItem'){
      newItem = form.addDateTimeItem()
    }else if(typeofquestion == 'DateItem'){
      newItem = form.addDateItem();
    }else if(typeofquestion == 'CheckboxItem'){
      newItem = form.addCheckboxItem()
    }else {
      newItem = 'unknown'
      SDGErrors.custom('The Questions Item Type: ' + typeofquestion + ' Is unknown. the question could not be added. Row data = ' + row);
    }
    newItem.setTitle(row[columnQuestionText-1]);
    newItem.setHelpText(row[columnHelpText-1]);
    return newItem;
  }
  /**
  * addChoiceLists - adds the different choice to questions with lists
  * @param {string} item - the question
  * @param [array] choicelistname - the array of options
  */
  function addChoiceLists (item,choicelistname){
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var choiceList;
    var choiceArray = [];
    if (choicelistname == 'CaseType'){
      //choiceList = SDGSettings.lists.caseType;
      choiceList = ss.getSheetByName('listCaseType').getDataRange().getValues();
    }else if (choicelistname == 'AssignCase'){
      //choiceList = SDGSettings.lists.assignCase;
      choiceList = ss.getSheetByName('listAssignCase').getDataRange().getValues();
    }else if (choicelistname == 'ActionTaken'){
      //choiceList = SDGSettings.lists.actionTaken;
      choiceList = ss.getSheetByName('listActionTaken').getDataRange().getValues();
    }else if (choicelistname == 'CaseResolved'){
      //choiceList = SDGSettings.lists.caseResolved;
      choiceList =ss.getSheetByName('listCaseResolved').getDataRange().getValues();
    }else if (choicelistname == 'DeleteConfirm'){
      //choiceList = SDGSettings.lists.deleteConfirm;
      choiceList = ss.getSheetByName('listDeleteConfirm').getDataRange().getValues();
    }
    
    for(i=1;i<choiceList.length;++i){//start at i=1 to skip the header
      choiceArray.push(choiceList[i][0]);
    }
    item.setChoiceValues(choiceArray);   
  }
  
  
  
})();
