
var SDGStyles = (function() {
  var SDGStyles = {};
  SDGStyles.styleHeading = {};
  SDGStyles.styleHeading[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = 
    DocumentApp.HorizontalAlignment.CENTER;
  SDGStyles.styleHeading[DocumentApp.Attribute.FONT_FAMILY] = 'Helvetica Neue';
  SDGStyles.styleHeading[DocumentApp.Attribute.FONT_SIZE] = 20;
  SDGStyles.styleHeading[DocumentApp.Attribute.BOLD] = true;
  SDGStyles.styleHeading[DocumentApp.Attribute.UNDERLINE] = true;
  SDGStyles.styleHeading[DocumentApp.Attribute.ITALIC] = false;
   SDGStyles.styleHeading[DocumentApp.Attribute.FOREGROUND_COLOR] = "#000000";
  
  SDGStyles.styleCommands = {};
  SDGStyles.styleCommands[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] =
    DocumentApp.HorizontalAlignment.CENTER;
  SDGStyles.styleCommands[DocumentApp.Attribute.FONT_FAMILY] = 'Helvetica Neue';
  SDGStyles.styleCommands[DocumentApp.Attribute.FONT_SIZE] = 14;
  SDGStyles.styleCommands[DocumentApp.Attribute.BOLD] = false;
  SDGStyles.styleCommands[DocumentApp.Attribute.UNDERLINE] = false;
  SDGStyles.styleCommands[DocumentApp.Attribute.ITALIC] = false;
   SDGStyles.styleCommands[DocumentApp.Attribute.FOREGROUND_COLOR] = "#0000EE";
  
  SDGStyles.styleListItems = {};
  SDGStyles.styleListItems[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] =
    DocumentApp.HorizontalAlignment.LEFT;
  SDGStyles.styleListItems[DocumentApp.Attribute.FONT_FAMILY] = 'Helvetica Neue';
  SDGStyles.styleListItems[DocumentApp.Attribute.FONT_SIZE] = 12;
  SDGStyles.styleListItems[DocumentApp.Attribute.BOLD] = false;
  SDGStyles.styleListItems[DocumentApp.Attribute.UNDERLINE] = false;
  SDGStyles.styleListItems[DocumentApp.Attribute.ITALIC] = false;
   SDGStyles.styleListItems[DocumentApp.Attribute.FOREGROUND_COLOR] = '#000000';
  
  SDGStyles.styleDeletedListItems = {};
  SDGStyles.styleDeletedListItems[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] =
    DocumentApp.HorizontalAlignment.LEFT;
  SDGStyles.styleDeletedListItems[DocumentApp.Attribute.FONT_FAMILY] = 'Helvetica Neue';
  SDGStyles.styleDeletedListItems[DocumentApp.Attribute.FONT_SIZE] = 14;
  SDGStyles.styleDeletedListItems[DocumentApp.Attribute.BOLD] = true;
  SDGStyles.styleDeletedListItems[DocumentApp.Attribute.UNDERLINE] = false;
  SDGStyles.styleDeletedListItems[DocumentApp.Attribute.ITALIC] = false;
  SDGStyles.styleDeletedListItems[DocumentApp.Attribute.FOREGROUND_COLOR] = '#ff0000';
  
  SDGStyles.styleMandatoryTableHeader = {};
  SDGStyles.styleMandatoryTableHeader[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] =
    DocumentApp.HorizontalAlignment.LEFT;
  SDGStyles.styleMandatoryTableHeader[DocumentApp.Attribute.FONT_FAMILY] = 'Helvetica Neue';
  SDGStyles.styleMandatoryTableHeader[DocumentApp.Attribute.FONT_SIZE] = 14;
  SDGStyles.styleMandatoryTableHeader[DocumentApp.Attribute.BOLD] = false;
  SDGStyles.styleMandatoryTableHeader[DocumentApp.Attribute.UNDERLINE] = true;
  SDGStyles.styleMandatoryTableHeader[DocumentApp.Attribute.ITALIC] = false;
   SDGStyles.styleMandatoryTableHeader[DocumentApp.Attribute.FOREGROUND_COLOR] = '#000000';
  
  SDGStyles.styleMandatoryTableData = {};
  SDGStyles.styleMandatoryTableData[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] =
    DocumentApp.HorizontalAlignment.LEFT;
  SDGStyles.styleMandatoryTableData[DocumentApp.Attribute.FONT_FAMILY] = 'Helvetica Neue';
  SDGStyles.styleMandatoryTableData[DocumentApp.Attribute.FONT_SIZE] = 14;
  SDGStyles.styleMandatoryTableData[DocumentApp.Attribute.BOLD] = false;
  SDGStyles.styleMandatoryTableData[DocumentApp.Attribute.UNDERLINE] = false;
  SDGStyles.styleMandatoryTableData[DocumentApp.Attribute.ITALIC] = false;
   SDGStyles.styleMandatoryTableData[DocumentApp.Attribute.FOREGROUND_COLOR] = '#000000';
  
  SDGStyles.styleActionHeading = {};
  SDGStyles.styleActionHeading[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] =
    DocumentApp.HorizontalAlignment.Left;
  SDGStyles.styleActionHeading[DocumentApp.Attribute.FONT_FAMILY] = 'Calibri';
  SDGStyles.styleActionHeading[DocumentApp.Attribute.FONT_SIZE] = 16;
  SDGStyles.styleActionHeading[DocumentApp.Attribute.UNDERLINE] = true;
  SDGStyles.styleActionHeading[DocumentApp.Attribute.BOLD] = true;
  SDGStyles.styleActionHeading[DocumentApp.Attribute.ITALIC] = false;
   SDGStyles.styleActionHeading[DocumentApp.Attribute.FOREGROUND_COLOR] = '#000000';
  
  SDGStyles.styleUpdateHeading= {};
  SDGStyles.styleUpdateHeading[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] =
    DocumentApp.HorizontalAlignment.Right;
  SDGStyles.styleUpdateHeading[DocumentApp.Attribute.FONT_FAMILY] = 'Calibri';
  SDGStyles.styleUpdateHeading[DocumentApp.Attribute.FONT_SIZE] = 14;
  SDGStyles.styleUpdateHeading[DocumentApp.Attribute.UNDERLINE] = false;
  SDGStyles.styleUpdateHeading[DocumentApp.Attribute.BOLD] = false;
  SDGStyles.styleUpdateHeading[DocumentApp.Attribute.ITALIC] = true;
   SDGStyles.styleUpdateHeading[DocumentApp.Attribute.FOREGROUND_COLOR] = '#ff0000';
  
    SDGStyles.styleCaseListingHeading = {};
  SDGStyles.styleCaseListingHeading[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] =
    DocumentApp.HorizontalAlignment.Left;
  SDGStyles.styleCaseListingHeading[DocumentApp.Attribute.FONT_FAMILY] = 'Helvetica Neue';
  SDGStyles.styleCaseListingHeading[DocumentApp.Attribute.FONT_SIZE] = 16;
  SDGStyles.styleCaseListingHeading[DocumentApp.Attribute.UNDERLINE] = true;
  SDGStyles.styleCaseListingHeading[DocumentApp.Attribute.BOLD] = true;
  SDGStyles.styleCaseListingHeading[DocumentApp.Attribute.ITALIC] = false;
   SDGStyles.styleCaseListingHeading[DocumentApp.Attribute.FOREGROUND_COLOR] = '#0000EE';
  
  SDGStyles.styleNumCases = {};
  SDGStyles.styleNumCases[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] =
    DocumentApp.HorizontalAlignment.LEFT;
  SDGStyles.styleNumCases[DocumentApp.Attribute.FONT_FAMILY] = 'Helvetica Neue';
  SDGStyles.styleNumCases[DocumentApp.Attribute.FONT_SIZE] = 16;
  SDGStyles.styleNumCases[DocumentApp.Attribute.BOLD] = false;
  SDGStyles.styleNumCases[DocumentApp.Attribute.UNDERLINE] = false;
  SDGStyles.styleNumCases[DocumentApp.Attribute.ITALIC] = true;
   SDGStyles.styleNumCases[DocumentApp.Attribute.FOREGROUND_COLOR] = '#000000';
  
  SDGStyles.styleNewCaseBttn = {};
  SDGStyles.styleNewCaseBttn[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] =
    DocumentApp.HorizontalAlignment.RIGHT;
  SDGStyles.styleNewCaseBttn[DocumentApp.Attribute.FONT_FAMILY] = 'Helvetica Neue';
  SDGStyles.styleNewCaseBttn[DocumentApp.Attribute.FONT_SIZE] = 16;
  SDGStyles.styleNewCaseBttn[DocumentApp.Attribute.BOLD] = false;
  SDGStyles.styleNewCaseBttn[DocumentApp.Attribute.UNDERLINE] = false;
  SDGStyles.styleNewCaseBttn[DocumentApp.Attribute.ITALIC] = true;
   SDGStyles.styleNewCaseBttn[DocumentApp.Attribute.FOREGROUND_COLOR] = "#000000";
  
  SDGStyles.styleCaseDeleted = {};
  SDGStyles.styleCaseDeleted[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] =
    DocumentApp.HorizontalAlignment.Right;
  SDGStyles.styleCaseDeleted[DocumentApp.Attribute.FONT_FAMILY] = 'Calibri';
  SDGStyles.styleCaseDeleted[DocumentApp.Attribute.FONT_SIZE] = 14;
  SDGStyles.styleCaseDeleted[DocumentApp.Attribute.UNDERLINE] = false;
  SDGStyles.styleCaseDeleted[DocumentApp.Attribute.BOLD] = false;
  SDGStyles.styleCaseDeleted[DocumentApp.Attribute.ITALIC] = true;
  SDGStyles.styleCaseDeleted[DocumentApp.Attribute.BACKGROUND_COLOR] = "#ff0000";
  
  return SDGStyles;
})();
