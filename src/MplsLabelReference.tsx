import { useState, useEffect } from 'react'
import { Sun, Moon, Languages, Layers } from 'lucide-react'

const translations = {
  en: {
    title: 'MPLS Label Reference',
    subtitle: 'Complete reference for MPLS labels: reserved range, header format, stack operations and Penultimate Hop Popping.',
    reservedLabels: 'Reserved Labels (0-15)',
    headerFormat: 'Label Header Format',
    stackOps: 'Label Stack Operations',
    phpExplainer: 'Penultimate Hop Popping (PHP)',
    labelStack: 'Label Stack Diagram',
    label: 'Label',
    value: 'Value',
    description: 'Description',
    bits: 'bits',
    field: 'Field',
    size: 'Size',
    purpose: 'Purpose',
    references: 'References',
    refList: ['RFC 3031 - MPLS Architecture', 'RFC 3032 - MPLS Label Stack Encoding'],
    builtBy: 'Built by',
    reservedList: [
      { value: '0', name: 'IPv4 Explicit NULL', desc: 'Signals the egress LSR to pop this label and forward based on IPv4 header. Preserves QoS (ToS) from outer label.' },
      { value: '1', name: 'Router Alert', desc: 'The packet requires special handling by the router. Analogous to IP Router Alert option. Rarely used in practice.' },
      { value: '2', name: 'IPv6 Explicit NULL', desc: 'Same as label 0 but for IPv6 traffic. Signals egress LSR to forward based on IPv6 header.' },
      { value: '3', name: 'Implicit NULL (PHP)', desc: 'Assigned by the egress LSR to signal the penultimate router to pop the label (PHP). The egress never actually pushes label 3 onto packets.' },
      { value: '4-6', name: 'Reserved (IETF)', desc: 'Reserved for future IETF use. Must not be used.' },
      { value: '7', name: 'Entropy Label Indicator (ELI)', desc: 'Marks that the next label in the stack is an Entropy Label (EL) for load balancing. RFC 6790.' },
      { value: '8-12', name: 'Reserved (IETF)', desc: 'Reserved for future IETF use. Must not be used.' },
      { value: '13', name: 'GAL (Generic Alert Label)', desc: 'Used in MPLS OAM (Operations, Administration, Maintenance). Indicates a G-ACh (Generic Associated Channel) follows. RFC 5586.' },
      { value: '14', name: 'OAM Alert', desc: 'Used for MPLS OAM alert functions. Defined in RFC 3429.' },
      { value: '15', name: 'Extension Label (XL)', desc: 'Extension label space. Used to extend the label range beyond 20 bits. RFC 7274.' },
    ],
    headerFields: [
      { field: 'Label Value', size: '20', purpose: 'The actual label value (0 to 1,048,575). Values 0-15 are reserved.' },
      { field: 'TC (Traffic Class)', size: '3', purpose: 'Formerly called EXP. Used for QoS markings (DSCP/CoS mapping). 8 possible values (0-7).' },
      { field: 'S (Bottom of Stack)', size: '1', purpose: 'Set to 1 for the bottom label in the stack, 0 for all others. Indicates when to stop popping labels.' },
      { field: 'TTL (Time to Live)', size: '8', purpose: 'Decremented at each LSR hop to prevent routing loops, analogous to IP TTL.' },
    ],
    operations: [
      { op: 'PUSH', desc: 'Add a new label to the top of the label stack (encapsulation at ingress LSR or when adding an inner label).', symbol: '+' },
      { op: 'SWAP', desc: 'Replace the top label with a new label value (normal operation at transit/P routers in the LSP).', symbol: '↔' },
      { op: 'POP', desc: 'Remove the top label from the stack (at egress LSR or at penultimate hop with PHP).', symbol: '-' },
    ],
    phpDesc: 'PHP allows the penultimate (second-to-last) LSR in an LSP to pop the top MPLS label before forwarding the packet to the egress LSR. This removes the need for the egress LSR to perform a label lookup — it receives either a bare IP packet or an inner label stack. The egress LSR signals PHP by advertising label 3 (Implicit NULL) via LDP or RSVP-TE.',
    phpSteps: [
      'Egress PE advertises label 3 (Implicit NULL) to penultimate P router',
      'Penultimate P router pops the outer label before forwarding',
      'Egress PE receives packet without the top MPLS label',
      'Egress PE does a VRF/IP lookup directly (no LFIB lookup needed)',
    ],
  },
  pt: {
    title: 'Referencia de Labels MPLS',
    subtitle: 'Referencia completa de labels MPLS: range reservado, formato do cabecalho, operacoes na pilha e Penultimate Hop Popping.',
    reservedLabels: 'Labels Reservados (0-15)',
    headerFormat: 'Formato do Cabecalho de Label',
    stackOps: 'Operacoes na Pilha de Labels',
    phpExplainer: 'Penultimate Hop Popping (PHP)',
    labelStack: 'Diagrama da Pilha de Labels',
    label: 'Label',
    value: 'Valor',
    description: 'Descricao',
    bits: 'bits',
    field: 'Campo',
    size: 'Tamanho',
    purpose: 'Proposito',
    references: 'Referencias',
    refList: ['RFC 3031 - Arquitetura MPLS', 'RFC 3032 - Codificacao da Pilha de Labels MPLS'],
    builtBy: 'Criado por',
    reservedList: [
      { value: '0', name: 'IPv4 Explicit NULL', desc: 'Sinaliza ao LSR de egresso para retirar este label e encaminhar baseado no cabecalho IPv4. Preserva QoS (ToS) do label externo.' },
      { value: '1', name: 'Router Alert', desc: 'O pacote requer tratamento especial pelo roteador. Analogo a opcao IP Router Alert. Raramente usado na pratica.' },
      { value: '2', name: 'IPv6 Explicit NULL', desc: 'Igual ao label 0 mas para trafego IPv6. Sinaliza ao LSR de egresso para encaminhar baseado no cabecalho IPv6.' },
      { value: '3', name: 'Implicit NULL (PHP)', desc: 'Atribuido pelo LSR de egresso para sinalizar ao penultimo roteador para retirar o label (PHP). O egresso nunca empilha o label 3 nos pacotes.' },
      { value: '4-6', name: 'Reservado (IETF)', desc: 'Reservado para uso futuro pelo IETF. Nao deve ser utilizado.' },
      { value: '7', name: 'Entropy Label Indicator (ELI)', desc: 'Indica que o proximo label na pilha e um Entropy Label (EL) para balanceamento de carga. RFC 6790.' },
      { value: '8-12', name: 'Reservado (IETF)', desc: 'Reservado para uso futuro pelo IETF. Nao deve ser utilizado.' },
      { value: '13', name: 'GAL (Generic Alert Label)', desc: 'Usado em OAM MPLS. Indica que um G-ACh (Generic Associated Channel) se segue. RFC 5586.' },
      { value: '14', name: 'OAM Alert', desc: 'Usado para funcoes de alerta OAM MPLS. Definido na RFC 3429.' },
      { value: '15', name: 'Extension Label (XL)', desc: 'Espaco de label de extensao. Usado para ampliar o espaco de labels alem de 20 bits. RFC 7274.' },
    ],
    headerFields: [
      { field: 'Valor do Label', size: '20', purpose: 'O valor real do label (0 a 1.048.575). Valores 0-15 sao reservados.' },
      { field: 'TC (Traffic Class)', size: '3', purpose: 'Anteriormente chamado EXP. Usado para marcacoes QoS (mapeamento DSCP/CoS). 8 valores possiveis (0-7).' },
      { field: 'S (Bottom of Stack)', size: '1', purpose: 'Definido como 1 para o label inferior da pilha, 0 para os demais. Indica quando parar de retirar labels.' },
      { field: 'TTL (Time to Live)', size: '8', purpose: 'Decrementado em cada salto LSR para evitar loops de roteamento, analogo ao IP TTL.' },
    ],
    operations: [
      { op: 'PUSH', desc: 'Adiciona um novo label ao topo da pilha (encapsulamento no LSR de ingresso ou ao adicionar um label interno).', symbol: '+' },
      { op: 'SWAP', desc: 'Substitui o label do topo por um novo valor (operacao normal em roteadores de transito/P no LSP).', symbol: '↔' },
      { op: 'POP', desc: 'Remove o label do topo da pilha (no LSR de egresso ou no penultimo salto com PHP).', symbol: '-' },
    ],
    phpDesc: 'O PHP permite que o penultimo LSR de um LSP retire o label MPLS externo antes de encaminhar o pacote ao LSR de egresso. Isso elimina a necessidade de o LSR de egresso realizar uma busca na LFIB — ele recebe um pacote IP sem label ou com apenas a pilha interna. O LSR de egresso sinaliza o PHP anunciando o label 3 (Implicit NULL) via LDP ou RSVP-TE.',
    phpSteps: [
      'PE de egresso anuncia label 3 (Implicit NULL) ao roteador P penultimo',
      'Roteador P penultimo retira o label externo antes de encaminhar',
      'PE de egresso recebe o pacote sem o label MPLS externo',
      'PE de egresso faz lookup na VRF/IP diretamente (sem busca na LFIB)',
    ],
  },
} as const

type Lang = keyof typeof translations

export default function MplsLabelReference() {
  const [lang, setLang] = useState<Lang>(() => (navigator.language.startsWith('pt') ? 'pt' : 'en'))
  const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)

  const t = translations[lang]
  useEffect(() => { document.documentElement.classList.toggle('dark', dark) }, [dark])

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors">
      <header className="border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
              <Layers size={18} className="text-white" />
            </div>
            <span className="font-semibold">MPLS Label Reference</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setLang(l => l === 'en' ? 'pt' : 'en')} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <Languages size={14} />{lang.toUpperCase()}
            </button>
            <button onClick={() => setDark(d => !d)} className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <a href="https://github.com/gmowses/mpls-label-reference" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-10">
        <div className="max-w-5xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold">{t.title}</h1>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">{t.subtitle}</p>
          </div>

          {/* Header format visual */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4">
            <h2 className="font-semibold">{t.headerFormat} (32 {t.bits} total)</h2>
            <div className="overflow-x-auto">
              <div className="flex min-w-[500px]">
                <div className="flex-[20] rounded-l-lg bg-purple-500/20 border-2 border-purple-500 text-center py-3 px-2">
                  <div className="text-xs font-bold text-purple-600 dark:text-purple-400">{t.headerFields[0].field}</div>
                  <div className="text-lg font-bold text-purple-600 dark:text-purple-400">20 {t.bits}</div>
                </div>
                <div className="flex-[3] bg-blue-500/20 border-y-2 border-blue-500 text-center py-3 px-1">
                  <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400">TC</div>
                  <div className="text-sm font-bold text-blue-600 dark:text-blue-400">3</div>
                </div>
                <div className="flex-[1] bg-green-500/20 border-y-2 border-green-500 text-center py-3 px-1">
                  <div className="text-[10px] font-bold text-green-600 dark:text-green-400">S</div>
                  <div className="text-sm font-bold text-green-600 dark:text-green-400">1</div>
                </div>
                <div className="flex-[8] rounded-r-lg bg-orange-500/20 border-2 border-orange-500 text-center py-3 px-2">
                  <div className="text-xs font-bold text-orange-600 dark:text-orange-400">TTL</div>
                  <div className="text-lg font-bold text-orange-600 dark:text-orange-400">8 {t.bits}</div>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800">
                    <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-zinc-400">{t.field}</th>
                    <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-zinc-400">{t.size}</th>
                    <th className="text-left py-2 text-xs uppercase tracking-wide text-zinc-400">{t.purpose}</th>
                  </tr>
                </thead>
                <tbody>
                  {t.headerFields.map((f, i) => (
                    <tr key={i} className="border-b border-zinc-100 dark:border-zinc-800/60">
                      <td className="py-2 pr-4 font-medium text-sm">{f.field}</td>
                      <td className="py-2 pr-4 text-sm font-mono text-purple-500">{f.size} bits</td>
                      <td className="py-2 text-sm text-zinc-500 dark:text-zinc-400">{f.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Stack diagram */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4">
            <h2 className="font-semibold">{t.labelStack}</h2>
            <div className="flex gap-8 flex-wrap items-start">
              <div className="space-y-1">
                <div className="text-xs text-zinc-400 text-center mb-2">L3VPN packet</div>
                {[
                  { label: 'VPN Label (Inner)', color: 'bg-purple-500/20 border-purple-500 text-purple-700 dark:text-purple-300', s: 'S=1' },
                  { label: 'Transport Label (Outer)', color: 'bg-blue-500/20 border-blue-500 text-blue-700 dark:text-blue-300', s: 'S=0' },
                  { label: 'IP Header', color: 'bg-zinc-200 dark:bg-zinc-700 border-zinc-400 text-zinc-600 dark:text-zinc-300', s: '' },
                  { label: 'IP Payload', color: 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 text-zinc-500', s: '' },
                ].map((item, i) => (
                  <div key={i} className={`rounded border-2 px-4 py-2 text-xs font-medium flex items-center justify-between gap-4 ${item.color}`}>
                    <span>{item.label}</span>
                    {item.s && <span className="font-mono text-[10px] opacity-70">{item.s}</span>}
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                {t.operations.map(op => (
                  <div key={op.op} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center text-white font-bold text-lg shrink-0">{op.symbol}</div>
                    <div>
                      <div className="font-bold text-sm">{op.op}</div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs">{op.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reserved labels */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4">
            <h2 className="font-semibold">{t.reservedLabels}</h2>
            <div className="space-y-2">
              {t.reservedList.map((item, i) => (
                <div key={i} className="flex gap-4 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 px-4 py-3">
                  <div className="w-12 shrink-0">
                    <span className="text-sm font-bold font-mono text-purple-500">{item.value}</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium">{item.name}</div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PHP */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4">
            <h2 className="font-semibold">{t.phpExplainer}</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{t.phpDesc}</p>
            <div className="rounded-lg bg-zinc-950 text-zinc-100 p-4 font-mono text-xs space-y-1">
              <div className="text-zinc-400"># LSP: CE-A --[Ingress PE]-- P -- [Penultimate P] -- [Egress PE] -- CE-B</div>
              <div className="mt-2">Ingress PE: PUSH label 100 (transport) + PUSH label 200 (VPN)</div>
              <div>P router:   SWAP label 100 -&gt; 101</div>
              <div>Penult. P:  POP label 101 (PHP, received label 3 from Egress PE)</div>
              <div>Egress PE:  receives only VPN label 200, does VRF lookup</div>
            </div>
            <ol className="space-y-1.5">
              {t.phpSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="w-5 h-5 rounded-full bg-purple-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  <span className="text-zinc-600 dark:text-zinc-400">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
            <h2 className="font-semibold mb-3">{t.references}</h2>
            <ul className="space-y-1">
              {t.refList.map(ref => (
                <li key={ref} className="text-sm text-zinc-500 dark:text-zinc-400 flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">•</span>{ref}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-zinc-400">
          <span>{t.builtBy} <a href="https://github.com/gmowses" className="text-zinc-600 dark:text-zinc-300 hover:text-purple-500 transition-colors">Gabriel Mowses</a></span>
          <span>MIT License</span>
        </div>
      </footer>
    </div>
  )
}
