import resend from './transporter'
import crypto from 'crypto'
import user from '../model/user'

const sendVerificationMail = async (user, emailVerificationToken) => {
    const verificationUrl = `${process.env.CLIENT_URL?.replace(/\/$/, '')}/verify-email/${user._id}/${emailVerificationToken}`;
    
    const mailOptions = {
        from: 'Job-Finder <onboarding@resend.dev>',
        to: [user?.email],
        subject: "✨ Verify your email - Job-Finder",
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f7;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 40px 0;">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                                <tr>
                                    <td style="background: linear-gradient(135deg, #4F39F6 0%, #7C3AED 100%); padding: 40px 30px; text-align: center;">
                                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">dev thayour</h1>
                                        <p style="margin: 10px 0 0 0; color: #E0E7FF; font-size: 14px;">Build Your Professional Resume</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 40px 30px;">
                                        <h2 style="margin: 0 0 20px 0; color: #1F2937; font-size: 24px; font-weight: 600;">Verify Your Email Address</h2>
                                        <p style="margin: 0 0 20px 0; color: #4B5563; font-size: 16px; line-height: 1.6;">Hi <strong>${user.name}</strong>,</p>
                                        <p style="margin: 0 0 20px 0; color: #4B5563; font-size: 16px; line-height: 1.6;">Thank you for signing up! Please verify your email address to complete your registration and access all features.</p>
                                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                            <tr>
                                                <td align="center">
                                                    <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #4F39F6 0%, #7C3AED 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(79, 57, 246, 0.3);">Verify Email Address</a>
                                                </td>
                                            </tr>
                                        </table>
                                        <p style="margin: 30px 0 10px 0; color: #6B7280; font-size: 14px; line-height: 1.6;">Or copy and paste this link in your browser:</p>
                                        <p style="margin: 0; padding: 12px; background-color: #F3F4F6; border-radius: 6px; color: #4F39F6; font-size: 13px; word-break: break-all;">${verificationUrl}</p>
                                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
                                            <p style="margin: 0; color: #9CA3AF; font-size: 13px; line-height: 1.6;">⏱️ This link expires in <strong>24 hours</strong></p>
                                            <p style="margin: 10px 0 0 0; color: #9CA3AF; font-size: 13px; line-height: 1.6;">If you didn't create an account, you can safely ignore this email.</p>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="background-color: #F9FAFB; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
                                        <p style="margin: 0 0 10px 0; color: #6B7280; font-size: 14px;">Need help? Contact us at <a href="mailto:support@jobfinder.com" style="color: #4F39F6; text-decoration: none;">support@jobfinder.com</a></p>
                                        <p style="margin: 0; color: #9CA3AF; font-size: 12px;">© ${new Date().getFullYear()} Job-Finder. All rights reserved.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `
    }
    
    try {
        const { data, error } = await resend.emails.send(mailOptions);
        if (error) {
            console.error("❌ Failed to send verification email");
            console.error("Error:", error);
        } else {
            console.log("✅ Verification email sent successfully");
        }
    } catch (error) {
        console.error("❌ Exception sending verification email:", error);
    }
}


const sendWelcomeEmail = async (email, name) => {
   try {
    const dashboardUrl = `${process.env.CLIENT_URL?.replace(/\/$/, '')}/app`;
    
    const mailOptions = {
        from: 'Job-Finder <onboarding@resend.dev>',
        to: [email],
        subject: "🎉 Welcome to Job-Finder!",
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f7;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 40px 0;">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                                <tr>
                                    <td style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
                                        <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">🎉 Welcome!</h1>
                                        <p style="margin: 10px 0 0 0; color: #D1FAE5; font-size: 16px;">You're all set to build amazing resumes</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 40px 30px;">
                                        <h2 style="margin: 0 0 20px 0; color: #1F2937; font-size: 24px; font-weight: 600;">Hi ${name}! 👋</h2>
                                        <p style="margin: 0 0 20px 0; color: #4B5563; font-size: 16px; line-height: 1.6;">Your account has been successfully verified and you're ready to go!</p>
                                        <div style="background-color: #F0FDF4; border-left: 4px solid #10B981; padding: 20px; margin: 30px 0; border-radius: 6px;">
                                            <h3 style="margin: 0 0 15px 0; color: #065F46; font-size: 18px; font-weight: 600;">What you can do now:</h3>
                                            <ul style="margin: 0; padding-left: 20px; color: #047857;">
                                                <li style="margin-bottom: 10px;">✨ Create professional resumes</li>
                                                <li style="margin-bottom: 10px;">🤖 Get AI-powered suggestions</li>
                                                <li style="margin-bottom: 10px;">📄 Download in multiple formats</li>
                                                <li>🎨 Choose from beautiful templates</li>
                                            </ul>
                                        </div>
                                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                            <tr>
                                                <td align="center">
                                                    <a href="${dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);">Get Started Now</a>
                                                </td>
                                            </tr>
                                        </table>
                                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
                                            <p style="margin: 0; color: #6B7280; font-size: 14px; line-height: 1.6;">If you have any questions, feel free to reach out to our support team.</p>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="background-color: #F9FAFB; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
                                        <p style="margin: 0 0 10px 0; color: #6B7280; font-size: 14px;">Need help? Contact us at <a href="mailto:support@jobfinder.com" style="color: #10B981; text-decoration: none;">support@jobfinder.com</a></p>
                                        <p style="margin: 0; color: #9CA3AF; font-size: 12px;">© ${new Date().getFullYear()} Job-Finder. All rights reserved.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `,    
    }
    
    const { data, error } = await resend.emails.send(mailOptions);
    if (error) {
        console.error("❌ Failed to send welcome email");
        console.error("Error:", error);
    } else {
        console.log("✅ Welcome email sent successfully");
    }
   } catch (error) {
    console.error("❌ Error in sendWelcomeEmail:", error);
   }
}

export { sendVerificationMail, sendWelcomeEmail }