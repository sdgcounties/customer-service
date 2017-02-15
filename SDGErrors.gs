var SDGErrors = (function () {
  var errors = {};
  errors.namespaceName = 'SDGErrors';
  errors.administratorEmail = 'customerserviceadmin@disposeamail.com';
  errors.custom = custom;  
  return errors;
  //***Public Functions***
  /**
  * custom - generates a custom error
  * @param {string} errmessage - the error message
  */
  function custom (errmessage){
    Logger.log(errmessage);
    MailApp.sendEmail(errors.administratorEmail, 'error - custom: ', errmessage );
    //Add to Error Log
    //throw new Error(errmessage);
  }
})();
