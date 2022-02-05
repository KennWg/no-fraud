// import api key for Abstract API
var apiKeyTel1="67fbd798cbc74fddaee6c95cf604308a";
// import api key for numberify API
var apiKeyTel2="bdc7f61860e05e5ba773ad3b44017274";
// import api key for MapQuest API
var apiKeyMap="jDRCcpslgqlzGKPpjn9f6ElnCMI8W49W";

var telForm = document.getElementById("phone-form"),
    telInput = document.getElementById("phone"),
    formMessage = document.getElementById("form-message");

// form handler

var searchForm = function(event){
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

    // Dispaly the phone number at the "your search result....."
    phoneNumDisplay(phoneNumber);

    //call tel api 1
    var apiUrl = "https://phonevalidation.abstractapi.com/v1/?api_key=" + apiKeyTel1 + "&phone=" + phoneNumber;

    fetch(apiUrl).then(function(response){
        response.json().then(function(data){
            if(data.location){
                //if api 1 returns the location, proceed, else try 2nd api
                var telValid = data.valid,
                    telCountry = data.country.name,
                    telPrefix = data.country.prefix,
                    telLocation = data.location,
                    telType = data.type,
                    telCarrier = data.carrier;
                console.log("API1:" + telValid + telCountry + telPrefix + telLocation + telType + telCarrier);
                // phone info display
                phoneInfoDisplay(telValid,telCountry,telPrefix,telLocation,telType,telCarrier);
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
                        // console.log("API2:" + telValid + telCountry + telPrefix + telLocation + telType + telCarrier);
                        // phone info display
                        phoneInfoDisplay(telValid,telCountry,telPrefix,telLocation,telType,telCarrier);
                    })
                }).catch(function(error){
                    formMessage.textContent = "Connection error!";
                    formMessage.style = "color:red";
                });
            }
            if(telLocation){
                var apiUrl3 = "https://www.mapquestapi.com/staticmap/v5/map?key=" + apiKeyMap + "&center=" + telLocation + "&size=@2x";
            } else {
                var apiUrl3 = "https://www.mapquestapi.com/staticmap/v5/map?key=" + apiKeyMap + "&center=" + telCountry + "&zoom=5&size=@2x";
            }
           
            //display map function here using apiURL3 as the image
            mapDisplay(apiUrl3);

        });
    }).catch(function(error){
        formMessage.textContent = "Connection error!";
        formMessage.style = "color:red";
    });
    
}

var mapDisplay=function(mapURL){
    // refresh the map
    $(".map").remove();

    var mapEl=$("<iframe>")
        .addClass("map")
        .attr("src",mapURL,
            "alt","location_map",
            "style","boarder:0",
            "allowfullscreen","",
            "loading","lazy");

    $(".contact-info").append(mapEl);
}

// data={
//     "phone":"14152007986",
//     "valid":true,
//     "format":{
//         "international":"+14152007986",
//         "local":"(415) 200-7986"},
//     "country":{
//         "code":"US",
//         "name":"United States",
//         "prefix":"+1"},
//     "location":"California",
//     "type":"mobile",
//     "carrier":"T-Mobile Usa, Inc."}

var creatResultInfo=function(validResponse,telCountry,telPrefix,telLocation,telType,telCarrier){
      
    var resultListEl=$("<ul>")
        .addClass("result-list")
    
    var validEl=$("<li>")
        .addClass("phone-valid")
        .text("Valid: "+validResponse);
        console.log(validEl)
    
    var countryEl=$("<li>")
        .addClass("phone-country")
        .text("Country: "+telCountry);
    
    var countryPrefixEl=$("<li>")
        .addClass("phone-countryPrefix")
        .text("Country Prefix: "+telPrefix);
    
    var localtionEl=$("<li>")
        .addClass("phone-location")
        .text("Location: "+telLocation);
    
    var typeEl=$("<li>")
        .addClass("phone-type")
        .text("Type: "+telType);

    var carrierEl=$("<li>")
        .addClass("phone-carrier")
        .text("Carrier: "+telCarrier);
    
    $(".result-box")
    .append(resultListEl);
        
    $(".result-list")
    .append(validEl,
        countryEl,
        countryPrefixEl,
        localtionEl,
        typeEl,
        carrierEl);
}

// Display the input phone number
var phoneNumDisplay=function(phoneNumber){
    $(".middle-history")
        .find("h4")
        .text("Your result for "+phoneNumber);
}

// enpower the results after pressing the search button
var phoneInfoDisplay=function(telValid,telCountry,telPrefix,telLocation,telType,telCarrier){
    if (telValid==true){
        var validResponse="This is a valid phone number";
    }
    else{
        var validResponse="This is a FAKE phone number";
    };

    creatResultInfo(validResponse,telCountry,telPrefix,telLocation,telType,telCarrier)
}

// Storage the data
function dateStorage(phoneNumber){
    localStorage.setItem(5,phoneNumber)
}

//Load the data
function dataLoading(){
    for (var i=0;i<5;i++){
        var id="#"+i;
        console.log(id)
        var historyNum=JSON.parse(localStorage.getItem(i));
        $(id).text(historyNum);
    }
}

//event listener
telForm.addEventListener("submit",function(){
    event.preventDefault();
    // dataLoading()

    console.log("button clicked");

    var phoneNumber = telInput.value.trim();
    // dateStorage(phoneNumber);

    // reset the display box to prevent dulicate display.
    $(".result-list").remove();

    searchForm();
});