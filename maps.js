function Map()
{
	
}
/**
 * Display the map showing the user position  and the event position
 */
Map.displayMap = function(userPosition, eventPosition)
{
   var userLatLng = null;
   var eventLatLng = null;

   if (userPosition != null)
      userLatLng = new google.maps.LatLng(userPosition.coords.latitude, userPosition.coords.longitude);
   if (eventPosition != null)
      carLatLng = new google.maps.LatLng(carPosition.position.latitude, eventPosition.position.longitude);

   var options = {
      zoom: 20,
      disableDefaultUI: true,
      streetViewControl: true,
      center: userLatLng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
   }

   var map = new google.maps.Map(document.getElementById('map'), options);
   var marker = new google.maps.Marker({
      position: userLatLng,
      map: map,
      title: 'Your position'
   });
   // If eventLatLng is null means that the function has been called when the
   // event host set his current position and that is where the event is  so the
   // icon will be shown accordingly.
   if (eventLatLng == null)
      marker.setIcon('_images/event-marker.png');
   else
      marker.setIcon('_images/user-marker.png');
   var circle = new google.maps.Circle({
      center: userLatLng,
      radius: userPosition.coords.accuracy,
      map: map,
      fillColor: '#70E7FF',
      fillOpacity: 0.2,
      strokeColor: '#0000FF',
      strokeOpacity: 1.0
   });
   map.fitBounds(circle.getBounds());

   if (eventLatLng != null)
   {
      marker = new google.maps.Marker({
         position: carLatLng,
         map: map,
         icon: '_images/event-marker.png',
         title: 'Event position'
      });
      circle = new google.maps.Circle({
         center: eventLatLng,
         radius: eventPosition.position.accuracy,
         map: map,
         fillColor: '#70E7FF',
         fillOpacity: 0.2,
         strokeColor: '#0000FF',
         strokeOpacity: 1.0
      });

      // Display route to the event
      options = {
         suppressMarkers: true,
         map: map,
         preserveViewport: true
      }
      this.setRoute(new google.maps.DirectionsRenderer(options), userLatLng, eventLatLng);
   }

   $.mobile.loading('hide');
}

/**
 * Calculate the route from the user to the event
 */
Map.setRoute = function(directionsDisplay, userLatLng, eventLatLng)
{
   var directionsService = new google.maps.DirectionsService();
   var request = {
      origin: userLatLng,
      destination: eventLatLng,
      travelMode: google.maps.DirectionsTravelMode.WALKING,
      unitSystem: google.maps.UnitSystem.METRIC
   };

   directionsService.route(
      request,
      function(response, status)
      {
         if (status == google.maps.DirectionsStatus.OK)
            directionsDisplay.setDirections(response);
         else
         {
            navigator.notification.alert(
               'Unable to retrieve a route to the event location. However, you can still find it by your own.',
               function(){},
               'Warning'
            );
         }
      }
   );
}

/**
 * Request the address of the retrieved location
 that is the event address
 */
Map.requestLocation = function(position)
{
   new google.maps.Geocoder().geocode(
      {
         'location': new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
      },
      function(results, status)
      {
         if (status == google.maps.GeocoderStatus.OK)
         {
            var positions = new Position();
            positions.updatePosition(0, positions.getPositions()[0].coords, results[0].formatted_address);
         }
      }
   );
}