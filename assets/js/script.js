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

    //call tel api 1
    var apiUrl = "https://phonevalidation.abstractapi.com/v1/?api_key=" + apiKeyTel1 + "&phone=" + phoneNumber;

    fetch(apiUrl).then(function(response){
        response.json().then(function(data){
            if(data.registered_location){
                //if api 1 returns the location, proceed, else try 2nd api
                var telValid = data.is_valid_number,
                    telCountry = data.country_code,
                    telPrefix = data.country_prefix,
                    telLocation = data.registered_location,
                    telType = data.line_type,
                    telCarrier = data.carrier;
                console.log("API1:" + telValid + telCountry + telPrefix + telLocation + telType + telCarrier);
                // createResultInfo(phoneNumber,telValid,telCountry,telPrefix,telLocation,telType,telCarrier);
            } else {
                //call tel api 2
                var apiUrl2 = "http://apilayer.net/api/validate?access_key=" + apiKeyTel2 + "&number=" + phoneNumber;
                fetch(apiUrl2).then(function(response2){
                    response2.json().then(function(data2){
                        var telValid = data2.valid,
                            telCountry = data2.country_code,
                            telPrefix = data2.country_prefix,
                            telLocation = data2.telLocation,
                            telType = data2.line_type,
                            telCarrier = data2.carrier;
                        console.log("API2:" + telValid + telCountry + telPrefix + telLocation + telType + telCarrier);
                        // createResultInfo(phoneNumber,telValid,telCountry,telPrefix,telLocation,telType,telCarrier);
                    })
                }).catch(function(error){
                    formMessage.textContent = "Connection error!";
                    formMessage.style = "color:red";
                });
            }

        });
    }).catch(function(error){
        formMessage.textContent = "Connection error!";
        formMessage.style = "color:red";
    });
}

//event listener
telForm.addEventListener("submit",searchForm);