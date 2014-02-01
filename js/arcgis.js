/* Uses pre-existing library - http://github.com/esri/bootstrap-map-js */
require(["esri/map", "esri/dijit/Scalebar", "http://esri.github.io/bootstrap-map-js/src/js/bootstrapmap.js", "dojo/domReady!"], 
  function(Map, Scalebar, BootstrapMap) {
    var mapLocations = [
        ["gray",[-100,45],3], /* World*/ ["streets",[-0.13,51.50],11], // London
        ["hybrid",[151.21,-33.87],14], /* Sydney */ ["topo",[-77.017,38.943],17], // D.C.
        ["national-geographic",[-84.0,10],9], /* Costa Rica */["oceans",[-40,30],4], // Atlantic   
        ["gray",[135,-25],4], /* Australia */ ["streets",[-117.20,32.73],13], // San Diego
        ["hybrid",[-77.65,24.20],9], /* Bahamas */ ["topo",[139.75,35.69],17], // Tokyo
        ["national-geographic",[-74,40.74],12], /* New York */ ["oceans",[-160,30],3] // Pacific
      ];
    var index = 0, countDown = 5, sec = countDown, playing = false, secTimer;
    var map = new Map("mapDiv",{
      basemap:"national-geographic",
      center:[-122.45,37.77],
      zoom:12
    });
    BootstrapMap.bindTo(map);
    var scalebar = new Scalebar({
      map: map,
      scalebarUnit: "dual"
    });
    map.on("update-end", function(e) {
      if (playing) {
        nextMap(false);
      }
    });
    map.on("load", function(e) {
      updateBasemapUI($("#mapDiv").data("basemap"));
    });
    map.on("basemap-change", function(e) {
      updateBasemapUI(e.current.basemapName);
    });
    // Functions
    function updateBasemapUI(basemapType) {
      $("#navbar a").removeClass("selected-basemap");
      $("#navbar a[data-basemap='" + basemapType + "']").addClass("selected-basemap");
    }
    function showCountdown(secondsLeft) {
      secondsLeft===""?$("#start-countdown").hide():$("#start-countdown").show();
      $("#start-countdown").text("" + secondsLeft);
    }
    function nextMap(startUp) {
      clearInterval(secTimer);
      if (startUp) { // updated immediately
        showBasemap(index);
        showCountdown(sec); 
      }
      secTimer = setInterval (function() {
        sec--;
        if (sec == 0) {
          index = (index < (mapLocations.length - 1) ? (index + 1) : 0);
          showBasemap(index);
          sec = countDown;
        }
        showCountdown(sec);
      }, 1000);
    }
    function toggleTour() {
      $("#start-glyph").toggleClass("glyphicon-pause glyphicon-play"); 
      clearInterval(secTimer);
      if (!playing) {
        nextMap(true);
      }
      playing = !playing;
    }
    function setBasemap(basemapType) {
      clearInterval(secTimer);
      map.setBasemap(basemapType);
    }
    function showBasemap(index) { // set map and location
      setBasemap(mapLocations[index][0]);
      map.centerAndZoom(mapLocations[index][1],mapLocations[index][2]);
    }
    // Bootstrap stuff
    $(document).ready(function() {
      $("#navbar li").click(function(e) {
        if (playing) toggleTour(); // Stop playing
        setBasemap(e.target.dataset.basemap); // Set the basemap
        if ($(".navbar-collapse.in").length > 0) { // Hide if showing responsive menu
          $(".navbar-toggle").click();
        }
      });
    $("#start").click(function(){
      toggleTour();
    });
  });
});