import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from 'nodemailer';

export default (request: NextApiRequest, response: NextApiResponse) => {
  const { nome, email, assunto, empresa, descricao } = request.body;

  const user = "contato@whfdev.com.br";
  const pass = `${process.env.NEXT_PUBLIC_NODEMAILER_PASS}`;

  const transporter = nodemailer.createTransport({
    host: "mail.whfdev.com.br",
    port: 465,
    auth: { user, pass }
  });

  transporter.sendMail({
    from: `"${nome}" <${email}>`,
    to: user,
    subject: `${assunto}`,
    text: 'Empresa:' + `${empresa}\n\n` + 'Assunto:\n' + `${descricao}`

  }).then(info => {
    response.send(info);
  }).catch(err => {
    response.send(err);
  });
}
