var telForm = document.getElementById("phone-form"),
    telInput = document.getElementById("phone"),
    formMessage = document.getElementById("form-message");

// form handler

var searchForm = function(event){
    event.preventDefault();
    formMessage.textContent = "Searching..."
    formMessage.style = "color:black";
    var phoneNumber = telInput.value.trim();
    
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

    //call tel api
    var apiUrl = "https://phonevalidation.abstractapi.com/v1/?api_key=" + apiKey + "&phone=" + phoneNumber;

    fetch(apiUrl).then(function(response){
        response.json().then(function(data){
            console.log(data);
        });
    }).catch(function(error){
        formMessage.textContent = "Connection error!";
        formMessage.style = "color:red";
    });
}

//event listener
telForm.addEventListener("submit",searchForm);