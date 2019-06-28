const mysql = require('./mysql.js');
const adventurejs = require('./adventure.js');
const traveljs = require('./travel.js');
// BATTLE!
/*

    State checks! This module checks if the user's state needs updating!

*/

let time = () => {
    return Math.floor(new Date() / 1000);
}

// Function to call when the user gains any amount of XP through any source
exports.stateCheck = async(message, cmdTime) => {
    // If user's state is idle, all good!
    // if User's state is not idle, perform function related to the user's state (ideally bypass to that specific module)
    // Change state back to idle??
    let user = await message.author;
    let data = await mysql.getUserData(user.id, 'state, stateFinishTime');
    let currentState = data.state;
    let currentStateFinishTime = data.stateFinishTime;

    console.log("User state = " + currentState);
    console.log("User finish time = " + currentStateFinishTime);
    console.log("Current time = " + time());
    if (currentState == "idle") {
        console.log("User is idle!");
        return;
    } else if (currentStateFinishTime <= time()) {
        // Indicates the state has finished!
        // Perform final-transition steps
        switch (currentState) {
            case "adventure":
                console.log("Adventure finished");
                adventurejs.finish(user, message);
                break;
            case "travel":
                console.log("Travel finished");
                traveljs.finish(user, message);
                break;
        }
        // Reset state to idle
        await mysql.setUserData(user.id, `state = "idle", stateFinishTime= ${time()}, destination = "nowhere"`);
    }

}

/*

    STAT SYSTEM:
    Basically, it will be level*multiplier based on the class. each class has 1 primary attribute and may have 1 secondary.
    The sum of multiplier will always be 5. Hence, at level 10, player will have 50 total stats distributed based on their class.
    Feel free to suggest if we want to use a different system!

*/

exports.levelUP = async(message, user, newLevel) => {
    levelUp(message, user, newLevel);
}