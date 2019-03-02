$(document).ready(function () {
    var index = 0;
    
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
    

    // Collect user's input
    $(".submitButton").on("click", function () {
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

    database.ref().orderByChild("dateAdded").on("child_added", function(childSnapshot) {
        //database.ref().on("child_added", function (childSnapshot) {
        // var stackedButtons = "<td width='200'><div class='stacked-for-medium button-group'>"
        var updatedInfoButton = $("<button>").html("<span>Update</span>").addClass("updateInfoButton'")
        .attr("data-index", index).attr("data-key", childSnapshot.key);

        var removeInfoButton  = $("<button>").html("<span>Remove</button>").addClass("removeInfoButton")
        .attr("data-index", index).attr("data-key", childSnapshot.key);

        // var     "<button class='button updateInfoButton'>Update</button>" +
        // var     "<button class='button removeInfoButton'>Remove</button></div></td>"

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

        var userRow = $("<tr>");
        userRow.addClass("row-" + index); // will help us delete specific row when user presses "remove" button

        var col_1 = $("<td>").text(data.name);
        var col_2 = $("<td>").text(trainDest);
        var col_3 = $("<td>").text(data.frequency);
        var col_4 = $("<td>").text(displayArriving);
        var col_5 = $("<td>").text(timeAway);
        var col_6 = $("<td>").append(updatedInfoButton);
        var col_7 = $("<td>").append(removeInfoButton);

        userRow
            .append(col_1)
            .append(col_2)
            .append(col_3)
            .append(col_4)
            .append(col_5)
            .append(col_6)
            .append(col_7);
        // var userRow = $("#userData").append(
        //     "<tr><td>" + data.name +
        //     "<td>" + trainDest +
        //     "<td>" + data.frequency +
        //     "<td>" + displayArriving +
        //     "<td>" + timeAway + "</td>" +
            //     <Update> & <Remove> Buttons
            
            // "<button class='button removeInfo >>disabled<<' aria-disabled>Remove</button></div></td>"
        // );

        $("#userData").append(userRow);
        // userRow.addClass("row-" + "index");
        index++;

        console.log(time);
        console.log(timeAway);

        // BONUS: Update data every 1 minutes
        setInterval('window.location.reload()', 60 * 1000);  // 1000 = 1 milliseconds 

    function removeRow() {
        $(".row-" + $(this).attr("data-index")).remove();
        database.ref().child($(this).attr("data-key")).remove();
    }

    $(document).on('click', '.removeInfoButton', removeRow);

    });

    





}); // End of document.ready()