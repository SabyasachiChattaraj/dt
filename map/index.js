
    $(document).ready(function () {
        //var cities = $("#BranchLocatorJsonCities").val();
        //var branches = $("#BranchLocatorJsonBranches").val();
        getCurrentCity();
        var areaId = $('[id$=ddlbranc_Area]').val();
        fillCities(areaId);
        GetBranches();
     
        $('input[name="filterBrancType"]').on('change', function () {
            GetBranches();
        });
    
        $('[id$=ddlbranc_Area]').change(function () {
            fillCities(this.value);
            GetBranches();
        });
    });
    
    var getCurrentCity=function(){
    
        if (navigator.geolocation) {
            var a = {
                enableHighAccuracy: true,
            };
            navigator.geolocation.getCurrentPosition(
                function(a){
                    console.log(a);
                    currpos = a.coords;
                    coords = new google.maps.LatLng(a.coords.latitude,a.coords.longitude);
                    var c = new google.maps.Geocoder();        
                    var d = {
                        lat: parseFloat(a.coords.latitude),
                        lng: parseFloat(a.coords.longitude)
                    };
                    d = {
                        lat: 24.709025,
                        lng: 46.688789
                    };
                    c.geocode({
                        location: d
                    }, function(f, e) {
                        if (e === "OK") {
                            if (f[1]) {
                                console.log("results[1]" + JSON.stringify(f[1].address_components[3].long_name));
                                var g = f[1].address_components[3].long_name;
                                console.log("city" + g);
                                var branches=$.map(cities,function(eachCity){ if(eachCity.Title=="Riyadh"){return eachCity}});
                                $('[id$=ddlbranc_Area]').val(branches[0].Area).trigger('change');
                            } else {
                                window.alert("No results found")
                            }
                        } else {
                            window.alert("Geocoder failed due to: " + e)
                        }
                    })
                }, 
                function(a){
                    switch (a.code) {
                        case a.PERMISSION_DENIED:
                            break;
                        case a.POSITION_UNAVAILABLE:
                            alert("Location information is unavailable.");
                            break;
                        case a.TIMEOUT:
                            alert("The request to get user location timed out.");
                            break;
                        case a.UNKNOWN_ERROR:
                            alert("An unknown error occurred.");
                            break;
                    }
                }, 
            a)
        }
    };
    
    var resources = {
        Telephone: $("#BranchLocatorTelephone").val(),
        Email: $("#BranchLocatorEmail").val(),
        Fax: $("#BranchLocatorFax").val(),
        NearBy: $("#BranchLocatorNearBy").val()
    }
    
    var markers = [];
    var infoBox = null;
    
    
    var map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: 10,
        center: new google.maps.LatLng(-33.92, 151.25),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    AutoCenter(map, markers);
    
    function GetBranches() {
        var areaId = $('[id$=ddlbranc_Area]').val();
        var cityId = $('[id$=ddlbranc_City]').val();
        var result = "";
    
        var valuesArray = GetCheckedTypes();
    
        if (areaId != -1) {
            result = $.grep(branches, function (el) {
                return el.Area.indexOf(areaId) > -1
            });
        }
        else {
            result = branches;
        }
    
        if (cityId != -1) {
            result = $.grep(result, function (el) {
                return el.City.indexOf(cityId) > -1
            });
        }
    
    
        if (valuesArray.length > 0) {
            result = $.grep(result, function (el) {
                for (var i = 0; i < valuesArray.length; i++) {
                    if (el.BranchType.indexOf(valuesArray[i]) > -1) {
                        return true;
                    }
                }
            });
        }
    
        FillBranches(result)
    }
    
    function FillBranches(rows) {
    
    
        var branchMapindex = 0;
        var str = '';
        for (var i = 0; i < rows.length; i++) {
            str += "<div class=\"branch-item\">";
            str += "<h3><a onclick='SelectMaker(" + branchMapindex++ + ")' href=\"javascript:void(0);\">" + rows[i]['Title'] + "</a></h3>";
            str += "<p>" + rows[i]['NearBy'] + "</p>";
            str += "<p>" + resources.Telephone + ":" + rows[i]['Telephone'] + "</p>";
            str += "<p>" + resources.Fax + ":" + rows[i]['Fax'] + "</p>";
            str += "<p>" + resources.Email + ":" + rows[i]['Email'] + "</p>";
            str += "<p>" + rows[i]['WorkingDays'] + "</p>";
            str += "<p>" + rows[i]['WorkingHours'] + "</p>";
            str += "<p><a target='_blank' href='https://maps.google.com?saddr=Current+Location&daddr=" + rows[i]["Latitude"] + "," + rows[i]["Longitude"] + "'> <img alt='image' class='direction-image' src='/assets/images/icon-side-3.png'> </a></p>";
            str += "</div>";
        }
        $(".scrollable-branches").val("");
        $(".scrollable-branches").html(str);
        FillMarker(rows)
    }
    
    function fillCities(areaId) {
        $('#ddlbranc_City').children('option:not(:first)').remove();
        for (var i = 0; i < cities.length; i++) {
            if (cities[i]['Area'] == areaId) {
                $('#ddlbranc_City').append($('<option>', {
                    value: cities[i]['ID'],
                    text: cities[i]['Title']
                }));
            }
        }
    
        //GetBranches();
    }
    
    function GetCheckedTypes() {
        var valuesArray = $('input[name="filterBrancType"]:checked').map(function () {
            return $(this).attr('data-branchtype'); //this.value;
        }).get();//.join(",");
    
        return valuesArray;
    }
    
    function FillMarker(rows) {
        setAllMap(null);
        markers = [];
        var branchJson = rows;
    
        var infowindow = new google.maps.InfoWindow({
        
        });
        var marker, i;
        for (i = 0; i < (branchJson.length) ; i++) {
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(branchJson[i]["Latitude"], branchJson[i]["Longitude"]),
                map: map,
                html: GetInfoWindowMarkpup(branchJson[i])
            });
            markers.push(marker);
            
            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                    infowindow.setContent(marker.html);
                    infowindow.open(map, marker)
                }
            })(marker, i))
        }
        AutoCenter(map, markers)
    }
    
    function SelectMaker(i) {
        google.maps.event.trigger(markers[i], 'click')
    }
    
    function GetInfoWindowMarkpup(currentLocation) {
    
        var infoHtml = "<address class=\"address-main\">";
        infoHtml += "<h4>" + currentLocation["Title"] + "</h4>";
        infoHtml += "<ul class=\"list\">";
    
        if (currentLocation["NearBy"] != "")
            infoHtml += "<li><strong class=\"fix-content\">" + resources.NearBy + ":</strong>" + currentLocation["NearBy"] + "</li>";
    
        if (currentLocation["Telephone"] != "" && currentLocation["Telephone"] != "NA")
            infoHtml += "<li><strong class=\"fix-content\">" + resources.Telephone + ":</strong>" + currentLocation["Telephone"] + "</li>";
    
        if (currentLocation["Fax"] != "" && currentLocation["Fax"] != "NA")
            infoHtml += "<li><strong class=\"fix-content\">" + resources.Fax + ":</strong>" + currentLocation["Fax"] + "</li>";
    
        if (currentLocation["Email"] != "" && currentLocation["Email"] != "NA")
            infoHtml += "<li><strong class=\"fix-content\">" + resources.Email + ":</strong>" + currentLocation["Email"] + "</li>";
    
        infoHtml += "<li><strong class=\"fix-content\">" + currentLocation["WorkingDays"] + "</strong>" + currentLocation["WorkingHours"] + "</li>";
    
        infoHtml += "<li><a target='_blank' href='https://maps.google.com?saddr=Current+Location&daddr=" + currentLocation["Latitude"] + "," + currentLocation["Longitude"] + "'> <img alt='image' class='direction-image' src='/assets/images/icon-side-3.png'> </a></li>";
        
        infoHtml += "</ul>";
        infoHtml += "</address>";
    
        return infoHtml
    }
    
    function AutoCenter(map, markers) {
        var bounds = new google.maps.LatLngBounds();
        $.each(markers, function (index, marker) {
            bounds.extend(marker.position)
        });
        map.fitBounds(bounds);
        var zoomOverride = map.getZoom();
        if (markers.length > 1) {
            var listener = google.maps.event.addListener(map, "idle", function () {
                if ($('[id$=ddlbranc_Area]').val() == "-1") {
                    map.setZoom(-4);
                    map.fitBounds(bounds);
                }
                else
                    map.setZoom(8);
                google.maps.event.removeListener(listener)
            })
        } else {
            var listener = google.maps.event.addListener(map, "idle", function () {
                map.setZoom(18);
                google.maps.event.removeListener(listener)
            })
        }
    }
    
    function setAllMap(map) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map)
        }
    };
    
    function clearMarkers() {
        setAllMap(null)
    };
    
    function showMarkers() {
        setAllMap(map)
    };
    
    function deleteMarkers() {
        clearMarkers();
        markers = []
    };
    

