//var SDGDocuments_BrokenOnPurpose = (function() {
//  var SDGDocuments = {};
//  SDGDocuments.documents = {};
//  //SDGDocuments.generateCaseListings = generateCaseListings;
//  SDGDocuments.createCaseSummaryDoc = createCaseSummaryDoc;
//  SDGDocuments.populateSummaryDoc = populateSummaryDoc;
//  SDGDocuments.createListingDoc = createListingDoc;
//  SDGDocuments.populateListingDoc = populateListingDoc;
//  SDGDocuments.updateListingDocument = updateListingDocument;
//  SDGDocuments.updateListingDocumentAllCases = updateListingDocumentAllCases;
//  SDGDocuments.updateListingDocuments = updateListingDocuments;
//  SDGDocuments.setAllUpCaseDetailUpToDateColsAsNo = setAllUpCaseDetailUpToDateColsAsNo;
//  SDGDocuments.setIsTheSummaryListUpToDateAsNo = setIsTheSummaryListUpToDateAsNo;
//  SDGDocuments.setSummaryListUpToDateAsYes = setSummaryListUpToDateAsYes;
//  SDGDocuments.updateAllSummaryDocs = updateAllSummaryDocs;
//  SDGDocuments.setFilePermission = setFilePermission;
//  SDGDocuments.setAllUpCaseDetailUpToDateColsAsNo = setAllUpCaseDetailUpToDateColsAsNo;
//  SDGDocuments.filterCases = filterCases;
//  
//  return SDGDocuments
//  
//  //***Public Functions***
//  /**
//  * setDocumentPermission - sets the permission on a document
//  * @param {string} id - the id
//  * @return {string} returns the Id of the doc
//  */
//  function setFilePermission(id){
//    try{
//      var file = DriveApp.getFileById(id);
//      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
//    }catch(err){
//      SDGErrors.custom('SDGDocuments.setFilePermission Error message = ' + err); 
//    }
//  }
//  /**
//  * setAllUpCaseDetailUpToDateColsAsNo - sets all of the uptodate columns as no
//  */
//  function setAllUpCaseDetailUpToDateColsAsNo(){
//    var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SDGSettings.spreadsheet.sheetNameDetailCase)
//    var rows = sh.getDataRange().getValues();
//    var cols = SDGSettings.sheetInfo.detailCase;
//    
//    for (var j=2;j<=rows.length;j++){//start at second row
//      sh.getRange(j, cols.colSummaryDocUpToDate).setValue("No at " + Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "yyyy-MM-dd'T'HH:mm:ss z"));
//      sh.getRange(j, cols.colLinkUpToDate).setValue("No at " + Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "yyyy-MM-dd'T'HH:mm:ss z"));
//    }   
//  }
//
//  /** 
//  * setIsTheSummaryListUpToDateAsNo - sets the case listing up to date column to no
//  */
//  function setIsTheSummaryListUpToDateAsNo(){
//    var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SDGSettings.spreadsheet.sheetNameIndexLink)
//    var rows = sh.getDataRange().getValues();
//    var cols = SDGSettings.sheetInfo.indexLink;
//    
//    var colName = '0';//Name column
//    
//    for (var i=2;i<=rows.length;i++){//start at second row
//      var indexName = rows[i-1][colName];
//      if (indexName.substring(0,5) == "Cases"){
//        sh.getRange(i, cols.colSummaryListUpToDate).setValue("No at " + Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "yyyy-MM-dd'T'HH:mm:ss z"));
//      }
//    } 
//  }
//  
//  /** 
//  * setSummaryListUpToDateAsYes - sets the case listing up to date column to no
//  * @param {string} name - the name of the assigned To 
//  */
//  function setSummaryListUpToDateAsYes(name){
//    var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SDGSettings.spreadsheet.sheetNameIndexLink)
//    var rows = sh.getDataRange().getValues();
//    var cols = SDGSettings.sheetInfo.indexLink;
//    var colName = '0';//Name column
//    
//    for (var i=2;i<=rows.length;i++){//start at second row
//      var indexName = rows[i-1][colName];
//      if (indexName == name){
//        sh.getRange(i, cols.colSummaryListUpToDate).setValue("Yes at " + Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "yyyy-MM-dd'T'HH:mm:ss z"));
//      }
//    } 
//  }
//  
//  /**
//  * updateAllSummaryDocs - updates all summary documents
//  */
//  function updateAllSummaryDocs(){
//    var startTime = new Date();
//    var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SDGSettings.spreadsheet.sheetNameDetailCase)
//    var rows = sh.getDataRange().getValues();
//    var cols = SDGSettings.sheetInfo.detailCase;  
//    for (var i=2;i<=rows.length;i++){//start at second row
//      if (Math.abs(new Date() - startTime) > 60000*4){//stop processing after a certain number of minutes- to avoid being cut off by the 6min time limit
//        break;
//      }
//      var upToDate = sh.getRange(i, cols.colSummaryDocUpToDate).getValue()
//      if (upToDate.substring(0,2) == "No"){
//        //Update Case Summary Document
//        SDGDocuments.createCaseSummaryDoc(rows[i-1][cols.colCaseId-1]);
//        //set summarydoc and link uptodate columns as yes
//        sh.getRange(i, cols.colSummaryDocUpToDate).setValue("Yes at " + Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "yyyy-MM-dd'T'HH:mm:ss z"));
//        sh.getRange(i, cols.colLinkUpToDate).setValue("Yes at " + Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "yyyy-MM-dd'T'HH:mm:ss z"));
//      }
//    }
//  }
//  /**
//  * updateListingDocuments - updates the listing documents
//  */
//  function updateListingDocuments(){
//    try{
//      //updateListingDocumentAllCases();
//      //AssignedTo
//      //get list of current possible assignedTo 
//      var criteria = JSON.parse(JSON.stringify(SDGSettings.filterCaseOptions));
//      var ss = SpreadsheetApp.getActiveSpreadsheet();
//      var rows = ss.getSheetByName('listAssignCase').getDataRange().getValues(); //SDGSettings.lists.assignCase;
//      for (var i=1;i<rows.length;i++){
//        var name = rows[i][0];
//        updateListingDocument(name);
//        setSummaryListUpToDateAsYes(name);
//      }
//    }
//    catch (err){
//      SDGErrors.custom('SDGDocuments.updateListingDocuments Error message = ' + err);  
//    } 
//  }
//  /**
//  * updateListingDocumentAllCases - updates the all cases document
//  * 
//  */
//  function updateListingDocumentAllCases(){
//     try{
//      //var docName = 'Cases - All';
//      //docId = SDGDocuments.createListingDoc(docName)//creates the doc
//      //var criteria = SDGSettings.filterCaseOptions;
//      //criteria.assignedTo = 'All';
//      //criteria.isDeleted = 'All';
//      //criteria.status = 'All';
//      //SDGDocuments.populateListingDoc(docId, criteria); 
//      //SDGDocuments.setSummaryListUpToDateAsYes(docName);
//       
//      var criteria = SDGSettings.filterCaseOptions;
//      criteria.assignedTo = 'All';
//      criteria.isDeleted = 'All';
//      criteria.status = 'All';
//      var docName = 'Cases - All';
//      docId = SDGDocuments.createListingDoc(docName)//creates the doc
//      SDGDocuments.populateListingDoc(docId, criteria);
//      SDGDocuments.setSummaryListUpToDateAsYes(docName);
//    }
//    catch (err){
//      SDGErrors.custom('SDGDocuments.updateListingDocumentAllCases Error message = ' + err);  
//    } 
//  }
//  
//   /**
//  * updateListingDocument - updates the listing documents
//  * * @param {string} assignedtonamne - a name that a case can be assigned to 
//  */
//  function updateListingDocument(name){
//    try{
//      var criteria = SDGSettings.filterCaseOptions;
//      criteria.assignedTo = name;
//      criteria.isDeleted = 'No';
//      criteria.status = 'Open';
//      var docName = 'Cases - ' + name;
//      docId = SDGDocuments.createListingDoc(docName)//creates the doc
//      SDGDocuments.populateListingDoc(docId, criteria);
//      SDGDocuments.setSummaryListUpToDateAsYes(docName);
//    }
//    catch (err){
//      SDGErrors.custom('SDGDocuments.updateListingDocument Error message = ' + err);  
//    }
//    
//  }
//  
//  
//  /**
//  * createListingDoc - manages creates a listing doc
//  * @param {string} docName - the document name
//  * @return {string} returns the Id of the doc
//  */
//  function createListingDoc(docName){
//    var docId = SDGSettings.index.getIdByLinkName(docName);
//    var isDocValid = SDGSettings.validation.validateThisId(docName,docId);  //check if document is valid
//    if (isDocValid == false){
//      var doc = DocumentApp.create(docName);
//      var docId = doc.getId();
//      var file = DriveApp.getFileById(docId);
//      var folderId = SDGSettings.index.getIdByLinkName('DocumentsFolder');
//      var folder = DriveApp.getFolderById(folderId);
//      folder.addFile(file); //add new parent folder to file
//      DriveApp.getRootFolder().removeFile(file);//remove the root folder as a parent to the file
//      SDGSettings.index.updateLink(docName,file.getUrl(),file.getId());
//      setFilePermission(docId);      
//    }
//    return docId; 
//  }
//  /**
//  * populateListingDoc - populates a listing doc
//  * @param {string} docId - the document id
//  * @param {object} criteria - an object containing the filter criteria
//  * @return {string} returns the Id of the doc
//  */
//  function populateListingDoc(docId, criteria){
//    var madeittoline = 'startoffunction';
//    try{
//      /**log to tempsheet**/
//      var sheetName = "tempsheet";//SDGSettings.spreadsheet.sheetNameLogValidation; //Log the data that was submitted
//      var ss = SpreadsheetApp.getActiveSpreadsheet()   //Open the Spreadsheet
//      var sh = ss.getSheetByName(sheetName); // gets the sheet    
//      var timestamp = Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "yyyy-MM-dd'T'HH:mm:ss z");
//      sh.appendRow([timestamp,"populateListingDoc:",docId])
//      
//      madeittoline ='201';
//      timestamp = Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "yyyy-MM-dd'T'HH:mm:ss z");
//      sh.appendRow([timestamp,"populateListingDoc+"+ madeittoline,docId]);
//      var cases = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SDGSettings.spreadsheet.sheetNameDetailCase).getDataRange().getValues();
//      var cols = SDGSettings.sheetInfo;
//      
//      //filter detailCaseRows
//      cases = filterCases(cases, criteria);
//      var doc = DocumentApp.openById(docId);
//      var docBody = doc.getBody()
//      docBody.appendParagraph('')
//      while (docBody.getNumChildren() > 1) docBody.removeChild( docBody.getChild( 0 ) ); //empties document
//      
//      madeittoline ='212';
//      timestamp = Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "yyyy-MM-dd'T'HH:mm:ss z");
//      sh.appendRow([timestamp,"populateListingDoc+"+ madeittoline,docId]);
//      //Title Section
//      var paragraphHeading = docBody.getChild(0);
//      paragraphHeading.asParagraph().setText(doc.getName() + " Case Listing");
//      paragraphHeading.setAttributes(SDGStyles.styleHeading);
//      var paragraphNumCases = docBody.appendParagraph("Number of Cases: " + (cases.length));
//      paragraphNumCases.setAttributes(SDGStyles.styleNumCases)
//      
//      madeittoline ='220';
//      timestamp = Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "yyyy-MM-dd'T'HH:mm:ss z");
//      sh.appendRow([timestamp,"populateListingDoc+"+ madeittoline,docId]);
//      //Case Commands Section
//      var tableListingBttn = docBody.appendTable();
//      var rowAddBttn = tableListingBttn.appendTableRow();
//      var cellAddBttn = rowAddBttn.appendTableCell();
//      var paragraphAddBttn = cellAddBttn.getChild(0);
//      paragraphAddBttn.asParagraph().setText("✚ ADD CASE");
//      paragraphAddBttn.setLinkUrl(SDGSettings.index.getUrlByLinkName('CaseFormAddNew'));
//      paragraphAddBttn.setAttributes(SDGStyles.styleCommands);
//      
//      tableListingBttn.setColumnWidth(0, 220);
//      
//      madeittoline ='232';
//      timestamp = Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "yyyy-MM-dd'T'HH:mm:ss z");
//      sh.appendRow([timestamp,"populateListingDoc+"+ madeittoline,docId]);
//      //Case Listing
//      docBody.appendParagraph("Cases List");
//      docBody.appendParagraph("----------------------------------------------").setAttributes(SDGStyles.styleMandatoryTableData);
//      
//      madeittoline ='237';
//      timestamp = Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "yyyy-MM-dd'T'HH:mm:ss z");
//      sh.appendRow([timestamp,"populateListingDoc+"+ madeittoline,docId]);
//      for(var i=cases.length-1;i>=0;i--){	
//        
//        //Title
//        var paragraphIndividualCase = docBody.appendParagraph(""); 
//        if (cases[i][cols.detailCase.colLocation-1] == "" || cases[i][cols.detailCase.colLocation-1] == null) {
//          if (cases[i][cols.detailCase.colName-1] == "" || cases[i][cols.detailCase.colName-1] == null) {
//            paragraphIndividualCase.appendText("Case " + cases[i][cols.detailCase.colCaseId-1]);
//          } else {
//            paragraphIndividualCase.appendText("Case " + cases[i][cols.detailCase.colCaseId-1] + ": " + cases[i][cols.detailCase.colName-1]);
//          }
//        } else {
//          paragraphIndividualCase.appendText("Case " + cases[i][cols.detailCase.colCaseId-1] + ": " + cases[i][cols.detailCase.colLocation-1]);
//        }
//        paragraphIndividualCase.setLinkUrl(String(cases[i][cols.detailCase.colSummaryDocLink-1])); 
//        paragraphIndividualCase.setAttributes(SDGStyles.styleCaseListingHeading);
//        //Assigned To, Status, and Last Update Details	 
//        var tableMandatoryDetails = docBody.appendTable();
//        var rowStatusData = tableMandatoryDetails.appendTableRow();
//        var cellStatus = rowStatusData.appendTableCell();
//        var paragraphCellStatus = cellStatus.getChild(0);
//        var cellText = 'STATUS: ' + cases[i][cols.detailCase.colStatus-1]
//        var cellStyle = SDGStyles.styleMandatoryTableData;
//        
//        
//        var isCaseDeleted = cases[i][cols.detailCase.colIsDeleted -1];
//        
//        if (isCaseDeleted == 'Yes'){
//          cellText = cellText + ' - CASE DELETED';
//          cellStyle = SDGStyles.styleDeletedListItems;
//        }
//        
//        paragraphCellStatus.asParagraph().setText(cellText);
//        paragraphCellStatus.setAttributes(cellStyle);
//        
//        //paragraphCellStatus.asParagraph().setText('STATUS: ' + cases[i][cols.detailCase.colStatus-1]);
//        //paragraphCellStatus.setAttributes(SDGStyles.styleMandatoryTableData);
//        
//        var rowAssignedToData = tableMandatoryDetails.appendTableRow();
//        var cellAssignedToData = rowAssignedToData.appendTableCell();
//        var paragraphCellAssignedToData = cellAssignedToData.getChild(0);
//        paragraphCellAssignedToData.asParagraph().setText('ASSIGNED TO: ' + cases[i][cols.detailCase.colAssingedTo-1]);
//        paragraphCellAssignedToData.setAttributes(SDGStyles.styleMandatoryTableData);
//        
//        var rowUpdateData = tableMandatoryDetails.appendTableRow();
//        var cellLastUpdatedData = rowUpdateData.appendTableCell();
//        var paragraphCellAssignedTo = cellLastUpdatedData.getChild(0);
//        paragraphCellAssignedTo.asParagraph().setText('LAST UPDATED: ' + cases[i][cols.detailCase.colLastUpdated-1]);
//        paragraphCellAssignedTo.setAttributes(SDGStyles.styleListItems);
//        
//        tableMandatoryDetails.setColumnWidth(0, 250); //Sets the table width such that viewing is easier on Mobile.
//        
//        //Details
//        var listItemName = docBody.appendListItem("Name of Requester: " + cases[i][cols.detailCase.colName-1]);
//        listItemName.setAttributes(SDGStyles.styleListItems);
//        listItemName.setGlyphType(DocumentApp.GlyphType.BULLET);
//        var listItemLocation = docBody.appendListItem("Location: " + cases[i][cols.detailCase.colLocation-1]);
//        listItemLocation.setAttributes(SDGStyles.styleListItems);
//        listItemLocation.setGlyphType(DocumentApp.GlyphType.BULLET);
//        for(var j=cols.detailCase.colFormDataStart-1;j<cases[i].length;j++){
//          //docBody.appendParagraph(cases[i][j]);
//          var textToInsert = getPreEqualSign(cases[i][j]) + ": " + getPostEqualSign(cases[i][j]);
//          if (textToInsert.length > 2 && getPreEqualSign(cases[i][j])!= 'Case ID'){
//            var listItem = docBody.appendListItem(getPreEqualSign(cases[i][j]) + ": " + getPostEqualSign(cases[i][j]));
//            listItem.setAttributes(SDGStyles.styleListItems);
//            listItem.setGlyphType(DocumentApp.GlyphType.BULLET);
//          }
//        }
//        
//        madeittoline ='306';
//        //Add Case Commands
//        var tableCaseComm = docBody.appendTable();
//        // Append Edit Case Cell
//        var rowEditCommand = tableCaseComm.appendTableRow();
//        var cellEditCase = rowEditCommand.appendTableCell();
//        var paragraphEditCaseLink = cellEditCase.getChild(0);
//        paragraphEditCaseLink.asParagraph().setText("✎ EDIT CASE");
//        cellEditCase.setLinkUrl(String(cases[i][cols.detailCase.colEditCaseLink-1]));
//        paragraphEditCaseLink.setAttributes(SDGStyles.styleCommands);
//        
//        madeittoline ='317';
//        // Append Add Action Cell
//        var rowAddAction = tableCaseComm.appendTableRow();
//        var cellAddAction = rowAddAction.appendTableCell();
//        var paragraphAddActionLink = cellAddAction.getChild(0);
//        paragraphAddActionLink.asParagraph().setText("✚ ADD ACTION");
//        cellAddAction.setLinkUrl(String(cases[i][cols.detailCase.colAddActionLink-1]));
//        paragraphAddActionLink.setAttributes(SDGStyles.styleCommands);
//        
//        madeittoline ='326';
//        // Delete Case Cell
//        var rowDeleteCase = tableCaseComm.appendTableRow();
//        var cellDeleteCase = rowDeleteCase.appendTableCell();
//        var paragraphDelCaseLink = cellDeleteCase.getChild(0);
//        
//        if (cases[i][cols.detailCase.colIsDeleted-1] == 'No' ) {
//          paragraphDelCaseLink.asParagraph().setText("☒ DELETE CASE");
//        } else {
//          paragraphDelCaseLink.asParagraph().setText("☐ UNDELETE CASE");
//        }
//        cellDeleteCase.setLinkUrl(String(cases[i][cols.detailCase.colDeleteCaseLink-1]));
//        paragraphDelCaseLink.setAttributes(SDGStyles.styleCommands);
//        
//        tableCaseComm.setColumnWidth(0, 220);
//        
//        docBody.appendParagraph("----------------------------------------------").setAttributes(SDGStyles.styleMandatoryTableData);
//        
//      }
//      madeittoline ='343 - end of function';
//      timestamp = Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "yyyy-MM-dd'T'HH:mm:ss z");
//      sh.appendRow([timestamp,"populateListingDoc+"+ madeittoline,docId]);
//    }catch (err){
//      timestamp = Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "yyyy-MM-dd'T'HH:mm:ss z");
//      sh.appendRow([timestamp,"Error thrown here: populateListingDoc+"+ madeittoline,docId]);
//      SDGErrors.custom(" SDGDocuments.populateListingDoc error = " + err + " Timestamp: " 
//                       + Utilities.formatDate(new Date(), 
//        SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 
//          "yyyy-MM-dd'T'HH:mm:ss z") + "for listingdoc with docid: " + docId + " and criteria = " + criteria + 
//            "madeittoline = " + madeittoline);
//    }
//    
//  }
//  
//  
//  /**
//  * createCaseSummaryDoc - manages the process of creating a summary doc
//  * @param {string} caseId - the caseId
//  * @param {string} caseDetails - the whole row of data from the detailCase sheet
//  */
//  function createCaseSummaryDoc(caseId){
//    try{
//      var sheetName = SDGSettings.spreadsheet.sheetNameDetailCase;//The name of the sheet where the index data will be stored
//      var caseDetails = SDGData.getRowData(caseId,sheetName,'1');
//      var cols = SDGSettings.sheetInfo.detailCase;
//      
//      var docSummaryId = caseDetails[cols.colSummaryDocId-1];
//      //check if document is valid
//      var isDocSummaryValid = SDGSettings.validation.validateThisId('CaseSummary_'+caseId,docSummaryId);
//      if (isDocSummaryValid == false){
//        docSummaryId = createSummaryDocument(caseId)
//      }
//      setFilePermission(docSummaryId);
//      populateSummaryDoc(docSummaryId,caseDetails);
//      var summaryDocDetails = {};
//      summaryDocDetails.url = DriveApp.getFileById(docSummaryId).getUrl();
//      summaryDocDetails.id = docSummaryId;
//      
//      return summaryDocDetails;
//    }
//    catch (err){
//      SDGErrors.custom('SDGDocuments.createCaseSummaryDoc caseId='+ caseId +' Error message = ' + err); 
//    }
//  }
//  /**
//  * populateSummaryDoc - populates the summary doc
//  * @param {string} documentId - the summary document Id
//  * @param {string} caseDetails - the whole row of data from the detailCase sheet
//  */
//  function populateSummaryDoc(documentId, caseDetails){
//    var Id = caseDetails[0];
//    var sheetName = SDGSettings.spreadsheet.sheetNameDetailAction;
//    //Case/Action Details
//    var cols = SDGSettings.sheetInfo;
//    
//    var actionDetails = SDGData.getMatchingRows(Id,sheetName,cols.detailAction.colCaseId);
//    
//    var doc = DocumentApp.openById(documentId);
//    var docBody = doc.getBody()//clear the documents content
//    docBody.appendParagraph('')
//    while (docBody.getNumChildren() > 1) docBody.removeChild( docBody.getChild( 0 ) ); //empties document
//    
//    //Title Section
//    var paragraphHeading = docBody.getChild(0);	
//    if (caseDetails[cols.detailCase.colLocation-1] == "" || caseDetails[cols.detailCase.colLocation-1] == null) {
//      if (caseDetails[cols.detailCase.colName-1] == "" || caseDetails[cols.detailCase.colName-1] == null) {
//        paragraphHeading.asParagraph().setText("Case " + caseDetails[cols.detailCase.colCaseId-1]);
//      } else {
//        paragraphHeading.asParagraph().setText("Case " + caseDetails[cols.detailCase.colCaseId-1] + ": " + caseDetails[cols.detailCase.colName-1]);
//      }
//    } else {
//      
//      paragraphHeading.asParagraph().setText("Case " + caseDetails[cols.detailCase.colCaseId-1] + ": " + caseDetails[cols.detailCase.colLocation-1]);
//    }
//    paragraphHeading.setAttributes(SDGStyles.styleHeading);	
//    
//    //Assigned To, Status, and Last Update Details		 
//    var tableMandatoryDetails = docBody.appendTable();
//    
//    var rowStatusData = tableMandatoryDetails.appendTableRow();
//    var cellStatus = rowStatusData.appendTableCell();
//    var paragraphCellStatus = cellStatus.getChild(0);
//    paragraphCellStatus.asParagraph().setText('STATUS: ' + caseDetails[cols.detailCase.colStatus-1]);
//    
//    paragraphCellStatus.setAttributes(SDGStyles.styleMandatoryTableData);
//    
//    var rowAssignedToData = tableMandatoryDetails.appendTableRow();
//    var cellAssignedToData = rowAssignedToData.appendTableCell();
//    var paragraphCellAssignedToData = cellAssignedToData.getChild(0);
//    paragraphCellAssignedToData.asParagraph().setText('ASSIGNED TO: ' + caseDetails[cols.detailCase.colAssingedTo-1]);
//    paragraphCellAssignedToData.setAttributes(SDGStyles.styleListItems);
//    
//    var rowUpdateData = tableMandatoryDetails.appendTableRow();
//    var cellLastUpdatedData = rowUpdateData.appendTableCell();
//    var paragraphCellAssignedTo = cellLastUpdatedData.getChild(0);
//    paragraphCellAssignedTo.asParagraph().setText('LAST UPDATED: ' + caseDetails[cols.detailCase.colLastUpdated-1]);
//    paragraphCellAssignedTo.setAttributes(SDGStyles.styleListItems);
//    
//    var isCaseDeleted = caseDetails[cols.detailCase.colIsDeleted -1];  
//    if (isCaseDeleted == 'Yes'){
//      var rowCaseDeleted = tableMandatoryDetails.appendTableRow();
//      var cellCaseDeleted = rowCaseDeleted.appendTableCell();
//      var paragraphCellCaseDeleted = cellCaseDeleted.getChild(0);
//      paragraphCellCaseDeleted.asParagraph().setText('☒ CASE DELETED');
//      paragraphCellCaseDeleted.setAttributes(SDGStyles.styleDeletedListItems);
//    }
//    
//    tableMandatoryDetails.setColumnWidth(0, 250); //Sets the table width such that viewing is easier on Mobile.
//    
//    var uselessParagraph = docBody.getChild(docBody.getChildIndex(tableMandatoryDetails)+1); //store auto-incremented paragraph that needs to be deleted
//    
//    //Case Details
//    var listItemName = docBody.appendListItem("Name of Requester: " + caseDetails[cols.detailCase.colName-1]);
//    listItemName.setAttributes(SDGStyles.styleListItems);
//    listItemName.setGlyphType(DocumentApp.GlyphType.BULLET);
//    var listItemLocation = docBody.appendListItem("Location: " + caseDetails[cols.detailCase.colLocation-1]);
//    listItemLocation.setAttributes(SDGStyles.styleListItems);
//    listItemLocation.setGlyphType(DocumentApp.GlyphType.BULLET);
//    for(var i=cols.detailCase.colFormDataStart-1;i<caseDetails.length;i++){
//      var textToInsert = getPreEqualSign(caseDetails[i]) + ": " + getPostEqualSign(caseDetails[i]);
//      if (textToInsert.length > 2 && getPreEqualSign(caseDetails[i])!= 'Case ID'){
//        var listItem = docBody.appendListItem(getPreEqualSign(caseDetails[i]) + ": " + getPostEqualSign(caseDetails[i]));
//        listItem.setAttributes(SDGStyles.styleListItems);
//        listItem.setGlyphType(DocumentApp.GlyphType.BULLET);
//      }
//    }
//    
//    // Delete Useless paragraph now that it is no longer the last paragraph on the screen
//    docBody.removeChild(uselessParagraph);
//    
//    //Case Commands Section
//    var tableCaseComm = docBody.appendTable();
//    // Append Edit Case Cell
//    var rowEditCommand = tableCaseComm.appendTableRow();
//    var cellEditCase = rowEditCommand.appendTableCell();
//    var paragraphEditCaseLink = cellEditCase.getChild(0);
//    paragraphEditCaseLink.asParagraph().setText("✎ EDIT CASE");
//    cellEditCase.setLinkUrl(String(caseDetails[cols.detailCase.colEditCaseLink-1]));
//    paragraphEditCaseLink.setAttributes(SDGStyles.styleCommands);
//    // Append Add Action Cell
//    var rowAddAction = tableCaseComm.appendTableRow();
//    var cellAddAction = rowAddAction.appendTableCell();
//    var paragraphAddActionLink = cellAddAction.getChild(0);
//    paragraphAddActionLink.asParagraph().setText("✚ ADD ACTION");
//    cellAddAction.setLinkUrl(String(caseDetails[cols.detailCase.colAddActionLink-1]));
//    paragraphAddActionLink.setAttributes(SDGStyles.styleCommands);
//    // Append Delete or UnDelete Case Cell
//    var rowDeleteCase = tableCaseComm.appendTableRow();
//    var cellDeleteCase = rowDeleteCase.appendTableCell();
//    var paragraphDelCaseLink = cellDeleteCase.getChild(0);	//@@@@@@@@@@@@@@@@@@@@@@@@ - BEGIN DELETE-CASE BUTTON OF CASE SUMMARY - @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//    if (caseDetails[cols.detailCase.colIsDeleted-1] == 'No' ) {
//      paragraphDelCaseLink.asParagraph().setText("☒ DELETE CASE");
//    } else {
//      paragraphDelCaseLink.asParagraph().setText("☐ UNDELETE CASE");
//    }
//    cellDeleteCase.setLinkUrl(String(caseDetails[cols.detailCase.colDeleteCaseLink-1]));
//    paragraphDelCaseLink.setAttributes(SDGStyles.styleCommands);	//@@@@@@@@@@@@@@@@@@@@@@@@ - END DELETE-CASE BUTTON OF CASE SUMMARY - @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//    
//    tableCaseComm.setColumnWidth(0, 220); //Sets the table width such that viewing is easier on Mobile.	//@@@@@@@@@@@@@@@@@@@@@@@@ - END CHANGE ORDER OF CASE SUMMARY - @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 
//    
//    //Action Section Heading
//    
//    docBody.appendParagraph("Actions ").setAttributes(SDGStyles.styleActionHeading);
//    docBody.appendParagraph("----------------------------------------------").setAttributes(SDGStyles.styleMandatoryTableData);
//    //Action Listing
//    for(var i = actionDetails.length-1;i>=0;i--){
//      var isActionDeleted = actionDetails[i][cols.detailAction.colIsDeleted-1];  
//      if (isActionDeleted == 'Yes'){
//        //Then do not show anything 
//        //        var paragraphActionDeleted = docBody.appendParagraph('☒ ACTION DELETED');
//        //        paragraphActionDeleted.setAttributes(SDGStyles.styleDeletedListItems);
//        //        var paragraphDeleteActionLink = docBody.appendParagraph('☐ UNDELETE ACTION').setAttributes(SDGStyles.styleCommands);
//      }else
//      {
//        //Action Information
//        
//        //Action Section Heading
//        var paragraphActionHeading = docBody.appendParagraph("Action Taken: " + getPostEqualSign(actionDetails[i][cols.detailAction.colFormDataStart-1]));
//        paragraphActionHeading.setAttributes(SDGStyles.styleActionHeading);
//        
//        var paragraphActionUpdate = docBody.appendParagraph("Last Update on: " + actionDetails[i][cols.detailAction.colLastUpdated-1]);
//        paragraphActionUpdate.setAttributes(SDGStyles.styleListItems);
//        
//        //Action Details Section	
//        for(var j=cols.detailAction.colFormDataStart-1;j<actionDetails[i].length;j++){
//          var textToInsert = getPreEqualSign(actionDetails[i][j]) + ": " + getPostEqualSign(actionDetails[i][j]);
//          if (textToInsert.length > 2 && getPreEqualSign(actionDetails[i][j])!= 'Action ID' && getPreEqualSign(actionDetails[i][j])!= 'Case ID'){
//            var listActionItem = docBody.appendListItem(getPreEqualSign(actionDetails[i][j]) + ": " + getPostEqualSign(actionDetails[i][j]));
//            listActionItem.setAttributes(SDGStyles.styleListItems);
//            listActionItem.setGlyphType(DocumentApp.GlyphType.HOLLOW_BULLET);
//          }
//        }
//        
//        //Action Commands Section
//        var tableActionComm = docBody.appendTable();
//        var rowEditAction = tableActionComm.appendTableRow();
//        // --Append Edit Action Cell
//        var cellEditAction = rowEditAction.appendTableCell();
//        var paragraphEditActionLink = cellEditAction.getChild(0);
//        paragraphEditActionLink.asParagraph().setText("✎ EDIT ACTION");
//        paragraphEditActionLink.setLinkUrl(String(actionDetails[i][cols.detailAction.colEditActionLink-1]));
//        paragraphEditActionLink.setAttributes(SDGStyles.styleCommands);
//        // --Append Delete Cell
//        var rowDeleteAction = tableActionComm.appendTableRow();
//        var cellDeleteAction = rowDeleteAction.appendTableCell();
//        var paragraphDeleteActionLink = cellDeleteAction.getChild(0);		
//        paragraphDeleteActionLink.asParagraph().setText("☒ DELETE ACTION");
//        
//        paragraphDeleteActionLink.setLinkUrl(String(actionDetails[i][cols.detailAction.colDeleteActionLink-1]));
//        paragraphDeleteActionLink.setAttributes(SDGStyles.styleCommands);	
//        
//        tableActionComm.setColumnWidth(0, 220); //Sets the table width such that viewing is easier on Mobile.
//        docBody.appendParagraph("----------------------------------------------").setAttributes(SDGStyles.styleMandatoryTableData);
//        
//      }
//      
//    }
//    
//  }
//  /**
//  * filterCases - filters cases
//  * @param {string} cases - rows of data from detailCase
//  * @param {object} criteria - an object containing the filter criteria
//  */
//  function filterCases(cases, criteria){
//    var cols = SDGSettings.sheetInfo.detailCase;
//    var passedCases = [];
//    var hasPassed = true;
//    
//    for (i=1;i<cases.length;i++){
//      //check criteria
//      //assignedTo
//      if (criteria.assignedTo == 'All' || criteria.assignedTo == cases[i][cols.colAssingedTo-1]){
//        //pass 
//      }else{
//        hasPassed = false;
//      }
//      //status
//      if (criteria.status == 'All' || criteria.status == cases[i][cols.colStatus-1]){
//        //pass 
//      }else{
//        hasPassed = false;
//      }
//
//      if (criteria.isDeleted == 'All' || criteria.isDeleted == cases[i][cols.colIsDeleted-1]){
//        //pass 
//      }else{
//        hasPassed = false;
//      }
//      
//      
//      
//      
//      //dateStart***Not Currently Supported this column is not in the detailCase sheet
//      
//      //dateEnd***Not Currently Supported this column is not in the detailCase sheet
//      
//      //lastUpdatedStart
//      if (criteria.lastUpdatedStart == 'All' || criteria.lastUpdatedStart <= cases[i][cols.colLastUpdated-1].substring(0,10)){
//        //pass status
//      }else{
//        hasPassed = false;
//      } 
//      
//      //lastUpdatedEnd
//      if (criteria.lastUpdatedEnd == 'All' || criteria.lastUpdatedEnd >= cases[i][cols.colLastUpdated-1].substring(0,10)){
//        //pass status
//      }else{
//        hasPassed = false;
//      }
//      
//      //check hasPassed
//      if (hasPassed == true){
//        passedCases.push(cases[i]); 
//      }
//      hasPassed = true;
//    }
//    return passedCases;
//  }
//  //*****Event Functions*****
//  
//  //*****Private Helper Functions***** 
//  
//  
//  
//  
//  
//  /**
//  * createSummaryDocument - creates the summary document
//  * @param {string} caseId - the caseId
//  */
//  function createSummaryDocument(caseId){
//    var docSummary = DocumentApp.create('CaseSummary_'+caseId);
//    var docSummaryId = docSummary.getId();
//    var file = DriveApp.getFileById(docSummaryId);
//    
//    var folderId = SDGSettings.index.getIdByLinkName('DocumentsFolder');
//    var folder = DriveApp.getFolderById(folderId);
//    folder.addFile(file); //add new parent folder to file
//    DriveApp.getRootFolder().removeFile(file);//remove the root folder as a parent to the file
//    //Udpate detailCase
//    updateSummaryDocLink(caseId, file.getUrl(), file.getId());
//    return docSummaryId;
//  }
//  /**
//  * updateSummaryDocLink - updates the detailCase Sheet with the summary doc link and id
//  * @param {string} caseId - the caseId
//  * @param {string} url - the url
//  * @param {string} summaryDocId - the summary document Id
//  */
//  function updateSummaryDocLink(caseId, url, summaryDocId){
//    var sheetName = SDGSettings.spreadsheet.sheetNameDetailCase;
//    var ss = SpreadsheetApp.getActiveSpreadsheet()   //Open the Spreadsheet
//    var sh = ss.getSheetByName(sheetName); // gets the sheet
//    var cols = SDGSettings.sheetInfo.detailCase;
//    var colNumCaseId = cols.colCaseId;//1;
//    var colNumLinkSummaryDoc = cols.colSummaryDocLink;//6;
//    var colNumIdSummaryDoc = cols.colSummaryDocId;// 7;
//    var colNumLastUpdated = cols.colLastUpdated//8;
//    var rangeValues = sh.getDataRange().getValues();
//    var bolExists = false;
//    var matchingRowNum;
//    //Get the Row Number
//    for (j=0; j<rangeValues.length; j++){ //Go through the existing ID values
//      if (rangeValues[j][colNumCaseId-1] == caseId){
//        bolExists = true;
//        matchingRowNum = j+1;
//        break;
//      }
//    }
//    var lastUpdated = Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "yyyy-MM-dd'T'HH:mm:ss z");
//    if (bolExists == true){
//      sh.getRange(matchingRowNum, colNumLinkSummaryDoc).setValue(url);
//      sh.getRange(matchingRowNum, colNumIdSummaryDoc).setValue(summaryDocId);
//      sh.getRange(matchingRowNum, colNumLastUpdated).setValue(lastUpdated); 
//    }
//    if (bolExists == false){
//      SDGErrors.custom('Could not find the caseId:' + caseId + ' on the detailCase Sheet');
//    }
//  }
//  
//  /**
//  * getPostEqualSign - Takes in a String with an "= " somewhere inside and extracts only the string variables preceding it
//  * @param {value} value - The components of the cell within the array being passed into the function.
//  */  
//  function getPreEqualSign(str){
//    var strCell = String(str);
//    
//    var indxEnd = strCell.indexOf('= ');
//    if(indxEnd>=0){
//      var strPreEqual = strCell.substring(0, indxEnd);
//    } else{
//      var indexNewEnd = strCell.indexOf('=');
//      var strPreEqual = strCell.substring(0, indexNewEnd);
//    }
//    return strPreEqual;
//  }
//  
//  /**
//  * getPostEqualSign - Takes in a String with an "= " somewhere inside and extracts only the string variables following it
//  * @param {value} value - The components of the cell within the array being passed into the function.
//  */
//  function getPostEqualSign(str){
//    var strCell = String(str);
//    
//    var indxStart = strCell.indexOf('= ');
//    if(indxStart>=0){ 
//      var strPostEqual = strCell.substring(indxStart+2);
//    } else{
//      return "";
//    }
//    
//    return strPostEqual;
//  }
//  
//})();
