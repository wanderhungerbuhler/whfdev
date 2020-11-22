import React, { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import { Section, Forms } from '@/styles/pages/Contact';
import api from '@/services/api';

import Input from '@/components/Input';

interface FormProps {
  nome: string;
  email: string;
  empresa: string;
  assunto: string;
  descricao: string;
}

const Contact: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const router = useRouter();

  const [messageSuccess, setMessageSuccess] = useState(false);
  const [messageError, setMessageError] = useState('');

  const handleSubmit = useCallback(async (data: FormProps) =>  {

    const { nome, email, empresa, assunto, descricao } = data;

    const dataSend = {
      nome,
      email,
      empresa,
      assunto,
      descricao,
    }

    try {
      await api.post('/mail', dataSend);
      setMessageSuccess(true);
      setTimeout(() => {
        router.reload();
      }, 1500);
    } catch(err) {
      console.log(err);
      setMessageError('Erro ao enviar mensagem, tente novamente...' + err);
    }

  }, []);

  return (
    <Section id="contact">
      <Form ref={formRef} onSubmit={handleSubmit}>
        <Forms>
        <h2>Olá</h2><br />
        <div>
          <Input label="Como se chama?" name="nome"
            placeholder="Não tenha vergonha, não contaremos para ninguém :)"
            required
          />
        </div>

        <div>
          <Input label="Qual é o seu E-mail Comercial?" name="email"
            placeholder="Pode ser aquele
            que conseguimos contato rapidamente ;)"
            required />
        </div>

        <div>
          <Input label="Qual é o nome da sua Empresa?" name="empresa"
            placeholder="Atendemos desde
            o sonhador, até à empresa S.A"
            required />
        </div>

        <div>
          <Input label="Qual seria o assunto?" name="assunto"
            placeholder="Desenvolvimento de Sites, Aplicativos ou Artes Gráficas?"
            required />
        </div>

        <div>
          <Input label="Como Podemos Ajudá-lo?" name="descricao"
            placeholder="Descreva um resumo de como podemos ajudar..."
            required
          />
        </div>

        <div>
          <button type="submit">Enviar Contato</button>
          <div className="messageSend">
            { messageSuccess ? <span className="success-message">Mensagem enviada com sucesso!</span> : <span className="error-message">{messageError}</span> }
          </div>
        </div>
        </Forms>
      </Form>

      <div>
        <span>I have a dream</span>
        <cite>- Martin Luther King Jr.</cite>
      </div>
    </Section>
  );
};

export default Contact;
