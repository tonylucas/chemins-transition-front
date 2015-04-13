app.directive('map', function($timeout, Organisations, $modal, appConfig, mapService) {
  return {
    restrict: "E",
    controler: "HomeController",
    link: function(scope, element, attrs, ctrl, e) {
      var i, len, locate, map, mapboxTiles, org, ref;
      $('#map').parents().height('100%');
      L.mapbox.accessToken = 'pk.eyJ1IjoidG9ueWx1Y2FzIiwiYSI6IlRqa09UbE0ifQ.DGFIsGazdBZSk0t2PYe6Zw';
      mapboxTiles = L.tileLayer('https://{s}.tiles.mapbox.com/v4/examples.map-i87786ca/{z}/{x}/{y}.png?access_token=' + L.mapbox.accessToken, {
        attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
      });
      locate = false;
      map = L.mapbox.map('map');
      map.addLayer(mapboxTiles);
      if (locate) {
        map.locate({
          setView: true,
          maxZoom: 10
        });
      }
      if (!locate) {
        map.setView([48.8, 2.3], 10);
      }
      mapService.myLayer = L.mapbox.featureLayer().addTo(map);
      ref = scope.organizations;
      for (i = 0, len = ref.length; i < len; i++) {
        org = ref[i];
        org.avatar = appConfig.domain() + org.image;
        org.properties['marker-color'] = '#f86767';
      }
      mapService.myLayer.setGeoJSON(scope.organizations);
      return mapService.myLayer.eachLayer(function(layer) {
        var popupContent;
        console.log(layer);
        popupContent = "<div class='text-center popup'><strong>" + layer.feature.properties.name + "</strong>" + "<br><img src='" + layer.feature.avatar + "'><br>";
        angular.forEach(layer.feature.properties.skills, function(value) {
          return popupContent = popupContent + "<span class='tag'>" + value.name + "</span>";
        });
        popupContent = popupContent + "</div>";
        layer.bindPopup(popupContent);
        layer.on('mouseover', function(e) {
          return layer.openPopup();
        });
        layer.on('mouseout', function(e) {
          return layer.closePopup();
        });
        layer.on('click', function(e) {
          return scope.showModal(e);
        });
        console.log(layer);
        return mapService.myLayer.addLayer(layer);
      });
    }
  };
});
