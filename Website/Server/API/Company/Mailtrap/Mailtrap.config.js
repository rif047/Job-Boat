const { MailtrapClient } = require("mailtrap");
const { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } = require("./Mailtrap.Templetes.js");

const mailtrapClient = new MailtrapClient({
    token: process.env.MAILTRAP_TOKEN
});


const sender = {
    email: "business@jobboat.co.uk",
    name: "Job Boat",
};



const sendVerificationEmail = async (email, verificationToken) => {
    await mailtrapClient.send({
        from: sender,
        to: [{ email }],
        subject: "Verify your email",
        html: VERIFICATION_EMAIL_TEMPLATE.replace(
            "{verificationCode}",
            verificationToken
        ),
        category: "Email Verification",
    });
};



const sendWelcomeEmail = async (email, name, username, phone) => {
    await mailtrapClient.send({
        from: sender,
        to: [{ email }],
        template_uuid: "9db120d2-0773-4ab7-b3d2-2a9fe2e1f63e",
        template_variables: {
            name,
            username,
            email,
            phone,
        },
    });
};



const sendPasswordResetEmail = async (email, resetURL) => {
    await mailtrapClient.send({
        from: sender,
        to: [{ email }],
        subject: "Reset your password",
        html: PASSWORD_RESET_REQUEST_TEMPLATE.replaceAll(
            "{resetURL}",
            resetURL
        ),
        category: "Password Reset",
    });
};



const sendResetSuccessEmail = async (email) => {
    await mailtrapClient.send({
        from: sender,
        to: [{ email }],
        subject: "Password Reset Successful",
        html: PASSWORD_RESET_SUCCESS_TEMPLATE,
        category: "Password Reset",
    });
};


module.exports = { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail };