// import api key for Abstract API
var apiKeyTel1="67fbd798cbc74fddaee6c95cf604308a";
// import api key for numberify API
var apiKeyTel2="bdc7f61860e05e5ba773ad3b44017274";
// import api key for MapQuest API
var apiKeyMap="jDRCcpslgqlzGKPpjn9f6ElnCMI8W49W";

var telForm = document.getElementById("phone-form"),
    telInput = document.getElementById("phone"),
    formMessage = document.getElementById("form-message"),
    recentSearch = document.querySelector(".number-box"),
    searchHistory = [];

// form handler

var searchForm = function(event) {
    // event.preventDefault();
    formMessage.textContent = "Searching..."
    formMessage.style = "color:black";
    var phoneNumber = telInput.value.trim();
    
    //check if phone number is a number and if the length is from 6-15 digits
    if (isNaN(phoneNumber)) {
        formMessage.textContent = "Please use only numerals in your phone number.";
        formMessage.style = "color:red";
        return null;
    }
    if (phoneNumber.length < 6 || phoneNumber.length > 15) {
        formMessage.textContent = "Invalid telephone number length.";
        formMessage.style = "color:red";
        return null;
    }

    //Display the phone number in the result box
    phoneNumDisplay(phoneNumber);

    //call tel api 1
    var apiUrl = "https://phonevalidation.abstractapi.com/v1/?api_key=" + apiKeyTel1 + "&phone=" + phoneNumber;

    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
            if (data.location) {
                //if api 1 returns the location, proceed, else try 2nd api
                var telValid = data.valid,
                    telCountry = data.country.name,
                    telPrefix = data.country.prefix,
                    telLocation = data.location,
                    telType = data.type,
                    telCarrier = data.carrier;
                console.log("API1:" + telValid + telCountry + telPrefix + telLocation + telType + telCarrier);
                // createResultInfo(phoneNumber,telValid,telCountry,telPrefix,telLocation,telType,telCarrier);
                phoneInfoDisplay(telValid,telCountry,telPrefix,telLocation,telType,telCarrier);
            } else {
                //call tel api 2
                var apiUrl2 = "http://apilayer.net/api/validate?access_key=" + apiKeyTel2 + "&number=" + phoneNumber;
                fetch(apiUrl2).then(function(response2) {
                    response2.json().then(function(data2) {
                        //check if api2 returns valid response
                        if (data2.valid) {
                            var telValid = data2.valid,
                                telCountry = data2.country_name,
                                telPrefix = data2.country_prefix,
                                telLocation = data2.location,
                                telType = data2.line_type,
                                telCarrier = data2.carrier;
                            console.log("API2:" + telValid + telCountry + telPrefix + telLocation + telType + telCarrier);
                        } else if (data.valid) {
                            var telValid = data.valid,
                                telCountry = data.country.name,
                                telPrefix = data.country.prefix,
                                telLocation = data.location,
                                telType = data.type,
                                telCarrier = data.carrier;
                            console.log("API1:" + telValid + telCountry + telPrefix + telLocation + telType + telCarrier);
                        } else {
                            formMessage.textContent = "Invalid telephone number.";
                            formMessage.style = "color:red";
                            return null;
                        }
                        // createResultInfo(phoneNumber,telValid,telCountry,telPrefix,telLocation,telType,telCarrier);
                        phoneInfoDisplay(telValid,telCountry,telPrefix,telLocation,telType,telCarrier);
                    })
                }).catch(function(error) {
                    formMessage.textContent = "Connection error!";
                    formMessage.style = "color:red";
                });
            }
            if (telLocation) {
                var apiUrl3 = "https://www.mapquestapi.com/staticmap/v5/map?key=" + apiKeyMap + "&center=" + telLocation + "&size=@2x";
            } else {
                var apiUrl3 = "https://www.mapquestapi.com/staticmap/v5/map?key=" + apiKeyMap + "&center=" + telCountry + "&zoom=5&size=@2x";
            }
            
            //display map function here using apiURL3 as the image
            mapDisplay(apiUrl3);
        });
    }).catch(function(error) {
        formMessage.textContent = "Connection error!";
        formMessage.style = "color:red";
    });
    //add new search to recent search box
    historyList();
};

//function save history after a search occurs
function historyList() {
    var searchedTel = telInput.value.trim();
    //condition avoid repeat # on the array
    if (!searchHistory.includes(searchedTel)) {
        //put new search phone number on search history array
        searchHistory.push(searchedTel);

        var displayRecentSearch = $(`
            <ul>
                <li class="numList">${searchedTel}</li>
            </ul>
        `);

        $(".number-box").append(displayRecentSearch);

    }
    console.log(searchHistory);

    //saved recent search
    localStorage.setItem("searchedTel", JSON.stringify(searchHistory));

    //reset input field after press button or enter
    searchedTel.value = ""
};

function loadHistory(lastIndex) {
    searchHistory = JSON.parse(localStorage.getItem("searchedTel"));
    console.log(searchHistory);

    if (!searchHistory) {
        searchHistory = [];
        return false;
    } else if (searchHistory.length > 5) {
        //store max 5 recent search
        searchHistory.shift();
    }

    //when user click on the recent searched list, load the data 
    var histotyList = document.createElement('ul');
    histotyList.className = 'numList';
    recentSearch.appendChild(histotyList);

    for (var i = 0; i < searchHistory.length; i++) {
        var recentNumSearched = document.createElement('li');
        recentNumSearched.setAttribute('value', searchHistory[i]);
        recentNumSearched.textContent = searchHistory[i];
        histotyList.prepend(recentNumSearched);
    }

    var clickedNum = document.querySelector('.numList');

    //for the last search
    recentSearch.addEventListener('click', recentNumber);
    //for clicking on other recent search list
    clickedNum.addEventListener('click', recentNumber);

    loadLatestSearch();
};

//function load the lastest search on the screen
var loadLatestSearch = function() {
    //get the lasted search
    if (historyList !== null) {
        var lastSearchedIndex = historyList.length - 1;
        var lastSearchedCity = historyList[lastSearchedIndex];
    }
};

//function get value on the recent # put on the recent search list
var recentNumber = function(event) {
    var selectedNum = event.target.getAttribute('value');
};

//displays the loaded history when the page first loads
loadHistory();

var mapDisplay=function(mapURL){
        
    var mapEl=$("<iframe>")
        .addClass("map")
        .attr("src",mapURL,
            "alt","location_map",
            "style","boarder:0",
            "allowfullscreen","",
            "loading","lazy");

    $(".contact-info").append(mapEl);
}

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
    resultNum=$("<li>")
            .addClass("result-num")
            .text(phoneNumber);
    $(".result-box").append(resultNum);
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

//event listener
telForm.addEventListener("submit", function(){
    event.preventDefault();

    // remove the previous map
    $(".map").remove();

    // remove the previous searching results
    $(".result-list").remove();
      
    searchForm();
});

// function when user press enter key
telInput.addEventListener('keyup', function(event) {
    if (event.keyCode === 13) {
        telForm.click();
    }
});