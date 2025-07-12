const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports like 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send welcome email
const sendWelcomeEmail = async (email, name) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log('Email configuration not found, skipping email sending');
    return;
  }

  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Welcome to Our Platform!',
    html: `
      <h2>Welcome ${name}!</h2>
      <p>Thank you for registering with our platform. We're excited to have you on board!</p>
      <p>You can now start placing orders and managing your account.</p>
      <p>Best regards,<br>The Team</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Send order confirmation email
const sendOrderConfirmationEmail = async (email, name, order) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log('Email configuration not found, skipping email sending');
    return;
  }

  const transporter = createTransporter();

  const itemsHtml = order.items.map(item =>
    `<tr>
      <td>${item.productName}</td>
      <td>${item.quantity}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td>$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>`
  ).join('');

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Order Confirmation - ${order.orderNumber}`,
    html: `
      <h2>Order Confirmation</h2>
      <p>Hi ${name},</p>
      <p>Thank you for your order! Here are the details:</p>

      <h3>Order Number: ${order.orderNumber}</h3>
      <p>Order Date: ${order.orderDate.toLocaleDateString()}</p>

      <table border="1" cellpadding="10" cellspacing="0">
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <h3>Total Amount: $${order.totalAmount.toFixed(2)}</h3>
      <p>Payment Method: ${order.paymentMethod}</p>
      <p>Status: ${order.status}</p>

      <p>We'll send you updates about your order status.</p>
      <p>Best regards,<br>The Team</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendWelcomeEmail,
  sendOrderConfirmationEmail
};
