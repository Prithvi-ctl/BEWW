import nodemailer from "nodemailer";

function getTransporter(){
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT ?? 587);
    const user = process.env.SMTP_USER;
    const password = process.env.SMTP_PASSWORD;

    if(!host || !user || !password){
        throw new Error('SMTP_HOST,SMTP_USER and SMTP_PASSWORD are required to send email');
    }

    return nodemailer.createTransport({
        host,
        port,
        secure:port === 465,
        auth:{user,pass:password}
    });
}

export async function sendVerificationEmail(email:string,name:string,token:string){
    const frontendUrl = process.env.FRONTEND_URL ?? 'https://localhost:5173';
    const verificationUrl = `${frontendUrl}/verify-email?token=${encodeURIComponent(token)}`;

    await getTransporter().sendMail({
        from:process.env.SMTP_FROM ?? process.env.SMTP_USER,
        to:email,
        subject:"Verify your Account",
         text:`Hi ${name}, verify your Blog Account here: ${verificationUrl}`,
        html:`<p>Hi ${name},</p><p>Verify your Blog account to start blogging
        <p><a href="${verificationUrl}">Verify my account</a></p><p>expires in 1 hour</p>`
})
}