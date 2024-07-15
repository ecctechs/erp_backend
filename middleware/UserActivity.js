
const {UserActivity} = require('../model/userModel'); // call model


// Log user activity
// const logUserActivity = async (userId, activityType,routeName) => {
//   return (req, res, next) => {
//   try {
//     // await UserActivity.create({
//     //   userId,
//     //   action,
//     //   asset,
//     // });
//     // const { method, url, body } = req;
//     console.log('sssssssssssssssssssssssssss')
//     const timestamp = new Date();

//     UserActivity.create({
//       userId:userId,
//       activityType:activityType,
//       routeName:routeName,
//       method:method,
//       url:url,
//       body:body,
//       timestamp:timestamp
//     });
//     console.log('User activity logged successfully');
//   } catch (error) {
//     console.error('Error logging user activity:', error);
//   }
// }
// };

const logUserActivity =  (userId,activityType, routeName,body_json) => {

  const timestamp = Date.now();
  const dateObject = new Date(timestamp);

  // กำหนด locale เป็น 'th' และใช้ toLocaleDateString() และ toLocaleTimeString() ในการแสดงวันที่และเวลา
  const thaiDateString = dateObject.toLocaleDateString('th') + ' ' + dateObject.toLocaleTimeString('th');
  

    UserActivity.create({
      userId:userId,
      activityType:activityType,
      routeName:routeName,
      method:'POST',
      url:'auth/login',
      body:body_json,
      timestamp:thaiDateString
    });
  
};

module.exports = logUserActivity;