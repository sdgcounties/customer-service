//SDG Settings  
var SDGSettings = (function () {
  var ss;
  var sh;
  var SDGSettings = {};
  SDGSettings.namespaceName = 'SDGSettings';
  ss = SpreadsheetApp.getActiveSpreadsheet();
  SDGSettings.spreadsheetname = ss.getName();
  SDGSettings.spreadsheetid = ss.getId();
  
  //Validation
  SDGSettings.validation = {};
  SDGSettings.validation.validateThisId = validateThisId;
  SDGSettings.validation.validateIndexLinkIds = validateIndexLinkIds;
  //Setup
  SDGSettings.setup = {};
  SDGSettings.setup.setupMainFolder = setupMainFolder;
  SDGSettings.setup.setupAllFolders = setupAllFolders;
  SDGSettings.setup.createFolder = createFolder;  
  //Sheets
  SDGSettings.spreadsheet = {};
  SDGSettings.spreadsheet.sheetNameLogDataCase = 'logDataCase';
  SDGSettings.spreadsheet.sheetNameLogDataAction = 'logDataAction';
  SDGSettings.spreadsheet.sheetNameDetailCase = 'detailCase';
  SDGSettings.spreadsheet.sheetNameDetailAction = 'detailAction';
  SDGSettings.spreadsheet.sheetNameIndexLink = 'indexLink';
  SDGSettings.spreadsheet.sheetNameLogValidation = 'logValidation';
  SDGSettings.spreadsheet.sheetNameListAssignCase = 'listAssignCase';
  SDGSettings.spreadsheet.getFormLogSheetName = getFormLogSheetName;
  SDGSettings.sheetInfo = {};
  SDGSettings.sheetInfo.detailCase = {};
  SDGSettings.sheetInfo.detailCase.colCaseId = '1';
  SDGSettings.sheetInfo.detailCase.colStatus = '2';
  SDGSettings.sheetInfo.detailCase.colName = '3';
  SDGSettings.sheetInfo.detailCase.colLocation = '4';
  SDGSettings.sheetInfo.detailCase.colAssingedTo = '5';
  SDGSettings.sheetInfo.detailCase.colEditCaseLink = '6';
  SDGSettings.sheetInfo.detailCase.colDeleteCaseLink = '7';
  SDGSettings.sheetInfo.detailCase.colAddActionLink = '8';
  SDGSettings.sheetInfo.detailCase.colSummaryDocLink = '9';
  SDGSettings.sheetInfo.detailCase.colSummaryDocId = '10';
  SDGSettings.sheetInfo.detailCase.colIsDeleted = '11';
  SDGSettings.sheetInfo.detailCase.colLastUpdated = '12';
  SDGSettings.sheetInfo.detailCase.colLinkUpToDate = '13';
  SDGSettings.sheetInfo.detailCase.colSummaryDocUpToDate = '14';
  SDGSettings.sheetInfo.detailCase.colFormDataStart = '15';
  SDGSettings.sheetInfo.detailAction = {};
  SDGSettings.sheetInfo.detailAction.colActionId = '1';
  SDGSettings.sheetInfo.detailAction.colCaseId = '2';
  SDGSettings.sheetInfo.detailAction.colEditActionLink = '3';
  SDGSettings.sheetInfo.detailAction.colDeleteActionLink = '4';
  SDGSettings.sheetInfo.detailAction.colLastUpdated = '5';
  SDGSettings.sheetInfo.detailAction.colIsDeleted = '6';
  SDGSettings.sheetInfo.detailAction.colCaseResolved = '7';
  SDGSettings.sheetInfo.detailAction.colFormDataStart = '8';
  SDGSettings.sheetInfo.question = {};
  SDGSettings.sheetInfo.question.colPage = '1';
  SDGSettings.sheetInfo.question.colSection = '2';
  SDGSettings.sheetInfo.question.colTitle = '3';
  SDGSettings.sheetInfo.question.colHelpText = '4';
  SDGSettings.sheetInfo.question.colTypeOfControl = '5';
  SDGSettings.sheetInfo.question.colChoiceList = '6';
  SDGSettings.sheetInfo.question.colUrlPrefillPart = '7';
  SDGSettings.sheetInfo.question.colDefaultValue = '8';
  SDGSettings.sheetInfo.listAssignCase = {};
  SDGSettings.sheetInfo.listAssignCase.colName = '1';
  SDGSettings.sheetInfo.listAssignCase.colEmail = '2';
  SDGSettings.sheetInfo.listAssignCase.Department = '3';
  SDGSettings.sheetInfo.indexLink = {};
  SDGSettings.sheetInfo.indexLink.colSummaryListUpToDate = '6';
  
  //Index
  SDGSettings.index = {};
  SDGSettings.index.getIdByLinkName = getIdByLinkName;
  SDGSettings.index.getUrlByLinkName = getUrlByLinkName;
  SDGSettings.index.updateLink = updateLink; 
  //Form
  SDGSettings.form = {};
  SDGSettings.form.getFormQuestions = getFormQuestions;
  //Lists  
  //SDGSettings.lists = {};
  //SDGSettings.lists.caseType = ss.getSheetByName('listCaseType').getDataRange().getValues();
  //SDGSettings.lists.assignCase = ss.getSheetByName('listAssignCase').getDataRange().getValues();
  //SDGSettings.lists.actionTaken = ss.getSheetByName('listActionTaken').getDataRange().getValues();
  //SDGSettings.lists.caseResolved = ss.getSheetByName('listCaseResolved').getDataRange().getValues();
  //SDGSettings.lists.deleteConfirm = ss.getSheetByName('listDeleteConfirm').getDataRange().getValues();
  //Filter Criteria
  SDGSettings.filterCaseOptions = {};
  SDGSettings.filterCaseOptions.status = 'All';//Open,Closed,All
  SDGSettings.filterCaseOptions.isDeleted = 'All';//Yes, No, All
  SDGSettings.filterCaseOptions.assignedTo = 'All';//name of assigend to, All
  SDGSettings.filterCaseOptions.dateStart = 'All';//2016-01-01, All
  SDGSettings.filterCaseOptions.dateEnd = 'All';//2016-01-01, All
  SDGSettings.filterCaseOptions.lastUpdatedStart = 'All';//2016-01-01, All
  SDGSettings.filterCaseOptions.lastUpdatedEnd = 'All'; //2016-01-01, All
  return SDGSettings;
  
  //***Public Functions***
    /**
  * validateIndexLinkIds - validates all the ids on the indexLinks sheet
  */
  function validateIndexLinkIds(){
    var ss = SpreadsheetApp.getActiveSpreadsheet()   //Open the Spreadsheet
    var sheetName = SDGSettings.spreadsheet.sheetNameIndexLink
    var sh = ss.getSheetByName(sheetName); // gets the sheet
    var colNumName = 1;
    var colLetterName = 'A'; // the column holding the id
    var colNumId = 4;
    var colLetterId = 'D'; 
    var refRange = colLetterName + '2' + ':' + colLetterId + sh.getLastRow();
    var rangeValues = sh.getRange(refRange).getValues();// get all the values in the ID column
    var matchingRowNum;
    var name;
    var id;
    var count=0;
    for (j=0; j<rangeValues.length; j++){ //Go through the existing ID values
      name = rangeValues[j][colNumName-1];
      id = rangeValues[j][colNumId-1]
      validateThisId(name,id);
    }  
  }
  /**
  * validateThisId - validates that the provided id is a valid file or folder
  * @param {string} Name - the name of thing to validate
  * @param {string} id - the id
  */  
  function validateThisId(Name, id){
    try{
      var file = DriveApp.getFileById(id);
      var mimeType = file.getMimeType();
      var fileName = file.getName();
      var fileUrl = file.getUrl();
      var result = 'Invalid';
      var errorMsg = 'no error';
      if (file.isTrashed()){
        errorMsg = 'File is in the trash';
        result = 'Invalid';
        addValidationLogEntry(Name,mimeType,fileUrl,id,fileName,result,errorMsg);  
        return false;
      }
	  if (fileName.length >0){
        result = 'Valid';
        addValidationLogEntry(Name,mimeType,fileUrl,id,fileName,result,errorMsg);
        return true;       
      }
 
    }
    catch(err){
      var errorMsg = err;
      addValidationLogEntry(Name,'X','X',id,'X','Invalid',err);
      return false;
    }
  }
  /**
  * setupAllFolders - setups up all of the default folders
  */
  function setupAllFolders(){
    setupMainFolder();
    createFolder('FormsFolder','Forms');
    createFolder('DocumentsFolder', 'Documents');
  }
  /**
  * setupMainFolder - setups up the main folder
  */
  function setupMainFolder(){
    var folderName = 'MainFolder';
    var folderTitle = 'CustomerService';
    //check if Folder is already setup
    var folderId = getIdByLinkName('MainFolder');
    if (folderId == 'Not Found'){
      //If Main Folder Id does not exist then do this
      var currentFileId = SpreadsheetApp.getActive().getId();
      var currentFile = DriveApp.getFileById(currentFileId);
      var parentFolders = currentFile.getParents();
      //move the spreadsheet to the new main folder
      var mainFolder = DriveApp.createFolder(folderTitle);
      mainFolder.addFile(currentFile);
      while (parentFolders.hasNext()){
        folder = parentFolders.next();
        folder.removeFile(currentFile);//remove the spreadsheet from other folders
      }
      var folderUrl = mainFolder.getUrl();
      folderId = mainFolder.getId();
      SDGSettings.index.updateLink(folderName, folderUrl, folderId);
    }
  }
  /**
  * folderCreate - creates a folder
  * @param {string} folderName - name of the folder
  * @param {string} folderTitle - the title of the folder - this is what a user would see when navigating google drive
  */
  function createFolder(folderName, folderTitle){
    var folderId = SDGSettings.index.getIdByLinkName(folderName);
    if (folderId == 'Not Found' || folderId == ''){
      var folder = DriveApp.createFolder(folderTitle);
      if (folderName !== 'MainFolder'){
        //put the folder inside the Main Folder
        var mainFolderId = SDGSettings.index.getIdByLinkName('MainFolder')
        var mainFolder = DriveApp.getFolderById(mainFolderId);
        mainFolder.addFolder(folder); //add folder to main Folder (eg CustomerService)
        DriveApp.getRootFolder().removeFolder(folder); //remove new folder from root folder
      }
      folderId = folder.getId();
      var folderUrl = folder.getUrl();
      SDGSettings.index.updateLink(folderName, folderUrl, folderId);
    }
  }
  /**
  * updateLink - creates or updates the on Submit Triggers
  * @param {string} linkName - the name of the link
  * @param {string} url - the url
  */
  function updateLink(linkName, url, id){
    var sheetNameIndexLink = SDGSettings.spreadsheet.sheetNameIndexLink;
    var ss = SpreadsheetApp.getActiveSpreadsheet()   //Open the Spreadsheet
    var sh = ss.getSheetByName(sheetNameIndexLink); // gets the sheet
    var newrow =sh.getLastRow()+1; //gets the row number of the next available blank row
    var colNumName = 1;
    var colLetterName = 'A';
    var colNumURL = 3;
    var colNumId = 4;
    var colNumLastUpdated = 5;
    var colLetterLastUpdated = 'E';
    var refRange = colLetterName + '2' + ':' + colLetterLastUpdated + sh.getLastRow();
    var rangeValues = sh.getRange(refRange).getValues();// get all the values in the ID column
    var bolExists = false;
    var matchingRowNum;
    //Get the Row Number
    for (j=0; j<rangeValues.length; j++){ //Go through the existing ID values
      if (rangeValues[j][colNumName-1] == linkName){
        bolExists = true;
        matchingRowNum = j+1+1;
        break;
      }
    }
    var lastUpdated = Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "yyyy-MM-dd'T'HH:mm:ss z");
    if (bolExists == true){
      sh.getRange(matchingRowNum, colNumURL).setValue(url);
      sh.getRange(matchingRowNum, colNumId).setValue(id);
      sh.getRange(matchingRowNum, colNumLastUpdated).setValue(lastUpdated); 
    }
    if (bolExists == false){
      matchingRowNum = newrow;
      sh.getRange(matchingRowNum, colNumName).setValue(linkName);
      sh.getRange(matchingRowNum, colNumURL).setValue(url);
      sh.getRange(matchingRowNum, colNumId).setValue(id);
      sh.getRange(matchingRowNum, colNumLastUpdated).setValue(lastUpdated); 
    }
  }
  /**
  * getUrlByLinkName - gets a url from the indexLink sheet by its Name
  * @param {string} linkName - the name of the file or folder
  */
  function getUrlByLinkName(linkName){
    var ss = SpreadsheetApp.getActiveSpreadsheet()   //Open the Spreadsheet
    var sheetName = SDGSettings.spreadsheet.sheetNameIndexLink
    var sh = ss.getSheetByName(sheetName); // gets the sheet
    var colNumName = 1;
    var colLetterName = 'A'; // the column holding the id
    var colNumUrl = 3;
    var colLetterUrl = 'C'; 
    var refRange = colLetterName + '1' + ':' + colLetterUrl + sh.getLastRow();
    var rangeValues = sh.getRange(refRange).getValues();// get all the values in the ID column
    var bolExists = false;
    var matchingRowNum;
    var url;
    //Get the Row Number
    for (j=0; j<rangeValues.length; j++){ //Go through the existing ID values
      if (rangeValues[j][colNumName-1] == linkName){
        bolExists = true;
        matchingRowNum = j+1+1;
        url = rangeValues[j][colNumUrl-1];
        break;
      }
    }
    if (bolExists == true){
      return url;
    }
    if (bolExists == false){
      //call validate links
      //call custom error message
      SDGErrors.custom("The link named:" + linkName + "could not be found. The url could not be returned.");
      return 'Not Found';
    }
    
  }
  /**
  * getIdByLinkName - gets an id from the indexLink sheet by its Name
  * @param {string} linkName - the name of the file or folder
  */
  function getIdByLinkName(linkName){
    var ss = SpreadsheetApp.getActiveSpreadsheet()   //Open the Spreadsheet
    var sheetName = SDGSettings.spreadsheet.sheetNameIndexLink
    var sh = ss.getSheetByName(sheetName); // gets the sheet
    var colNumName = 1;
    var colLetterName = 'A'; // the column holding the id
    var colNumId = 4;
    var colLetterId = 'D'; 
    var refRange = colLetterName + '2' + ':' + colLetterId + sh.getLastRow();
    var rangeValues = sh.getRange(refRange).getValues();// get all the values in the ID column
    var bolExists = false;
    var matchingRowNum;
    var id;
    //Get the Row Number
    for (j=0; j<rangeValues.length; j++){ //Go through the existing ID values
      if (rangeValues[j][colNumName-1] == linkName){  
        matchingRowNum = j+1+1;
        id = rangeValues[j][colNumId-1];
        if(id.length>0){
          bolExists = true;
        }
        break;
      }
    }
    
    if (bolExists == true){   
      return id;
    }
    if (bolExists == false){
      //call validate links
      //call custom error message
      //SDGErrors.custom("The link named:" + linkName + "could not be found. The id could not be returned.");
      return 'Not Found';
    }
    
  }
  /**
  * getFormQuestions - gets all the data on the question sheet for the given form
  * @param {string} formName - the name of the form
  */
  function getFormQuestions(formName){
    var sheetName = 'question' + formName;
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName(sheetName);
    return sh.getDataRange().getValues();
  }
  /**
  * getFormLogSheetName - gets the forms log sheet name
  * @param {string} formName - the name of the form
  */
  function getFormLogSheetName(formName){
    var sheetName = 'log' + formName + 'Form';
    return sheetName;
  }

  
  //*****Private Helper Functions***** 
  /**
  * addValidationLogEntry - adds a log entry
  * @param {string} Name - the name id 
  * @param {string} mimeType - mimeType
  * @param {string} url - Url
  * @param {string} id - idl
  * @param {string} fileName - fileName derived from getFileName()
  * @param {string} result - Valid or Invalid
  * @param {errorMsg} result - the error message
  */
  function addValidationLogEntry(Name,mimeType,Url,id,fileName,result,errorMsg){
    var sheetName = SDGSettings.spreadsheet.sheetNameLogValidation; //Log the data that was submitted
    var ss = SpreadsheetApp.getActiveSpreadsheet()   //Open the Spreadsheet
    var sh = ss.getSheetByName(sheetName); // gets the sheet    
    var timestamp = Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "yyyy-MM-dd'T'HH:mm:ss z");
    sh.appendRow([timestamp,Name,mimeType,Url,id,fileName,result,errorMsg])
  }
  
  
})();
