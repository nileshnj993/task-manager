const sgMail = require("@sendgrid/mail");
const apiKey = process.env.API_KEY
sgMail.setApiKey(apiKey)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email, 
        from: 'nileshnj993@gmail.com',
        subject:'Welcome to Task Manager!',
        text: `Welcome to the app, ${name}. Hope you have a good experience!` // ` needed so that we can inject variable names using $
    })
}

const sendGoodbyeEmail = (email,name) =>{
    sgMail.send({
        to:email,
        from:'nileshnj993@gmail.com',
        subject:'Is it too late now to say sorry?',
        text:`We are sad to see you leave the app, ${name}. Please let us know what we could have done to improve your experience!`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendGoodbyeEmail
}
