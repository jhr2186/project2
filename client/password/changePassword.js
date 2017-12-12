const passwordChange = (e) => {
  e.preventDefault();
  
  $("#domoMessage").animate({width:'hide'}, 350);
  
  if($("#newpass").val() == '' || $("#newpass2").val() == '') {
    handleError("All fields must have a value");
    return false;
  }
  
  if($("#pass").val() !== $("#pass2").val()) {
    handleError("Passwords do not match!");
    return false;
  }
  
  sendAjax('POST', $("#passwordForm").attr("action"), $("#passwordForm").serialize(), redirect);
  
  return false;
};

const PasswordForm = (props) => {
  return (
    <form id="passwordForm" 
          name="passwordForm"
          onSubmit={passwordChange}
          action="/changePass"
          method="POST"
          className="passwordForm"
      >
      <label htmlFor="pass">Password: </label>
      <input id="newpass" type="password" name="pass" placeholder="new password"/>
      <label htmlFor="pass2">Password: </label>
      <input id="newpass2" type="password" name="pass2" placeholder="retype password"/>
      <input type="hidden" name="_csrf" value={props.csrf}/>
      <input className="changePasswordSubmit" type="submit" value="Change Password" />
    </form>
  );
};

const setup = (csrf) => {  
  ReactDOM.render(
    <PasswordForm csrf={csrf}/>,
    document.querySelector("#passwordChange")
  );
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});