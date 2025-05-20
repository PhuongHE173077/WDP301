export const FormMail = (webName, webUrl, email, password, id, dueTime) => {
  return `
    <div style="font-family: 'Arial', sans-serif; border: 1px solid #e0e0e0; border-radius: 8px; padding: 30px; max-width: 500px; margin: 40px auto; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05); background-color: #f9f9f9;">
      <h2 style="color: #333; text-align: center; margin-bottom: 25px; font-weight: 600;">
        <span style="color: #007bff;">${webName}</span> - Account Verification
      </h2>

      <p style="font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 20px;">
        Welcome to <span style="font-weight: bold; color: #007bff;">${webName}</span>! We've created a new account for you. Please verify your email address to complete the registration.
      </p>

      <div style="background-color: #f0f8ff; padding: 20px; border-radius: 6px; margin-bottom: 25px; border: 1px solid #b0c4de;">
        <p style="font-size: 14px; color: #444; margin-bottom: 10px;">
          <strong>Email:</strong> ${email}
        </p>
        <p style="font-size: 14px; color: #444; margin-bottom: 10px;">
          <strong>Password:</strong> ${password}
        </p>
        <p style="font-size: 14px; color: #444; margin-bottom: 10px;">
          <strong>User ID:</strong> ${id}
        </p>
        <p style="font-size: 14px; color: #444;">
          <strong>Verification Link Expires:</strong> ${dueTime}
        </p>
      </div>

      <div style="text-align: center; margin-bottom: 25px;">
        <a href="${webUrl}" style="background-color: #007bff; color: white; padding: 12px 25px; border-radius: 6px; text-decoration: none; font-size: 16px; font-weight: 600; display: inline-block; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          Verify Account
        </a>
      </div>

      <p style="font-size: 14px; color: #777; line-height: 1.5; text-align: center;">
        If you didn't request this verification, please ignore this email. This link will expire after ${dueTime}.
      </p>

      <p style="font-size: 14px; color: #555; text-align: center; margin-top: 30px;">
        Thank you,<br>The <span style="font-weight: bold; color: #007bff;">${webName}</span> Team
      </p>
    </div>
  `;
};
