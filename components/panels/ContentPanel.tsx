import Card from '@/components/ui/Card'
import SectionTitle from '@/components/ui/SectionTitle'

const steps = [
  'Account Preparation Basics',
  'Environment Verification',
  'Configure Sui Client',
  'Fork Git Repository and Clone',
  'Manage Gas & Publishing of Package',
  'Object Deployment & Personal Portfolio Setup',
  'Run Frontend',
  'Push Changes to GitHub Repository',
  'Frontend Deployment (Vercel)',
  'Hackathon Announcements + Optional Advanced Exercises',
]

export default function ContentPanel() {
  const half = Math.ceil(steps.length / 2)
  return (
    <div className="animate-fade-in">
      <div className="bg-[rgba(255,181,71,0.06)] border border-[rgba(255,181,71,0.25)] rounded-lg p-[11px_14px] text-[12px] text-[#7A8BA8] leading-[1.7] mb-4">
        <strong className="text-[#FFB547]">⚠ Content Update in Progress:</strong> Mike and Lady are updating the code camp content, installation guide, and installation procedures based on Letran pilot learnings. All chapters must use the updated version — do <strong className="text-[#FF4D6A]">NOT</strong> use pre-Manila materials.
      </div>

      <SectionTitle>10-Step Code Camp Program (All Chapters)</SectionTitle>
      <div className="bg-[rgba(77,162,255,0.06)] border border-[rgba(77,162,255,0.2)] rounded-lg p-[11px_14px] text-[12px] text-[#7A8BA8] leading-[1.7] mb-4">
        <strong className="text-[#4DA2FF]">Student Deliverable:</strong> Vercel app + Sui mainnet object deployed (Level 1 folio) &nbsp;·&nbsp;{' '}
        <strong className="text-[#4DA2FF]">Completion Proof:</strong> Exercise Completion Form → Sui Foundation Q2 reporting
      </div>

      <div className="grid grid-cols-2 gap-[14px] mb-5 max-[640px]:grid-cols-1">
        <Card>
          <div className="flex flex-col gap-[9px]">
            {steps.slice(0, half).map((step, i) => (
              <div key={i} className="flex items-center gap-[11px] py-1.5 border-b border-[rgba(77,162,255,0.06)] last:border-b-0">
                <div className="w-6 h-6 rounded-full bg-[rgba(77,162,255,0.12)] border border-[rgba(77,162,255,0.3)] flex items-center justify-center font-mono text-[10px] font-bold text-[#4DA2FF] flex-shrink-0">
                  {i + 1}
                </div>
                <div className="text-[12px] font-bold text-[#E8F0FF]">{step}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div className="flex flex-col gap-[9px]">
            {steps.slice(half).map((step, i) => (
              <div key={i} className="flex items-center gap-[11px] py-1.5 border-b border-[rgba(77,162,255,0.06)] last:border-b-0">
                <div className="w-6 h-6 rounded-full bg-[rgba(77,162,255,0.12)] border border-[rgba(77,162,255,0.3)] flex items-center justify-center font-mono text-[10px] font-bold text-[#4DA2FF] flex-shrink-0">
                  {half + i + 1}
                </div>
                <div className="text-[12px] font-bold text-[#E8F0FF]">{step}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <SectionTitle>Troubleshooting — 403 Forbidden Error on Sui Install</SectionTitle>
      <Card className="mb-5">
        <pre className="font-mono text-[11px] text-[#00D4AA] leading-[2] overflow-x-auto whitespace-pre-wrap break-all">{`wget https://github.com/MystenLabs/sui/releases/download/testnet-v1.44.2/sui-testnet-v1.44.2-ubuntu-x86_64.tgz
tar -xvf sui-testnet-v1.44.2-ubuntu-x86_64.tgz
chmod +x sui
sudo mv sui /usr/local/bin/
sui --version`}</pre>
        <div className="mt-2.5 p-[9px_12px] bg-[rgba(0,212,170,0.06)] border border-[rgba(0,212,170,0.2)] rounded-md text-[11px] text-[#7A8BA8]">
          💡 <strong className="text-[#00D4AA]">Offline Install:</strong> Use USB thumb drives with zipped Sui binaries for restricted WiFi labs.
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-[14px] max-[640px]:grid-cols-1">
        <Card>
          <div className="text-[12px] font-bold mb-2.5 text-[#E8F0FF]">Post-Event SITREP Template</div>
          <pre className="text-[10px] text-[#7A8BA8] font-mono leading-[2] whitespace-pre-wrap">{`EVENT SITREP — [Chapter Name]
Date: [event date]
Lead: [name]
Actual pax: [number] (target: [number])
Session: [Part 1 only / Part 1 + Dinner]
Key outcomes: [projects, DeepSurge, moments]
BIR invoices: [collected / pending]
Liquidation: [submitted / pending by date]
Issues: [list or NONE]`}</pre>
        </Card>
        <Card>
          <div className="text-[12px] font-bold mb-2.5 text-[#E8F0FF]">Ocular Report Template</div>
          <pre className="text-[10px] text-[#7A8BA8] font-mono leading-[2] whitespace-pre-wrap">{`OCULAR REPORT — [Chapter Name]
Date: [date] · Lead: [name]
Venue: [venue name]
Labs: [number] labs, [number] machines each
Network: [stable / restricted / TBC]
IT admin contact: [name]
School org contact: [name]
Roadblocks found: [list or NONE]
Installation start date: [date]`}</pre>
        </Card>
      </div>
    </div>
  )
}
