$(document).ready(function) {

    // Initialize Firebase
    var config = {
    apiKey: "AIzaSyBSE0xwxGKXtE-1WjKmChoUd9M2LGyVWas",
    authDomain: "train-scheduler-d4447.firebaseapp.com",
    databaseURL: "https://train-scheduler-d4447.firebaseio.com",
    projectId: "train-scheduler-d4447",
    storageBucket: "train-scheduler-d4447.appspot.com",
    messagingSenderId: "567765713879"
    };

    firebase.initializeApp(config);

    var database = firebase.database();

    // Collect user's input
    $(".submitButton").on("click", function(event) {
        console.log("Click!!");

        var trainName = ("#trainName input").val().trim(); 
        var trainDest = ("#trainDest input").val().trim();// Train's destination
        var firstTrain =("#firstTrain input").val().trim();
        var trainFreq = ("#trainFreq input").val().trim();// Train Freqncy in mins.

        console.log("---- Collected user's data ----");
        console.log(trainName);
        console.log(trainDest);
        console.log(firstTrain);
        console.log(trainFreq);
        console.log("---- End ----");

        // Input validation 
        if (trainName != "" && trainDest != "" &&
            firstTrain != "" && trainFreq != "") {

                // As long as the input boxes are not empty
                // we will push data from user to database.
                database.ref().push({
                    name: trainName,
                    destination: trainDest,
                    time: firstTrain,
                    frequency: trainFreq,
                });
        } else {
            // Will figure out how to let user know 
            // Note: Think of accessibility. Red text as well as red think border...
            console.log("User did not enter a valid data!");
            return false;
        }
        console.log(database); // Check to see values in database
        $("input").val("");     // Empty user input area
    })


}); // End of document.ready(f(x))