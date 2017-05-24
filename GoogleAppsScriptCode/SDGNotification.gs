var SDGNotification = (function () {
  var SDGNotification = {};
  SDGNotification.sendCaseInfoToAssignedTo = sendCaseInfoToAssignedTo;
  SDGNotification.sendCustomServiceLinks = sendCustomServiceLinks;
  return SDGNotification;
  //***Public Functions***
  
  /**
  * sendAssignedToLinks - sends an email with the add case and all cases links
  * @param {string} email - the email to send the links to
  */
  function sendCustomServiceLinks (email){
     var linkToWebApp  = ScriptApp.getService().getUrl();
     var param_isdeleted = "isdeleted=No";
     var param_assignedto = "assignedto=";
     var param_status = "status=Open";
    
    var linkToAddCase = SDGSettings.index.getUrlByLinkName('CaseFormAddNew');
    //var linkToAllCases = SDGSettings.index.getUrlByLinkName('Cases - All'); 
    var assignedToInfo = getAssignedToInfoFromEmail(email);
    var emailTo = email;
    var subject = "Customer Service Links - Add Cases and All Cases ";
    var bodyText = "";
    
    bodyText = bodyText +"Customer Service Program Links. These links can be saved as home screen or desktop shortcuts." ;
    bodyText = bodyText +"<br><br>"+ "<a href='" + linkToAddCase + "'>Add Case </a>" ;
    
    if (assignedToInfo.length == 0){
      bodyText = bodyText + "<br><br> Cases can not currently be assigned to this email address:" + email; 
    }
    //loop through links
    assignedToInfo.forEach(function (info){
      bodyText = bodyText +"<br><br>"+ "<a href='" + linkToWebApp + "?" + param_assignedto + info.name + "&" + param_isdeleted  + "&" + param_status + "'>View All Open Cases for " + info.name +" </a>" ;  
    });
    
    bodyText = bodyText +"<br><br>"+ "<a href='" + linkToWebApp + "?" + param_isdeleted  + "'>View All Cases</a>" ;
    
    
    MailApp.sendEmail({
      to: emailTo,
      subject: subject,
      htmlBody: bodyText
    } );
  }
  
  
  
  
  
  /**
  * sendCaseInfoToAssignedTo - sends an email with the case info to the user
  * @param {string} caseId - the case Id
  */
  function sendCaseInfoToAssignedTo (caseId){
    var linkToWebApp  = ScriptApp.getService().getUrl();
     var param_isdeleted = "isdeleted=No";
     var param_assignedto = "assignedto=";
     var param_status = "status=Open";
    var param_search = "search=";
    var param_caseid = "caseid=";
    
    var cols = SDGSettings.sheetInfo.detailCase;
    var colsLAT = SDGSettings.sheetInfo.listAssignCase;
    var caseDetails = SDGData.getRowData(caseId,SDGSettings.spreadsheet.sheetNameDetailCase,cols.colCaseId);
    var assignedTo = caseDetails[cols.colAssingedTo-1];
    var caseEditLink = caseDetails[cols.colEditCaseLink-1];
    var addActionLink = caseDetails[cols.colAddActionLink-1];
    //var summaryDocLink = caseDetails[cols.colSummaryDocLink-1];
    //var listingDocLink = SDGSettings.index.getUrlByLinkName("Cases - " + assignedTo);
    var emailTo = getAssignedToEmailAddress(caseDetails[cols.colAssingedTo-1]);
    var subject = "Case " + caseId;
    var bodyText = "";
    var location = caseDetails[cols.colLocation-1];
    var name = caseDetails[cols.colName-1];
    
    if (location !== "" || location !== undefined ){
     subject = subject + " - " + location; 
    }
    else
    {
      if (name !=="" || name !== undefined){
        subject = subject + " - " + name;
      }
    }
    
    bodyText = bodyText + "Case Details";
    for (var i=cols.colFormDataStart-1; i<caseDetails.length;i++){
     bodyText = bodyText + '<br>' + caseDetails[i];
    }
    
    bodyText = bodyText +"<br><br>"+ "<a href='" + addActionLink + "'>Add Action</a>" ;
    bodyText = bodyText +"<br><br>"+ "<a href='" +  linkToWebApp + "?" + param_caseid + caseId + "&" + param_isdeleted  + "&" + param_status + "'>View Case</a>" ;
    bodyText = bodyText +"<br><br>"+ "<a href='" + caseEditLink + "'>Edit Case</a>" ;
    bodyText = bodyText +"<br><br>"+ "<a href='" +  linkToWebApp + "?" + param_assignedto + assignedTo + "&" + param_isdeleted  + "&" + param_status + "'>View All Cases Assigned To " +assignedTo +"</a>" ;
    
    MailApp.sendEmail({
      to: emailTo,
      subject: subject,
      htmlBody: bodyText
    } );

  }
  
  //Private Functions
  function getAssignedToEmailAddress(assignedToName){
    var sheetName = SDGSettings.spreadsheet.sheetNameListAssignCase;
    var ss = SpreadsheetApp.getActiveSpreadsheet();  
    var sh = ss.getSheetByName(sheetName);
    var cols = SDGSettings.sheetInfo.listAssignCase;
    var values = sh.getDataRange().getValues();
    var email;
    for (var j=1; j<values.length; j++){ 
      var assignedToRowValue = values[j][cols.colName-1];
      
      if (assignedToRowValue == assignedToName){
        return values[j][cols.colEmail-1];
      }
      
    }
  }
  function getAssignedToInfoFromEmail(email){
    
    var sheetName = SDGSettings.spreadsheet.sheetNameListAssignCase;
    var ss = SpreadsheetApp.getActiveSpreadsheet();  
    var sh = ss.getSheetByName(sheetName);
    var cols = SDGSettings.sheetInfo.listAssignCase;
    var values = sh.getDataRange().getValues();
    var assignedTo;
    var info = [];
    
    for (var j=1; j<values.length; j++){      
      if (email == values[j][cols.colEmail-1]){
        info.push({//link: SDGSettings.index.getUrlByLinkName("Cases - " + values[j][cols.colName-1]),
                   name: values[j][cols.colName-1]
                  });
      }      
    }
    
    return info;
  }
})();