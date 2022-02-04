data={
    "phone":"14152007986",
    "valid":true,
    "format":{
        "international":"+14152007986",
        "local":"(415) 200-7986"},
    "country":{
        "code":"US",
        "name":"United States",
        "prefix":"+1"},
    "location":"California",
    "type":"mobile",
    "carrier":"T-Mobile Usa, Inc."}

var creatResultInfo=function(validResponse){
    var validEl=$("<li>")
        .addClass("phone-valid")
        .text(validResponse);
        console.log(validEl)
    
    var countryEl=$("<li>")
        .addClass("phone-country")
        .text("Country: "+data.country.name);
    
    var countryPrefixEl=$("<li>")
        .addClass("phone-countryPrefix")
        .text("Country Prefix: "+data.country.prefix);
    
    var localtionEl=$("<li>")
        .addClass("phone-location")
        .text("Location: "+data.location);
    
    var typeEl=$("<li>")
        .addClass("phone-type")
        .text("Type: "+data.type);

    var carrierEl=$("<li>")
        .addClass("phone-carrier")
        .text("Carrier: "+data.carrier);
    
    $(".result-box")
        .append(validEl,
            countryEl,
            countryPrefixEl,
            localtionEl,
            typeEl,
            carrierEl);
}

$(".search-btn").click(function(){
    event.preventDefault();
    console.log("button clicked");
});

$(".middle-history")
    .find("h4")
    .text("Your result for "+"14152007986");

if (data.valid==true){
    var validResponse="This is a valid phone number";
}
else{
    var validResponse="This is a FAKE phone number";
};

creatResultInfo(validResponse);