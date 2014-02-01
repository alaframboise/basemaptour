/* Uses pre-existing library - http://github.com/esri/bootstrap-map-js */
require(["esri/map", "esri/dijit/Scalebar", "http://esri.github.io/bootstrap-map-js/src/js/bootstrapmap.js", "dojo/domReady!"], 
  function(Map, Scalebar, BootstrapMap) {
    var mapLocations, timerHandle, secTimer;
    var index = 0, sec = 1, t = 5000, playing = false;
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
    map.on("update-end", function() {
      if (playing) {
        nextMap(false);
      }
    });
    function nextMap(startUp) {
      clearInterval(secTimer);
       if (startUp) {
         $("#start").html('<span id="start-glyph"class="glyphicon glyphicon-play"></span> '+sec); // updated immediately
      }
      secTimer = setInterval (function() {
        sec++;
        if (sec < 6) {
          $("#start").html('<span id="start-glyph"class="glyphicon glyphicon-play"></span> '+sec);
        } else {
          //clearInterval(secTimer);
          index = (index < (mapLocations.length - 1) ? (index + 1) : 0);
          showBasemap(index, true);
          sec = 0;
        }
      }, 1000);
    }
    function playTour() {
      clearInterval(secTimer);
      if (!playing) { 
        nextMap(true);
      }
      playing = !playing;
    }
    // Functions
    function initBasemaps() {
      index = 0;
      mapLocations = [
        ["gray",[-100,45],3], /* World*/ ["streets",[-0.13,51.50],11], // London
        ["hybrid",[151.21,-33.87],14], /* Sydney */ ["topo",[-77.017,38.943],17], // D.C.
        ["national-geographic",[-84.0,10],9], /* Costa Rica */["oceans",[-40,30],4], // Atlantic   
        ["gray",[135,-25],4], /* Australia */ ["streets",[-117.20,32.73],13], // San Diego
        ["hybrid",[-77.65,24.20],9], /* Bahamas */ ["topo",[139.75,35.69],17], // Tokyo
        ["national-geographic",[-74,40.74],12], /* New York */ ["oceans",[-160,30],3] // Pacific
      ];        
    }
    function setBasemap(type) { // Disable playmode
     clearInterval(timerHandle);
     map.setBasemap(type);
    }
    function showBasemap(index,moveLocation) { // set map and location
      map.setBasemap(mapLocations[index][0]);
      if (moveLocation) {
        map.centerAndZoom(mapLocations[index][1],mapLocations[index][2]);
      }
    }
    function move(forward) {
      var i = index;
      if (forward) {
       index = index < (mapLocations.length - 1) ? (index + 1) : index;
      } else {
         index = index > 0 ? (index - 1) : 0;
      }
      if (i != index) {
       showBasemap(index,true);
      }
    }
  
  // Bootstrap stuff
   $(document).ready(function(){
      initBasemaps();
      $("#navbar li").click(function(e) {
        switch (e.target.text) {
          case "Streets":
            map.setBasemap("streets");
            break;
          case "Satellite":
            map.setBasemap("hybrid");
            break;
          case "National Geographic":
            map.setBasemap("national-geographic");
            break;
          case "Topographic":
            map.setBasemap("topo");
            break;
          case "Gray":
            map.setBasemap("gray");
            break;
          case "Open Street Map":
            map.setBasemap("osm");
            break;
        }
        if ($(".navbar-collapse.in").length > 0) {
          $(".navbar-toggle").click();
        }
      });
    $("#start").click(function(){
      var span = $("#start-glyph");
      if (!playing) {
        span.toggleClass('glyphicon-pause glyphicon-play'); 
      } else {
        span.toggleClass('glyphicon-play glyphicon-pause');
      }
      playTour();
    });
  });
});