/* --- Improvements ---

1. Dynamically add 'data-name' of 'item-' + dataCount so we can
recall and -Update- or -Remove- specific entries.
set dataCount = 0;

2. Gray out the buttons for -Update- or -Remove-. (Related to #1)

3. Add authentication (Git or Google)

4. Input Validation. Be mindeful of users with disabilities (some cannot see red border!)
Will also need CSS Styling defined for invalid feedback.

*/

$(document).ready(function () {

    $(".trainName").text("AMTRAK");
    $("trainDest").text("Glendale, CA");
    $(".firstTrain").text(parseInt(1000));
    $(".trainFreq").text(parseInt(30));

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
    // var database = firebase.database().ref();   /////// added .ref()
    var index = 0;

    // Collect user's input
    $(".submitButton").on("click", function () {
        console.log("Click!!");
        event.preventDefault();

        var trainName = $(".trainName").val().trim();
        var trainDest = $(".trainDest").val().trim();// Train's destination
        var firstTrain = $(".firstTrain").val().trim();
        var trainFreq = $(".trainFreq").val().trim();// Train Frequency in mins.

        console.log("---- Collected user's data ----");
        console.log(trainName);
        console.log(trainDest);
        console.log(firstTrain);
        console.log(trainFreq);
        console.log("---- End ----");

        //Local temporary storage
        var addedTrain = {
            name: trainName,
            destination: trainDest,
            time: firstTrain,
            frequency: trainFreq
        }

        // Improvements to follow
        // Input validation 
        if (trainName !== "" && trainDest !== "" && firstTrain.length == 4 && trainFreq !== "") {
            database.ref().push(addedTrain);
        } else {
            $("input").val("");
            return false;
        }

        $(".trainName").val().trim();
        $(".trainDest").val().trim();
        $(".firstTrain").val().trim();
        $(".trainFreq").val().trim();

        return false;
    });

    var trainName = "";
    var trainDest = "";
    var firstTrain = "";
    var frequency = "";
    database.ref().on("child_added", function (childSnapshot) {
        // database.on("child_added", function(childSnapshot) {
        console.log("ChildSnapshot  :" + childSnapshot.val());

        var data = childSnapshot.val();
        var name = data.name;
        var trainDest = data.destination;
        var time = data.time;
        var frequency = data.frequency;

        console.log(trainName, trainDest, firstTrain, frequency);

        // Format the time
        var frequency = parseInt(frequency);
        var currentTime = moment();

        // We cam shorten b/c of our earlier ... var data = childSnapshot.val();
        var convertDate = moment(data.time, "HHmm").subtract(1, "years");

        var trainTime = moment(convertDate).format("HHmm"); // 

        // Calculate difference
        var convertTime = moment(trainTime, "HHmm").subtract(1, "years");
        var timeDiff = moment().diff(moment(convertTime), "minutes");
        console.log("Time difference: " + timeDiff);

        // Calculate remainder
        var timeRemain = timeDiff % frequency;
        console.log("Remaining time: " + timeRemain);

        // Train arrives in ... (mins.)
        var timeAway = frequency - timeRemain;
        console.log("Next train arrives in " + timeAway + " minutes.");

        var nextTrain = moment().add(timeAway, "minutes");

        var displayArriving = moment(nextTrain).format("HHmm");

        // var keyValue = childSnapshot.key;
        // Appending data ...
        var userRow = $("#userData").append(
            "<tr><td width='300'>" + data.name +
            "<td  width='300'>" + trainDest +
            "<td width='100'>" + data.frequency +
            "<td width='100'>" + displayArriving +
            "<td width='100'>" + timeAway + "</td>" +
            //     <Update> & <Remove> Buttons
            "<td width='200'><div class='stacked-for-medium button-group'>" +
            "<button class='button updateInfoButton disabled' aria-disabled data-key='childSnapshot.key' data-index='index'>Update</button>" +
            "<button class='button removeInfoButton'>Remove</button data-key='childSnapshot.key' data-index='index'></div></td>"
            // "<button class='button removeInfo >>disabled<<' aria-disabled>Remove</button></div></td>"
        );
        userRow.addClass("row-" + "index");
        index++;

        console.log(time);
        console.log(timeAway);

        // BONUS: Update data every 1 minutes
        setInterval('window.location.reload()', 60 * 1000);  // 1000 = 1 milliseconds 

    });

    function removeRow() {
        $(".row-" + $(this).attr("data-index")).remove();
        database.ref().child($(this).attr("data-key")).remove();
    }

    $(document).on('click', '.removeInfoButton', removeRow);





}); // End of document.ready(f(x))