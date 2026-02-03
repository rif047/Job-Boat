export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - JobBoat</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f5f5f5; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #00ba7b 0%, #009a67 100%); padding: 24px 30px; text-align: center; border-bottom: 3px solid #008f5d;">
              <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 600; letter-spacing: 0.5px;">JobBoat</h1>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 35px 35px 30px;">
              <h2 style="color: #2d3748; font-size: 20px; font-weight: 600; margin: 0 0 20px; text-align: center;">Email Verification Required</h2>
              
              <p style="color: #4a5568; font-size: 15px; line-height: 1.5; margin: 0 0 20px;">
                Thank you for registering with JobBoat. Please use the verification code below to complete your registration.
              </p>
              
              <!-- Verification Code Box -->
              <div style="background-color: #f8fffe; border: 2px solid #00ba7b; border-radius: 6px; padding: 20px; text-align: center; margin: 0 0 20px;">
                <p style="color: #718096; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 10px;">Verification Code</p>
                <div style="font-size: 36px; font-weight: 700; letter-spacing: 6px; color: #00ba7b; font-family: 'Courier New', monospace; margin: 0;">{verificationCode}</div>
              </div>
              
              <p style="color: #4a5568; font-size: 14px; line-height: 1.5; margin: 0 0 15px;">
                Enter this code on the verification page to activate your account. This code expires in <strong>15 minutes</strong>.
              </p>
              
              <p style="color: #718096; font-size: 13px; line-height: 1.5; margin: 0 0 20px; padding-top: 15px; border-top: 1px solid #e2e8f0;">
                If you did not create an account with JobBoat, please disregard this email.
              </p>
              
              <p style="color: #2d3748; font-size: 14px; margin: 0;">
                Regards,<br>
                <strong>JobBoat Team</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px 35px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #718096; font-size: 12px; line-height: 1.4; margin: 0 0 8px;">
                <a href="https://jobboat.co.uk/" style="color: #00ba7b; text-decoration: none; font-weight: 500;">www.jobboat.co.uk</a> | <a href="mailto:business@jobboat.co.uk" style="color: #00ba7b; text-decoration: none;">business@jobboat.co.uk</a>
              </p>
              <p style="color: #a0aec0; font-size: 11px; margin: 0;">
                © JobBoat. All rights reserved. This is an automated message.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset - JobBoat</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f5f5f5; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #00ba7b 0%, #009a67 100%); padding: 24px 30px; text-align: center; border-bottom: 3px solid #008f5d;">
              <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 600; letter-spacing: 0.5px;">JobBoat</h1>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 35px 35px 30px;">
              <h2 style="color: #2d3748; font-size: 20px; font-weight: 600; margin: 0 0 20px; text-align: center;">Password Reset Request</h2>
              
              <p style="color: #4a5568; font-size: 15px; line-height: 1.5; margin: 0 0 20px;">
                We have received a request to reset your JobBoat account password. Click the button below to proceed.
              </p>
              
              <!-- Reset Button -->
              <div style="text-align: center; margin: 0 0 20px;">
                <a href="{resetURL}" style="display: inline-block; background: linear-gradient(135deg, #00ba7b 0%, #009a67 100%); color: #ffffff; text-decoration: none; padding: 14px 35px; border-radius: 5px; font-size: 15px; font-weight: 600; box-shadow: 0 2px 8px rgba(0,186,123,0.25);">
                  Reset Password
                </a>
              </div>
              
              <p style="color: #718096; font-size: 13px; line-height: 1.4; margin: 0 0 15px; text-align: center;">
                Or copy and paste this URL into your browser:
              </p>
              
              <div style="background-color: #f8f9fa; border: 1px solid #e2e8f0; border-radius: 4px; padding: 12px; word-break: break-all; margin: 0 0 20px;">
                <p style="color: #4a5568; font-size: 12px; margin: 0; font-family: 'Courier New', monospace;">
                  {resetURL}
                </p>
              </div>
              
              <!-- Warning Box -->
              <div style="background-color: #fff8f0; border-left: 3px solid #f59e0b; padding: 12px 16px; border-radius: 4px; margin: 0 0 20px;">
                <p style="color: #92400e; font-size: 13px; line-height: 1.4; margin: 0;">
                  <strong>Important:</strong> This link expires in 1 hour. If you did not request this reset, please ignore this email.
                </p>
              </div>
              
              <p style="color: #2d3748; font-size: 14px; margin: 0;">
                Regards,<br>
                <strong>JobBoat Team</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px 35px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #718096; font-size: 12px; line-height: 1.4; margin: 0 0 8px;">
                <a href="https://jobboat.co.uk/" style="color: #00ba7b; text-decoration: none; font-weight: 500;">www.jobboat.co.uk</a> | <a href="mailto:business@jobboat.co.uk" style="color: #00ba7b; text-decoration: none;">business@jobboat.co.uk</a>
              </p>
              <p style="color: #a0aec0; font-size: 11px; margin: 0;">
                © JobBoat. All rights reserved. This is an automated message.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful - JobBoat</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f5f5f5; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #00ba7b 0%, #009a67 100%); padding: 24px 30px; text-align: center; border-bottom: 3px solid #008f5d;">
              <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 600; letter-spacing: 0.5px;">JobBoat</h1>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 35px 35px 30px;">
              <!-- Success Icon -->
              <div style="text-align: center; margin: 0 0 20px;">
                <div style="display: inline-block; background: linear-gradient(135deg, #00ba7b 0%, #009a67 100%); width: 60px; height: 60px; border-radius: 50%; line-height: 60px; box-shadow: 0 4px 12px rgba(0,186,123,0.3);">
                  <span style="color: #ffffff; font-size: 32px; font-weight: 600;">✓</span>
                </div>
              </div>
              
              <h2 style="color: #2d3748; font-size: 20px; font-weight: 600; margin: 0 0 20px; text-align: center;">Password Successfully Reset</h2>
              
              <p style="color: #4a5568; font-size: 15px; line-height: 1.5; margin: 0 0 20px;">
                Your JobBoat account password has been successfully updated. You may now log in using your new credentials.
              </p>
              
              <!-- Success Box -->
              <div style="background-color: #f0fdf9; border-left: 3px solid #00ba7b; padding: 12px 16px; border-radius: 4px; margin: 0 0 20px;">
                <p style="color: #065f46; font-size: 13px; line-height: 1.4; margin: 0;">
                  <strong>Confirmed:</strong> Your password change has been processed and is now active.
                </p>
              </div>
              
              <!-- Security Alert -->
              <div style="background-color: #fff8f0; border-left: 3px solid #f59e0b; padding: 12px 16px; border-radius: 4px; margin: 0 0 20px;">
                <p style="color: #92400e; font-size: 13px; line-height: 1.4; margin: 0;">
                  <strong>Security Notice:</strong> If you did not initiate this change, please contact business@jobboat.co.uk immediately.
                </p>
              </div>
              
              <!-- Security Tips -->
              <div style="background-color: #f8f9fa; border-radius: 4px; padding: 16px; margin: 0 0 20px;">
                <h3 style="color: #2d3748; font-size: 14px; font-weight: 600; margin: 0 0 10px;">
                  Security Recommendations:
                </h3>
                <ul style="color: #4a5568; font-size: 13px; line-height: 1.6; margin: 0; padding-left: 18px;">
                  <li>Use unique passwords for each online service</li>
                  <li>Enable two-factor authentication when available</li>
                  <li>Update passwords regularly every 90 days</li>
                  <li>Never share your password with anyone</li>
                </ul>
              </div>
              
              <p style="color: #2d3748; font-size: 14px; margin: 0;">
                Regards,<br>
                <strong>JobBoat Team</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px 35px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #718096; font-size: 12px; line-height: 1.4; margin: 0 0 8px;">
                <a href="https://jobboat.co.uk/" style="color: #00ba7b; text-decoration: none; font-weight: 500;">www.jobboat.co.uk</a> | <a href="mailto:business@jobboat.co.uk" style="color: #00ba7b; text-decoration: none;">business@jobboat.co.uk</a>
              </p>
              <p style="color: #a0aec0; font-size: 11px; margin: 0;">
                © JobBoat. All rights reserved. This is an automated message.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to JobBoat</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f5f5f5; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #00ba7b 0%, #009a67 100%); padding: 24px 30px; text-align: center; border-bottom: 3px solid #008f5d;">
              <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 600; letter-spacing: 0.5px;">JobBoat</h1>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 35px 35px 30px;">
              <h2 style="color: #2d3748; font-size: 20px; font-weight: 600; margin: 0 0 20px; text-align: center;">Welcome to JobBoat</h2>
              
              <p style="color: #4a5568; font-size: 15px; line-height: 1.5; margin: 0 0 20px;">Dear {userName},</p>
              
              <p style="color: #4a5568; font-size: 15px; line-height: 1.5; margin: 0 0 20px;">
                Your JobBoat account has been successfully activated. We are pleased to business you in your professional career development.
              </p>
              
              <!-- Getting Started Section -->
              <div style="background-color: #f0fdf9; border-radius: 4px; padding: 16px; margin: 0 0 20px;">
                <h3 style="color: #065f46; font-size: 15px; font-weight: 600; margin: 0 0 10px;">
                  Getting Started:
                </h3>
                <ol style="color: #065f46; font-size: 13px; line-height: 1.6; margin: 0; padding-left: 18px;">
                  <li>Complete your professional profile</li>
                  <li>Set your job search preferences</li>
                  <li>Browse and apply for opportunities</li>
                </ol>
              </div>
              
              <p style="color: #4a5568; font-size: 14px; line-height: 1.5; margin: 0 0 20px;">
                Our platform connects you with relevant employment opportunities. Should you require assistance, our business team is available to help.
              </p>
              
              <p style="color: #2d3748; font-size: 14px; margin: 0;">
                Regards,<br>
                <strong>JobBoat Team</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px 35px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #718096; font-size: 12px; line-height: 1.4; margin: 0 0 8px;">
                <a href="https://jobboat.co.uk/" style="color: #00ba7b; text-decoration: none; font-weight: 500;">www.jobboat.co.uk</a> | <a href="mailto:business@jobboat.co.uk" style="color: #00ba7b; text-decoration: none;">business@jobboat.co.uk</a>
              </p>
              <p style="color: #a0aec0; font-size: 11px; margin: 0;">
                © JobBoat. All rights reserved. This is an automated message.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;