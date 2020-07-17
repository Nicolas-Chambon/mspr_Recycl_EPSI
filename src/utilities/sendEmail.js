const aws = require("aws-sdk");
const generateEmail = require('./mailTemplate')

// noinspection BadExpressionStatementJS
aws.config.accessKeyId
// noinspection BadExpressionStatementJS
aws.config.secretAccessKey;
aws.config.region = process.env.AWS_SES_REGION;


const sendEmail = (to, sub, content) => {
  const ses = new aws.SES();
  const from = process.env.AWS_SES_EMAIL_FROM;

  ses.sendEmail(
      {
        Source: from,
        Destination: { ToAddresses: to },
        Message: {
          Subject: {
            Data: sub
          },
          Body: {
            Html: {
              Data: generateEmail(content)
            }
          }
        }
      },
      function(err, data) {
        if (err) {
          console.log(err);
        } else {
          console.log("Email sent: " + data);
        }
      }
  );
}

module.exports = sendEmail;
