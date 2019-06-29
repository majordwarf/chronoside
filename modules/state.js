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
    if (currentState == "idle") {
        return;
    } else if (currentStateFinishTime <= time()) {
        // Indicates the state has finished!
        // Perform final-transition steps
        switch (currentState) {
            case "adventure":
                adventurejs.finish(user, message);
                break;
            case "travel":
                traveljs.finish(user, message);
                break;
        }
        // Reset state to idle
        await mysql.setUserData(user.id, `state = "idle", stateFinishTime= ${time()}, destination = "nowhere"`);
    }
}