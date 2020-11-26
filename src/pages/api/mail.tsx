import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from 'nodemailer';

export default (request: NextApiRequest, response: NextApiResponse) => {
  const { nome, email, assunto, empresa, descricao } = request.body;

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER,
    port: 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS}
  });

  transporter.sendMail({
    from: `"${nome}" <${email}>`,
    to: process.env.EMAIL_USER,
    subject: `${assunto}`,
    text: 'Empresa:' + `${empresa}\n\n` + 'Assunto:\n' + `${descricao}`

  }).then(info => {
    response.send(info);
  }).catch(err => {
    response.send(err);
  });
}
