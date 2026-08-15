import { Fingerprint, Zap, RotateCcw, FileText, ShieldAlert, Link2, Search } from 'lucide-react';
import BrutalButton from './ui/BrutalButton';

export default function Header({ stats, onLoadSample, onResetAll, searchQuery, onSearchChange }) {
  return (
    <header className="mb-8">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        {/* Brand Block */}
        <div className="flex items-center gap-4">
          <div className="tilted-badge bg-amber px-5 py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-navy brutal-border flex items-center justify-center">
                <Fingerprint className="w-6 h-6 text-amber" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-navy leading-none">
                  PaperTrail
                </h1>
                <p className="text-[10px] font-mono font-bold tracking-[0.15em] text-navy/70 uppercase mt-0.5">
                  Chain-of-Custody Audit Protocol
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <BrutalButton variant="amber" onClick={onLoadSample}>
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Load Sample Audit Trail
            </span>
          </BrutalButton>
          <BrutalButton variant="ghost" onClick={onResetAll}>
            <span className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset All
            </span>
          </BrutalButton>
        </div>
      </div>

      {/* Status Pills Row */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="brutal-card-static px-4 py-2.5 flex items-center gap-2 bg-white">
          <FileText className="w-4 h-4 text-navy" />
          <span className="font-mono text-xs font-bold text-navy">
            {stats.totalDocuments} REGISTERED
          </span>
        </div>
        <div className="brutal-card-static px-4 py-2.5 flex items-center gap-2 bg-white">
          <Link2 className="w-4 h-4 text-verified" />
          <span className="font-mono text-xs font-bold text-verified">
            {stats.activeChains} ACTIVE CHAINS
          </span>
        </div>
        {stats.tamperAlerts > 0 && (
          <div className="brutal-card-static px-4 py-2.5 flex items-center gap-2 bg-tampered/10 border-tampered!">
            <ShieldAlert className="w-4 h-4 text-tampered" />
            <span className="font-mono text-xs font-bold text-tampered">
              {stats.tamperAlerts} TAMPER ALERT{stats.tamperAlerts !== 1 ? 'S' : ''}
            </span>
          </div>
        )}
        <div className="brutal-card-static px-4 py-2.5 flex items-center gap-2 bg-white">
          <Fingerprint className="w-4 h-4 text-navy/60" />
          <span className="font-mono text-xs font-bold text-navy/60">
            {stats.totalCheckpoints} CHECKPOINTS
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy/40" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by Document ID, title, custodian, or stage…"
          className="brutal-input w-full pl-12 pr-4 py-3 text-sm bg-white"
        />
      </div>
    </header>
  );
}
