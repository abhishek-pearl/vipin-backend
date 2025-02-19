import chalk from "chalk";
import nodemailer from "nodemailer";
function convertMongoTimeToReadable(mongoTime) {
  // Check if the input is a valid Date object or string
  const date = new Date(mongoTime);
  if (isNaN(date)) {
    throw new Error("Invalid MongoDB time provided");
  }

  // Format the date
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // Use 24-hour time format
  };

  return date.toLocaleString("en-US", options).replace(",", "");
}
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.MAIL_PWD,
  },
});

// Inquiry mail

export const sendEnquiryMail = async (userData) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Customer Inquiry</title>
    <style>
        body {
            background-color: #ffffff;
            color: #000000;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            font-family: 'Oswald', sans-serif;
        }
    
        .container {
            width: 650px;
            border: 5px solid #000000;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            border-radius: 15px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .title {
            font-size: 24px;
            font-weight: bold;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        td {
            padding: 10px;
            color: #000000;
        }
        .bd {
            border-bottom: 3px solid #ffffff;
        }
        .total {
            font-size: 24px;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #000000;
        }

    </style>
</head>
<body>
    <div class="container">
        <div class="header"></div>
        <table>
            <tr>
                <td><strong>Name</strong></td>
                <td>${userData.name}</td>
            </tr>
            <tr>
                <td><strong>E-Mail</strong></td>
                <td>${userData.email}</td>
            </tr>
            <tr>
                <td><strong>Mobile</strong></td>
                <td>${userData.mobile}</td>
            </tr>
            <tr>
                <td><strong>Type of Loan</strong></td>
                <td>${userData.typeOfLoan}</td>
            </tr>
            <tr>
                <td><strong>Loan Required?</strong></td>
                <td>${userData.loanRequired}</td>
            </tr>
           <tr>
                <td><strong>Pincode</strong></td>
                <td>${userData.pincode}</td>
            </tr>
        </table>
    </div>
</body>
</html>`;

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: process.env.MAIL_ID, // sender address
    to: [userData.email,process.env.CLIENT_MAIL_INQUIRY,"shashanknegi@pearlorganisation.com","abhishek@pearlorganisation.com"], // list of receivers
    subject: `Loan Enquiry by ${userData.name}`, // Subject line
    html: htmlContent, // html body
  });
};

export const transactionSuccessMail = async (userData) => {
  userData.createdAt = convertMongoTimeToReadable(userData.createdAt);
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Status </title>
    <style>
        body {
            background-color: #ffffff;
            color: #000000;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            font-family: 'Oswald', sans-serif;
        }
    
        .container {
            width: 650px;
            border: 5px solid #000000;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            border-radius: 15px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .title {
            font-size: 24px;
            font-weight: bold;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        td {
            padding: 10px;
            color: #000000;
        }
        .bd {
            border-bottom: 3px solid #ffffff;
        }
        .total {
            font-size: 24px;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #000000;
        }

    </style>
</head>
<body>
    <div class="container">
        <div class="header"></div>
        <table>
            <tr>
                <td><strong> Order </strong></td>
                <td>${userData.orderId}</td>
            </tr>
                <td><strong>Name</strong></td>
                <td>${userData.name}</td>
            </tr>
            <tr>
                <td><strong>E-Mail</strong></td>
                <td>${userData.email}</td>
            </tr>
            <tr>
                <td><strong>Mobile</strong></td>
                <td>${userData.number}</td>
            </tr>
            <tr>
                <td><strong> State </strong></td>
                <td>${userData.state}</td>
            </tr>
            <tr>
                <td><strong> City </strong></td>
                <td>${userData.city}</td>
            </tr>
            <tr>
                <td><strong>Locality</strong></td>
                <td>${userData.locality}</td>
            </tr>
           <tr>
                <td><strong>Auction Type</strong></td>
                <td>${userData.auctionType}</td>
            </tr>
           <tr>
                <td><strong> Budget </strong></td>
                <td>${userData.budget}</td>
            </tr>
           <tr>
                <td><strong> Date Of Transaction </strong></td>
                <td>${userData.createdAt}</td>
            </tr>

        </table>
    </div>
</body>
</html>`;

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: process.env.MAIL_ID, // sender address
    to: [
      userData.email,
      process.env.CLIENT_MAIL_INQUIRY,
      "shashanknegi@pearlorganisation.com",
      "abhishek@pearlorganisation.com",
    ], // list of receivers
    subject: `Payment Status  ${userData.transactionStatus}`, // Subject line
    html: htmlContent, // html body
  });


};

// contact mail

export const sendContactMail = async (userData) => {
  const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Customer Contact Request</title>
      <style>
          body {
              background-color: #ffffff;
              color: #000000;
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              font-family: 'Oswald', sans-serif;
          }
      
          .container {
              width: 650px;
              border: 5px solid #000000;
              padding: 20px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
              border-radius: 15px;
          }
          .header {
              text-align: center;
              margin-bottom: 20px;
          }
          .title {
              font-size: 24px;
              font-weight: bold;
          }
          table {
              width: 100%;
              border-collapse: collapse;
          }
          td {
              padding: 10px;
              color: #000000;
          }
          .bd {
              border-bottom: 3px solid #ffffff;
          }
          .total {
              font-size: 24px;
              font-weight: bold;
          }
          .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 12px;
              color: #000000;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header"></div>
          <table>
              <tr>
                  <td><strong>Name</strong></td>
                  <td>${userData.name}</td>
              </tr>
              <tr>
                  <td><strong>E-Mail</strong></td>
                  <td>${userData.email}</td>
              </tr>
              <tr>
                  <td><strong>Mobile</strong></td>
                  <td>${userData.mobile}</td>
              </tr>
              <tr>
                  <td><strong>Message</strong></td>
                  <td>${userData.message}</td>
              </tr>
             
          </table>
      </div>
  </body>
  </html>`;

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: process.env.MAIL_ID, // sender address
    to: [
      userData.email,
      process.env.CLIENT_MAIL_INQUIRY,
      "shashanknegi@pearlorganisation.com",
      "abhishek@pearlorganisation.com",
    ], // list of receivers
    subject: `Contacted by ${userData.name} `, // Subject line
    html: htmlContent, // html body
  });
};

//verification password mail


export const sendForgetPassword = async (userData) => {
  const htmlContent = `
      <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {
        font-family: "Helvetica Neue", Arial, sans-serif;
        background-color: #f5f5f5;
        margin: 0;
        padding: 0;
        color: #333;
      }
      .email-container {
        max-width: 600px;
        margin: 30px auto;
        background: #ffffff;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 0;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      .header {
        background-color: #007e8f;
        color: #ffffff;
        text-align: center;
        padding: 20px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
      }
      .header h1 {
        font-size: 22px;
        margin: 0;
        font-weight: bold;
      }
      .content {
        padding: 20px 30px;
      }
      .content p {
        margin: 15px 0;
        line-height: 1.5;
      }
      .content .button-container {
        text-align: center;
        margin: 25px 0;
      }
      .button {
        display: inline-block;
        background-color: #007e8f;
        color: #ffffff;
        padding: 12px 20px;
        text-decoration: none;
        font-size: 16px;
        font-weight: bold;
        border-radius: 5px;
        transition: background-color 0.3s ease;
      }
      .button:hover {
        background-color: #439ca8;
      }
      .content .alternative-link {
        font-size: 14px;
        word-wrap: break-word;
        color: #00a6d6;
      }
      .footer {
        background-color: #f1f1f1;
        text-align: center;
        padding: 15px;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        font-size: 12px;
        color: #555;
      }
      .footer p {
        margin: 5px 0;
      }
      .footer strong {
        color: #007e8f;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <!-- Header Section -->
      <div class="header">
        <h1>Reset Your Travel Monk Password</h1>
      </div>
      <!-- Content Section -->
      <div class="content">
        <p>Hello <strong>${userData?.email}</strong>,</p>
        <p>
          We received a request to reset your password for your
          <strong>SDLK </strong> account. Click the button below to
          proceed:
        </p>
        <div class="button-container">
          <a
            href="${userData?.url}"
            class="button"
            target="_blank"
            style="color: white"
          >
            Reset Password
          </a>
        </div>
        <p>
          If you didn’t request this, please ignore this email. Your password
          will remain secure.
        </p>
        <p>
          Alternatively, you can copy and paste the link below into your
          browser:
        </p>
        <p class="alternative-link">
          <a href="${userData?.url}"
            >${userData?.url}</a
          >
        </p>
      </div>
      <!-- Footer Section -->
      <div class="footer">
        <p>Need help? Contact our support team anytime.</p>
        <p>Thank you for choosing <strong>SDLK</strong>.</p>
      </div>
    </div>
  </body>
</html>`;

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: process.env.MAIL_ID, // sender address
    to: [
      userData.email,
      process.env.CLIENT_MAIL_INQUIRY,
      "shashanknegi@pearlorganisation.com",
      "abhishek@pearlorganisation.com",
    ], // list of receivers
    subject: `Forget Password || SDLK `, // Subject line
    html: htmlContent, // html body
  });
};

