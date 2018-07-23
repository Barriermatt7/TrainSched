$(document).ready(function () {
  
  var config = {
    apiKey:  "AIzaSyD_51-rODp0_H9-IYFzwH_aXMWmj3zhP_g",
    authDomain: "trainsched-84ee5.firebaseapp.com",
    databaseURL: "https://trainsched-84ee5.firebaseio.com",
    projectId: "trainsched-84ee5",
    storageBucket: "trainsched-84ee5.appspot.com",
    messagingSenderId: "399748526968"
  };
  firebase.initializeApp(config);
 
  var database = firebase.database();
 
  $("#submit").on("click", function () {

    var name = $('#nameInput').val().trim();
    var dest = $('#destInput').val().trim();
    var time = $('#timeInput').val().trim();
    var freq = $('#freqInput').val().trim();

    // push to fire-database
    database.ref().push({
      name: name,
      dest: dest,
      time: time,
      freq: freq,
      timeAdded: firebase.database.ServerValue.TIMESTAMP
    });
    
    $("input").val('');
    return false;
  });

  
  database.ref().on("child_added", function (childSnapshot) {
      // console.log(childSnapshot.val());
      var name = childSnapshot.val().name;
      var dest = childSnapshot.val().dest;
      var time = childSnapshot.val().time;
      var freq = childSnapshot.val().freq;

      console.log("Name: " + name);
      console.log("Destination: " + dest);
      console.log("Time: " + time);
      console.log("Frequency: " + freq);
      //console.log(moment().format("HH:mm"));

      //train time formula
      var freq = parseInt(freq);
      //current time
      var currentTime = moment();
      console.log("CURRENT TIME: " + moment().format('HH:mm'));


      var dConverted = moment(childSnapshot.val().time, 'HH:mm').subtract(1, 'years');
      console.log("DATE CONVERTED: " + dConverted);
      var trainTime = moment(dConverted).format('HH:mm');
      console.log("TRAIN TIME : " + trainTime);

      //difference in times
      var tConverted = moment(trainTime, 'HH:mm').subtract(1, 'years');
      var tDifference = moment().diff(moment(tConverted), 'minutes');
      console.log("DIFFERENCE IN TIME: " + tDifference);
      //modulo 
      var tRemainder = tDifference % freq;
      console.log("TIME REMAINING: " + tRemainder);
      //mins until next train
      var minsAway = freq - tRemainder;
      console.log("MINUTES UNTIL NEXT TRAIN: " + minsAway);
      //next time
      var nextTrain = moment().add(minsAway, 'minutes');
      console.log("ARRIVAL TIME: " + moment(nextTrain).format('HH:mm A'));


      //table

      $('#currentTime').text(currentTime);
      $('#trainTable').append(
        "<tr><td id='nameDisplay'>" + childSnapshot.val().name +
        "</td><td id='destDisplay'>" + childSnapshot.val().dest +
        "</td><td id='freqDisplay'>" + childSnapshot.val().freq +
        "</td><td id='nextDisplay'>" + moment(nextTrain).format("HH:mm") +
        "</td><td id='awayDisplay'>" + minsAway + ' minutes until arrival' + "</td></tr>");
    },

    function (errorObject) {
      console.log("Read failed: " + errorObject.code)
    });

  database.ref().orderByChild("timeAdded").limitToLast(1).on("child_added", function(snapshot){
       
       $("#nameDisplay").html(snapshot.val().name);
       $("#destDisplay").html(snapshot.val().dest);
       $("#timeDisplay").html(snapshot.val().time);
       $("#freqDisplay").html(snapshot.val().freq);
   })

}); //END DOCUMENT.READY