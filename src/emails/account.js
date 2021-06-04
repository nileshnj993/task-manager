const mailgun = require("mailgun-js");
const domain = 'sandbox326191b2ce234551a572a5495c0247eb.mailgun.org'
const apiKey = 'd189ba7ed5da1f4f329f1f2f29685877-1d8af1f4-b16ad21b'
const mg = mailgun({apiKey,domain});

const sendWelcomeEmail = (email, name) => {
    mg.messages().send({
        to:email,
        from:'nileshnj993@gmail.com',
        subject:'Thanks for registering!',
        text:`Welcome to Task Manager, ${name}` // on using back quotes we can refer to object variables using {}
        // we can add html field to add html code in the mail
    })
}

const sendGoodbyeEmail = (email, name) =>{
    mg.messages().send({
        to:email,
        from:"nileshnj993@gmail.com",
        text:'Goodbye! It was great having you as our customer. Please provide us feedback so we can improve our services.',
        subject:'We bid farewell..'
    })
}
module.exports ={
    sendWelcomeEmail,
    sendGoodbyeEmail
} 
