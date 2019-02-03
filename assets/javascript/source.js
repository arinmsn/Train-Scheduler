/* --- Improvements ---

1. Dynamically add 'data-name' of 'item-' + dataCount so we can
recall and -Update- or -Remove- specific entries.\
set datacount = 0;

2. Gray out the buttons for -Update- or -Remove-.

*/

// $(document).ready(function() {

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

var database = firebase.database().ref();   /////// added .ref()

// Collect user's input
$(".submitButton").on("click", function() {
    console.log("Click!!");
    event.preventDefault();

    var trainName = $(".trainName").val().trim(); 
    var trainDest = $(".trainDest").val().trim();// Train's destination
    var firstTrain =$(".firstTrain").val().trim();
    var trainFreq = $(".trainFreq").val().trim();// Train Frequency in mins.

    console.log("---- Collected user's data ----");
    console.log(trainName);
    console.log(trainDest);
    console.log(firstTrain);
    console.log(trainFreq);
    console.log("---- End ----");

    // Local temporary storage
    var addedTrain = {
        name: trainName,
        trainDest: trainDest,
        firstTrain: firstTrain,
        trainFreq: trainFreq
    }

    //Push data to database
    database.push(addedTrain);
    console.log(database);
    // // Input validation 
    // if (trainName != "" && trainDest != "" &&
    //     firstTrain == 4 && trainFreq != "") {

    //     // As long as the input boxes are not empty
    //    // we will push data from user to database.
    // database.ref().push({
    //             name: trainName,
    //             destination: trainDest,   //// 2/3 should be trainDest: trainDest,
    //             time: firstTrain,
    //             frequency: trainFreq,
    //         });
    // } else {
    //     // Will figure out how to let user know 
    //     // Note: Think of accessibility. Red text as well as red think border...
    //     console.log("User did not enter a valid data!");
    //     return false;
    // }
    // console.log(database); // Check to see values in database
    // $("input").val("");     // Empty user input area
    // Clear Textbox area?
    return false;
});

var trainName = "";
var trainDest = "";
var firstTrain = "";
var trainFreq = "";

database.on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());    

    var data = childSnapshot.val();
    var trainName = data.name;
    var trainDest = data.trainDest;  ///used to be .destination
    var firstTrain = data.firstTrain;
    var trainFreq = data.frequency;  ////-------------Fixed

    console.log(name, trainDest, firstTrain, frequency);

    // Format the time

    var frequency = parseInt(frequency);
    var currentTime = moment();

    var convertDate = moment(data.time, "HHmm").subtract(1, "years");

    var trainTime = moment(convertDate).format("HHmm"); // ********* CONSIDER CHANGING

    // Calculate difference
    var convertTime = moment(trainTime, "HHmm").subtract(1, "years");
    var timeDiff = moment().diff(moment(convertTime), "minutes");      
    console.log("Time difference: " + timeDiff);

    // Calculate remainder
    var timeRemain = timeDiff % frequency;
    console.log("Remaining time: " + timeRemain);

    // Train arrives in ... (mins.)
    var timeAway = frequency - timeRemain;
    console.log("Next train arrives in " +timeAway+ " minutes.");

    var nextTrain = moment().add(timeAway, "minutes");

    var displayArriving = moment(nextTrain).format("HHmm");
    
    // Appending data ...
    $("#userData").append(
        "<tr><td width='300'>" + data.name +
        "<td  width='300'>" + data.trainDest +
        "<td width='100'>" + data.frequency +
        "<td width='100'>" + data.displayArriving +
        "<td width='100'>" + data.timeRemain + "</td>" +
        //     <Update> & <Remove> Buttons
        "<td width='200'><div class='stacked-for-medium button-group'>" +
        "<button class='button updateInfo'>Update</button>" +
        "<button class='button removeInfo'>Remove</button></div></td>"
    );
    
    console.log(nextTrain);
    console.log(timeRemain);

    // BONUS: Update data every 1 minutes
    // setInterval('window.location.reload()', 60 * 1000);  // 1000 = 1 milliseconds 
});

// Document event handlers for the <Remove> & <Update>
// <Remove> train data function
// <Update> train data function

// }); // End of document.ready(f(x))

