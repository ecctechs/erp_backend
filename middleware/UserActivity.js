const { UserActivity } = require("../model/userModel");
const logUserActivity = (user_id, activityType, routeName, body_json) => {
  const timestamp = Date.now();
  const dateObject = new Date(timestamp);

  const thaiDateString =
    dateObject.toLocaleDateString("th") +
    " " +
    dateObject.toLocaleTimeString("th");

  UserActivity.create({
    user_id: user_id,
    activityType: activityType,
    routeName: routeName,
    method: "POST",
    url: "auth/login",
    body: body_json,
    timestamp: thaiDateString,
  });
};

module.exports = logUserActivity;
