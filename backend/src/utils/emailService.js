const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nguyenhuutruongchatgpt@gmail.com',
    pass: 'jbee qhxa hitr nqyv', // App Password provided by user
  },
});

exports.sendOTP = async (email, otp) => {
  const mailOptions = {
    from: '"TCrypto Support" <nguyenhuutruongchatgpt@gmail.com>',
    to: email,
    subject: 'TCrypto - Mã xác minh khôi phục mật khẩu',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #F0B90B;">TCrypto</h2>
        </div>
        <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          <h3 style="color: #333; margin-top: 0;">Mã xác minh của bạn</h3>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">Chào bạn,</p>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">Chúng tôi nhận được yêu cầu khôi phục mật khẩu cho tài khoản TCrypto của bạn. Vui lòng sử dụng mã xác minh dưới đây để tiếp tục:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #F0B90B; letter-spacing: 5px; background: #fff9e6; padding: 10px 20px; border-radius: 5px; border: 1px dashed #F0B90B;">
              ${otp}
            </span>
          </div>
          <p style="color: #666; font-size: 14px; line-height: 1.5;">Mã này sẽ hết hạn sau <strong>10 phút</strong>. Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.</p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>&copy; 2026 TCrypto. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};
