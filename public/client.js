
// initialize leaflet Bookmarks
var control = new L.Control.Bookmarks().addTo(map);


function markerOnClickEvent(e)
{



	alert(JSON.stringify(control._storage[i].control._storage.name));

}

//////////////////////////////////////////////////////////////////////// geolocation ///////////////////////////////////////////////////////////////////////////////////////////////////////

// add event listener for onlocationfound event and function to add marker and create popup and accuracy circle
function onLocationFound(e) {
  var radius = e.accuracy / 2;

  L.marker(e.latlng).addTo(map)
  .bindPopup("You are within " + radius + " meters from this point").openPopup();

  L.circle(e.latlng, radius).addTo(map);
}

map.on('locationfound', onLocationFound);

// add event listener for onlocationerror, and function to show error message
function onLocationError(e) {
  alert(e.message);
}

map.on('locationerror', onLocationError);


///////////////////////////////////////////////////////////////////////////////////////// bookmark //////////////////////////////////////////////////////////////////////////////////



// right click
map.on('contextmenu', function(e) {
  // add bookmark
  map.fire('bookmark:new', {
    latlng: e.latlng
  });
});

///////////////////////////////////////////////////////////////////////// user markers //////////////////////////////////////////////////////////////////////////////////////////////////




$(function() {

  //////////////////////////////////////////////////////////////////////// user add
  // retreive userAdd bookmark
  map.on('bookmark:add', function(e) {
    // asign userAdd variable to userAdd data
    var userAdd = e.data
    // alert(JSON.stringify(e.data))
    if (userAdd.username == username) {
      // emit userAdd
      socket.emit('user addition', userAdd);
      // alert added userAdd bookmark
      //  alert("client: user add")
    }
  });

  //////////////////////////////////////////////////////////////////////// user edit
  // retreive userEdit bookmark
  map.on('bookmark:edit', function(e) {
    // asign userEdit variable to userEdit data
    var userEdit = e.data
    // alert(JSON.stringify(e.data))
    if (userEdit.username == username) {
      // emit userEdit
      socket.emit('user edit', userEdit);
      // alert added userEdit bookmark
      //  alert("client: user edit")
    }
  });

  //////////////////////////////////////////////////////////////////////// user remove
  // retreive userRemove bookmark
  map.on('bookmark:remove', function(e) {
    // asign userRemove variable to userRemove data
    var userRemove = e.data
    // alert(JSON.stringify(e.data))
    if (userRemove.username == username) {
      // emit userRemove
      socket.emit('user removal', userRemove);
      // alert added userRemove bookmark
      //  alert("client: user remove")
    }
  });

  ///////////////////////////////////////////////////////////////////////////////// database markers /////////////////////////////////////////////////////////////////////////////////////////

  // ///////////////////////////////////////////////////////////////////////////////////db add
  socket.on('populate', (marker) => {
  //   alert(JSON.stringify(marker))
    // add to bookmarks
      map.fire('bookmark:add', {
        data: {
          id: marker.id,
          name: marker.name,
          latlng: marker.latlng,
          username: marker.username
        }
      });
  });



  // ///////////////////////////////////////////////////////////////////////////////////db add
  socket.once('database addition', (dbAdd) => {
    // add to bookmarks
    if (dbAdd.username !==  username) {
      // alert("client: db add")
      map.fire('bookmark:add', {
        data: {
          id: dbAdd.id,
          name: dbAdd.name,
          latlng: dbAdd.latlng,
          username: dbAdd.username
        }
      });
    }


  });

  // ///////////////////////////////////////////////////////////////////////////////////db edit
  socket.once('database edit', (dbEdit) => {
    // edit to bookmarks
    if (dbEdit.username !==  username) {
      // alert("client: db add")
      map.fire('bookmark:edit', {
        data: {
          id: dbEdit.id,
          name: dbEdit.name,
          latlng: dbEdit.latlng,
          username: dbEdit.username
        }
      });
    }
  });

  // ///////////////////////////////////////////////////////////////////////////////////db add
  socket.once('database removal', (dbRemove) => {
    // edit to bookmarks
    if (dbRemove.username !==  username) {
      // alert("client: db add")
      map.fire('bookmark:remove', {
        data: {
          id: dbRemove.id,
          name: dbRemove.name,
          latlng: dbRemove.latlng,
          username: dbRemove.username
        }
      });
    }
  });





  // closure
});
