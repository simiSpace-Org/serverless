//simiscodeforemail

const AWS = require("aws-sdk");

AWS.config.update({region: 'REGION'});
const SNS = new AWS.SNS({apiVersion: '2010-03-31'});
const SES = new AWS.SES();

console.log('Loading function');

exports.handler = event => {
  console.log("this is SNS", event.Records[0].Sns);
  console.log("this is SNS Message", event.Records[0].Sns.Message);

  const message = event.Records[0].Sns.Message;
  const username = JSON.parse(message).username;
  const token = JSON.parse(message).token;
  const first_name = JSON.parse(message).first_name;
  if(!message.verified) {
    sendEmail(message);
}  
}

//try 
var sendEmail = (data) => {

  let link = `https://demo.simiicodes.me/v1/verifyUserEmail?email=${username}&token=${token}`;
  console.log("the link is", link)

  let body = "Hi "+ data.first_name +",\n\n"+
  "You created a profile on our application, You need to verify that this is your email address before using your account by clicking on this link:" +"\n\n\n"+
  "Regards,"+data.username+"\n\n\n"+ link
  let from = "noreply@demo.simiicodes.me"
  let emailBody = {
      Destination: {
          ToAddresses: [data.username],
      },
      Message: {
          Body: {
              Text: { Data: body },
          },
          Subject: { Data: "User Account Verification Email" },
      },
      Source: from,
  };

  let sendEmailProm = ses.sendEmail(emailBody).promise()
  sendEmailProm
      .then(function(result) {
          console.log(result);
      })
      .catch(function(err) {
          console.error(err, err.stack);
      });
}  