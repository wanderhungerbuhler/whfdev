import { ProposalForm } from '@/components/admin/ProposalForm'
import { requireAdminPage } from '@/lib/admin-guard'

export const metadata = { title: 'Nova proposta · WHFDEV Admin' }

export default async function NewProposalPage() {
  await requireAdminPage()

  return (
    <div>
      <div className="mb-8">
        <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim">
          Painel · Nova
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          Nova proposta
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-soft">
          Preenche os campos, vê o preview do PDF e do e-mail, e envia direto
          pra o cliente.
        </p>
      </div>
      <ProposalForm mode="create" />
    </div>
  )
}
