
$('#selectState').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
    if (isSelected) {
        $.ajax({
            type: "GET",
            url: COWIN_API_GET_DISTRICTS_URL + this.value,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                $('#selectDistrict').empty();
                $.each(data.districts, function () {
                    var options = "<option " + "value='" + this.district_id + "'>" + this.district_name + "";
                    $("#selectDistrict").append(options);
                });
                $('#selectDistrict').selectpicker('refresh');
            }
        });
    }
});

$('input[type=radio][name=searchBy]').change(function () {
    if (this.value == 'district') {
        $("#pincodeGroup").addClass('d-none');
        $("#districtGroup").removeClass('d-none');
    }
    else {
        $("#pincodeGroup").removeClass('d-none');
        $("#districtGroup").addClass('d-none');
    }
});

$('input[type=checkbox][id=autocheck]').change(function () {
    if (this.checked) {
        btnCheckAvailabilityCall();
    }
});

$(document).ready(function () {
    var url = new URL(document.location);
    var params = url.searchParams;
    var pincode = params.get("pincode");
    if (pincode) {
        $("#pincode").val(pincode);
    }
    var age = params.get("age");
    if (age && age == 45) {
        document.getElementById("age45").checked = true;
    }
    var autocheck = params.get("autocheck");
    if (autocheck) {
        document.getElementById("autocheck").checked = true;
        $("#btnCheckAvailability").click();
    }
    var audioalert = params.get("audioalert");
    if (audioalert) {
        document.getElementById("audioalert").checked = true;
    }
    opencowin = params.get("opencowin");
    if (opencowin) {
        document.getElementById("opencowin").checked = true;
    }

    $('#pincode').keypress(function (e) {
        var key = e.which;
        if (key == 13)  // the enter key code
        {
            $("#btnCheckAvailability").click();
            return false;
        }
    });
});

$.ajax({
    type: "GET",
    url: COWIN_API_GET_STATES_URL,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (data) {
        $.each(data.states, function () {
            var options = "<option " + "value='" + this.state_id + "'>" + this.state_name + "";
            $("#selectState").append(options);
        });
        $('#selectState').selectpicker('refresh');
    }
});

function audioalert() {
    const msg = new SpeechSynthesisUtterance("Vaccine slot found!");
    window.speechSynthesis.speak(msg);
};
var timer = null;
function btnCheckAvailabilityCall() {
    if (timer) {
        window.clearTimeout(timer);
        timer = null;
    }
    var isSearchByPincode = document.getElementById("searchbypincode").checked;
    
    
    const audioAlertEnable = document.getElementById("audioalert").checked;
    if (isSearchByPincode) {
        var locationPreference = document.getElementById("pincode").value.trim();
    } else {
        var locationPreference = document.getElementById("selectDistrict").value;
        var selectedDistrict = document.getElementById("selectDistrict");
        var locationName = selectedDistrict.options[selectedDistrict.selectedIndex].text;
    }
    
    const isValidData = (isSearchByPincode && locationPreference?.length == 6) || (!isSearchByPincode && locationPreference)
    
    if (isValidData) {
        const date = moment(new Date()).format("DD-MM-YYYY");
        var url = COWIN_API_GET_APPOINTMENTS_URL  + (isSearchByPincode ? SEARCH_BY_PIN_QUERY_PARAM : SEARCH_BY_DISTRICT_QUERY_PARAM) + locationPreference + SEARCH_BY_DATE_QUERY_PARAM + date;

        var availabilityData = [];

        $.ajax({
            method: "GET",
            url: url,
            contentType: "application/json",
            dataType: 'json',
            success: function (responseJson) {
                if (responseJson.centers) {
                    var centers = responseJson["centers"];
                    var age18Value = document.getElementById("age18").checked ? document.getElementById("age18").value : null;
                    var age45Value = document.getElementById("age45").checked ? document.getElementById("age45").value : null;
                    var freeValue = document.getElementById("free").checked ? document.getElementById("free").value : null;
                    var paidValue = document.getElementById("paid").checked ? document.getElementById("paid").value : null;
                    var covishieldChecked = document.getElementById("covishieldChecked");
                    var covaxinChecked = document.getElementById("covaxinChecked");
                    centers.forEach((center) => {
                        if (center.fee_type == freeValue || center.fee_type == paidValue) {
                            center.sessions.forEach((session) => {
                                if (
                                    session.available_capacity > 0 &&
                                    (session.min_age_limit == age18Value || session.min_age_limit == age45Value)
                                ) {
                                    var availableSession = {
                                        centerName: center.name + " - " + center.block_name + " - " + center.pincode,
                                        date: session.date,
                                        availableCapacity: session.available_capacity,
                                        age: session.min_age_limit,
                                        vaccine: session.vaccine,
                                        vaccine_fees: center.vaccine_fees,
                                        googlemaplink: "https://www.google.com/maps/search/" + center.name + " " + center.pincode,
                                    };
                                    
                                        if(availableSession.vaccine == "COVISHIELD" && covishieldChecked.checked){
                                            availabilityData.push(availableSession);
                                        }else if(availableSession.vaccine == "COVAXIN" && covaxinChecked.checked){
                                            availabilityData.push(availableSession);
                                        }
                                    
                                }
                            });
                        }
                    });
                }

                if (availabilityData.length == 0) {
                    $("#notAvailableMessage").removeClass('d-none');
                    if(isSearchByPincode)
                        $("#notAvailableMessage").html("No Slots found for: "+locationPreference);
                    else
                    $("#notAvailableMessage").html("No Slots found for: "+locationName);
                    $("#tablediv").addClass('d-none');
                } else {
                    $("#notAvailableMessage").addClass('d-none');
                    $("#tablediv").removeClass('d-none');
                    if (audioAlertEnable)
                        audioalert();
                    document.getElementById("audioalert").checked = false;
                    if (document.getElementById("opencowin").checked)
                        window.open("https://selfregistration.cowin.gov.in/");
                }
                $('#table').bootstrapTable("load", availabilityData);
            },
            error: function (jqxhr, textStatus, error) {
                if (jqxhr.status == 400) {
                    alert("Invalid pincode or district!");
                }
            },
            complete: function () {
                if (document.getElementById("autocheck").checked) {
                    autoCheckTime = document.getElementById("autoCheckTime").value ?? 1;
                    timer = setTimeout(btnCheckAvailabilityCall, 1000 * 60 * autoCheckTime);
                }
            }
        })
    } else {
        alert("Invalid pincode or district!");
        document.getElementById("autocheck").checked = false;
    }
};

