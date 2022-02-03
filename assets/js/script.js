var telForm = document.getElementById("phone-form"),
    telInput = document.getElementById("phone"),
    formMessage = document.getElementById("form-message");

// form handler

var searchForm = function(event){
    event.preventDefault();
    formMessage.textContent = "Please enter a number using only numerals (0-9)"
    formMessage.style = "color:black";
    var phoneNumber = telInput.value;
    
    //check if phone number is a number and if the length is from 6-15 digits
    if(isNaN(phoneNumber)){
        formMessage.textContent = "Please use only numerals in your phone number.";
        formMessage.style = "color:red";
        return null;
    }
    if(phoneNumber.length < 6 || phoneNumber.length > 15){
        formMessage.textContent = "Invalid telephone number length.";
        formMessage.style = "color:red";
        return null;
    }

}

//event listener
telForm.addEventListener("submit",searchForm);