import type { ProposalLocale } from '@/lib/payments'

export type PublicTexts = {
  eyebrow: string
  title: (name: string) => string
  intro: string
  attachments: string
  download: string
  payment: string
  total: string
  deposit: (pct: number) => string
  depositHint: string
  payDeposit: (amount: string) => string
  pay: (amount: string) => string
  paid: string
  paidOn: (date: string) => string
  processing: string
  failed: string
  retry: string
  pending: string
  extraTitle: string
  secure: string
  methods: string
  successTitle: string
  successBody: string
  canceledTitle: string
  canceledBody: string
  errorTitle: string
  errorBody: string
  questions: string
  acceptedBadge: string
  noAmount: string
  legalPrivacy: string
  legalTerms: string
}

export const TEXTS: Record<ProposalLocale, PublicTexts> = {
  'pt-PT': {
    eyebrow: 'Proposta comercial',
    title: (n) => `Proposta para ${n}`,
    intro: 'Pode rever a proposta, descarregar os documentos e aceitá-la com o pagamento do sinal. Qualquer dúvida, responda ao e-mail que recebeu.',
    attachments: 'Documentos',
    download: 'Descarregar',
    payment: 'Pagamento',
    total: 'Valor total',
    deposit: (p) => `Sinal (${p}%)`,
    depositHint: 'O pagamento do sinal confirma a aceitação da proposta e reserva a data de início. O restante é faturado por fases, conforme a proposta.',
    payDeposit: (a) => `Aceitar e pagar sinal de ${a}`,
    pay: (a) => `Pagar ${a}`,
    paid: 'Pago',
    paidOn: (d) => `Pago em ${d}`,
    processing: 'Em processamento',
    failed: 'Pagamento falhou',
    retry: 'Tentar novamente',
    pending: 'Por pagar',
    extraTitle: 'Pagamentos adicionais',
    secure: 'Pagamento seguro processado pelo Stripe. Não guardamos dados de cartão.',
    methods: 'Cartão, MB WAY e Multibanco.',
    successTitle: 'Pagamento recebido. Obrigado!',
    successBody: 'Recebemos o seu pagamento e a proposta fica aceite. Entraremos em contacto nas próximas 24h úteis para arrancar.',
    canceledTitle: 'Pagamento cancelado',
    canceledBody: 'Não foi cobrado nada. Pode tentar de novo quando quiser.',
    errorTitle: 'Não foi possível iniciar o pagamento',
    errorBody: 'Tente novamente dentro de instantes ou escreva para talkto@whfdev.com.',
    questions: 'Dúvidas? Escreva para',
    acceptedBadge: 'Proposta aceite',
    noAmount: 'O valor desta proposta está nos documentos. Para avançar, responda ao e-mail.',
    legalPrivacy: 'Política de Privacidade',
    legalTerms: 'Termos e Condições',
  },
  'pt-BR': {
    eyebrow: 'Proposta comercial',
    title: (n) => `Proposta para ${n}`,
    intro: 'Você pode revisar a proposta, baixar os documentos e aceitá-la com o pagamento do sinal. Qualquer dúvida, responda ao e-mail que recebeu.',
    attachments: 'Documentos',
    download: 'Baixar',
    payment: 'Pagamento',
    total: 'Valor total',
    deposit: (p) => `Sinal (${p}%)`,
    depositHint: 'O pagamento do sinal confirma a aceitação da proposta e reserva a data de início. O restante é faturado por fases, conforme a proposta.',
    payDeposit: (a) => `Aceitar e pagar sinal de ${a}`,
    pay: (a) => `Pagar ${a}`,
    paid: 'Pago',
    paidOn: (d) => `Pago em ${d}`,
    processing: 'Em processamento',
    failed: 'Pagamento falhou',
    retry: 'Tentar novamente',
    pending: 'A pagar',
    extraTitle: 'Pagamentos adicionais',
    secure: 'Pagamento seguro processado pelo Stripe. Não guardamos dados de cartão.',
    methods: 'Cartão de crédito ou débito internacional.',
    successTitle: 'Pagamento recebido. Obrigado!',
    successBody: 'Recebemos o seu pagamento e a proposta está aceita. Entraremos em contato nas próximas 24h úteis para começar.',
    canceledTitle: 'Pagamento cancelado',
    canceledBody: 'Nada foi cobrado. Você pode tentar de novo quando quiser.',
    errorTitle: 'Não foi possível iniciar o pagamento',
    errorBody: 'Tente novamente em instantes ou escreva para talkto@whfdev.com.',
    questions: 'Dúvidas? Escreva para',
    acceptedBadge: 'Proposta aceita',
    noAmount: 'O valor desta proposta está nos documentos. Para avançar, responda ao e-mail.',
    legalPrivacy: 'Política de Privacidade',
    legalTerms: 'Termos e Condições',
  },
  en: {
    eyebrow: 'Commercial proposal',
    title: (n) => `Proposal for ${n}`,
    intro: 'Review the proposal, download the documents and accept it by paying the deposit. Any questions, just reply to the email you received.',
    attachments: 'Documents',
    download: 'Download',
    payment: 'Payment',
    total: 'Total',
    deposit: (p) => `Deposit (${p}%)`,
    depositHint: 'Paying the deposit confirms your acceptance and books the start date. The remainder is invoiced in phases, as described in the proposal.',
    payDeposit: (a) => `Accept and pay ${a} deposit`,
    pay: (a) => `Pay ${a}`,
    paid: 'Paid',
    paidOn: (d) => `Paid on ${d}`,
    processing: 'Processing',
    failed: 'Payment failed',
    retry: 'Try again',
    pending: 'Due',
    extraTitle: 'Additional payments',
    secure: 'Secure payment processed by Stripe. We never store card details.',
    methods: 'Card, Apple Pay, Google Pay, Link.',
    successTitle: 'Payment received. Thank you!',
    successBody: 'We have received your payment and the proposal is accepted. We will be in touch within one business day to kick off.',
    canceledTitle: 'Payment cancelled',
    canceledBody: 'Nothing was charged. You can try again whenever you like.',
    errorTitle: 'We could not start the payment',
    errorBody: 'Please try again in a moment or write to talkto@whfdev.com.',
    questions: 'Questions? Write to',
    acceptedBadge: 'Proposal accepted',
    noAmount: 'The amount for this proposal is in the documents. To move forward, reply to the email.',
    legalPrivacy: 'Privacy Policy',
    legalTerms: 'Terms & Conditions',
  },
  fr: {
    eyebrow: 'Proposition commerciale',
    title: (n) => `Proposition pour ${n}`,
    intro: "Consultez la proposition, téléchargez les documents et acceptez-la en réglant l'acompte. Pour toute question, répondez à l'e-mail reçu.",
    attachments: 'Documents',
    download: 'Télécharger',
    payment: 'Paiement',
    total: 'Montant total',
    deposit: (p) => `Acompte (${p}%)`,
    depositHint: "Le règlement de l'acompte confirme l'acceptation de la proposition et réserve la date de début. Le solde est facturé par phases, comme indiqué dans la proposition.",
    payDeposit: (a) => `Accepter et régler l'acompte de ${a}`,
    pay: (a) => `Régler ${a}`,
    paid: 'Réglé',
    paidOn: (d) => `Réglé le ${d}`,
    processing: 'En cours de traitement',
    failed: 'Paiement échoué',
    retry: 'Réessayer',
    pending: 'À régler',
    extraTitle: 'Paiements complémentaires',
    secure: 'Paiement sécurisé traité par Stripe. Nous ne conservons aucune donnée de carte.',
    methods: 'Carte, Apple Pay, Google Pay, Link.',
    successTitle: 'Paiement reçu. Merci !',
    successBody: 'Nous avons bien reçu votre paiement et la proposition est acceptée. Nous vous contactons sous un jour ouvré pour démarrer.',
    canceledTitle: 'Paiement annulé',
    canceledBody: "Rien n'a été débité. Vous pouvez réessayer quand vous le souhaitez.",
    errorTitle: 'Impossible de démarrer le paiement',
    errorBody: 'Réessayez dans un instant ou écrivez à talkto@whfdev.com.',
    questions: 'Des questions ? Écrivez à',
    acceptedBadge: 'Proposition acceptée',
    noAmount: "Le montant de cette proposition figure dans les documents. Pour avancer, répondez à l'e-mail.",
    legalPrivacy: 'Politique de confidentialité',
    legalTerms: 'Conditions générales',
  },
}
