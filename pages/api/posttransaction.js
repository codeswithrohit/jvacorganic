import Order from "../../models/JVCORDER";
import connectDb from "../../middleware/mongoose";
import PaytmChecksum from "paytmchecksum";
import nodemailer from "nodemailer";
const twilio = require("twilio");
const handler = async (req, res) => {
  let order;

  // Validate paytm checksum
  var paytmChecksum = "";
  var paytmParams = {};
  const received_data = req.body;
  for (var key in received_data) {
    if (key == "CHECKSUMHASH") {
      paytmChecksum = received_data[key];
    } else {
      paytmParams[key] = received_data[key];
    }
  }

  var isValidChecksum = PaytmChecksum.verifySignature(
    paytmParams,
    process.env.PAYTM_MKEY,
    paytmChecksum
  );
  if (!isValidChecksum) {
    res.status(500).send("Invalid checksum");
    return;
  }

  if (req.body.STATUS === "TXN_SUCCESS") {
    order = await Order.findOneAndUpdate(
      { orderId: req.body.ORDERID },
      {
        status: "Paid",
        paymentInfo: JSON.stringify(req.body),
        transactionid: req.body.TXNID,
      }
    );
    function formatDate(date) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(date).toLocaleDateString(undefined, options);
    }
    const products = order.products;

    const orderDetailsHTML = `
    <!DOCTYPE html>
<html>
<head>
  <title>Order Confirmation</title>
  
 
</head>
<body>
  <div>
    <h1>Order Confirmation</h1>
    <p>Dear ${order.name},</p>
    <p>Your order has been successfully placed. Thank you for shopping with us!</p>

    <div class="order-details">
      <h2>Order Details:</h2>
      <p><strong>Order ID:</strong> #${order.orderId}</p>
      <p><strong>Order Date:</strong> ${formatDate(order.createdAt)}</p>
      <p><strong>Total Amount:</strong> ₹${order.amount}</p>
    </div>

    <div class="products">
      <h2>Products Ordered:</h2>
      <!-- Loop through each product in the order -->
      ${Object.keys(products)
        .map(
          (key) => `
        <div class="product">
          <div class="product-info">
            <div class="product-details">
              <h3>${products[key].productname}</h3>
              <p>Price: ₹${products[key].price}</p>
              <p>Quantity: ${products[key].qty}</p>
              ${
                products[key].selectedDate
                  ? `<p>Booking Date: ${products[key].selectedDate}</p>`
                  : ""
              }
            </div>
          </div>
        </div>
      `
        )
        .join("")}
    </div>

    <p>For any question or concern, please reach out to us on orders@ramkiayodhya.com or 8808502599.
    </p>
    <p>Thank you!</p>
    <p>Best Regards,</p>
    <p>Ram Ki Ayodhya Divya Darshan Pvt Ltd, Ayodhya, UP</p>
  </div>
</body>
</html>

  `;
    // Send email to the customer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "raamkiayodhya@gmail.com",
        pass: "qbaunbijmhanuiek", // Replace with the actual password or use environment variables
      },
    });

    const mailOptions = {
      from: "raamkiayodhya@gmail.com",
      to: order.email, // Use order.email to get the recipient's email
      subject: "Order Confirmation",
      html: orderDetailsHTML, // Use HTML content for the email body
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    const twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    let phoneNumbers = order.phone;

    // Check if phoneNumbers is not an array, then convert it to an array
    if (!Array.isArray(phoneNumbers)) {
      // Convert the phone number to an array with a single element
      phoneNumbers = [phoneNumbers];
    }

    phoneNumbers.forEach((phoneNumber) => {
      twilioClient.messages
        .create({
          body: "Your order has been successfully placed. Thank you by Ram Ki Ayodhya!",
          from: "+19253175855", // Replace with your Twilio phone number
          to: "+91" + phoneNumber, // Send message to each phone number in the array
        })
        .then((message) =>
          console.log(`SMS sent to ${phoneNumber}:`, message.sid)
        )
        .catch((error) =>
          console.error(`SMS sending failed to ${phoneNumber}:`, error)
        );
    });
  } else if (req.body.STATUS === "PENDING") {
    order = await Order.findOneAndUpdate(
      { orderId: req.body.ORDERID },
      {
        status: "Initiated",
        paymentInfo: JSON.stringify(req.body),
        transactionid: req.body.TXNID,
      }
    );
  }

  res.redirect("/order?clearCart=1&id=" + order._id, 200);
};

export default connectDb(handler);
