const { google } = require('googleapis');
const nodemailer = require('nodemailer');

const { oAuth2 } = google.auth;
const oauth_link = "https://developers.google.com/oauthplayground";

const { EMAIL, MAILING_ID, MAILER_REFRESH, MAILING_SECRET } = process.env;

const auth = new oAuth2(
    MAILING_ID,
    MAILING_SECRET,
    MAILER_REFRESH
);

exports.sendVerificationEmail = (email, name, url) => {
    auth.setCredentials({
        refresh_token: MAILER_REFRESH,
    });
    const accessToken = auth.getAccessToken();
    const stmp = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: EMAIL,
            clientId: MAILING_ID,
            clientSecret: MAILING_SECRET,
            refreshToken,
        },
    });
    const mailOptions = {
        from: EMAIL,
        to: email,
        subject: 'Verify your email address',
        html: `<div style="max-width:700px;margin-bottom:1rem;display:flex;align-items:center;gap:10px;font-family:Roboto;font-weight:600;color:#3b5998"><img src="/assets/images/logo.png" alt="" width="27px" height="25px"><span>Action require: Activate your FaceBook account</span></div><div style="padding:1rem 0;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;color:#141823;font-size:17px;font-family:Roboto"><span>Hello Mike</span><div style="padding:20px 0"><span style="padding:2rem 0">You recently created an account on FaceBook. To complete your registration, please confirm account.</span></div><a href="${url}" style="width:200px;padding:10px 15px;background:#4c649b;color:#fff;text-decoration:none;font-weight:600">Confirm your account</a><br><div style="padding-top:20px"><span style="margin:1.5rem 0;color:#898f9c">Facebook allows you to stay in touch with all your friends, once registered on facebook, you can share photos, organize events and much more.</span></div></div>`,
    };
    stmp.sendMail(mailOptions, (err, res) => {
        if (err) return err;
        return res;
    })
}