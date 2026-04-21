import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderOpen, Folder, ChevronDown, X, Check } from 'lucide-react';
import { useProjectStore, type Project } from '../../stores/projectStore';
import { cn } from '../../lib/utils';

// ============================================================
// ActiveProjectChip — Header widget showing the anchored project
// ============================================================
// Shows the current project name + path hint, with a dropdown
// listing recent projects and an inline "Abrir outra pasta…"
// input that posts to /api/projects.

function shortPath(path: string): string {
  const parts = path.split('/').filter(Boolean);
  if (parts.length <= 2) return path;
  return `…/${parts.slice(-2).join('/')}`;
}

export function ActiveProjectChip() {
  const {
    projects,
    activeProjectId,
    loaded,
    loadRecents,
    setActiveProject,
    removeProject,
    addProject,
  } = useProjectStore();

  const [open, setOpen] = useState(false);
  const [newPath, setNewPath] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loaded) void loadRecents();
  }, [loaded, loadRecents]);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const active = projects.find((p) => p.id === activeProjectId) ?? null;

  const submitPath = async () => {
    const trimmed = newPath.trim();
    if (!trimmed || busy) return;
    setBusy(true);
    setError(null);
    const result = await addProject(trimmed);
    setBusy(false);
    if (result) {
      setNewPath('');
      setOpen(false);
    } else {
      setError('Pasta inválida — verifique o caminho');
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={active ? `Projeto ativo: ${active.name}` : 'Selecionar projeto'}
        aria-expanded={open}
        className={cn(
          'flex items-center gap-2 h-9 px-3 rounded-lg border transition-colors text-left',
          'bg-white/5 hover:bg-white/10 border-glass-border',
          active && 'border-[#D1FF00]/30'
        )}
      >
        {active?.hasAiosCore ? (
          <Folder className="h-4 w-4 text-[#D1FF00]" />
        ) : (
          <FolderOpen className="h-4 w-4 text-tertiary" />
        )}
        <span className="flex flex-col leading-tight max-w-[180px]">
          <span className="text-xs font-medium text-primary truncate">
            {active?.name ?? 'Nenhum projeto'}
          </span>
          <span className="text-[10px] text-tertiary truncate">
            {active ? shortPath(active.path) : 'Clique para abrir'}
          </span>
        </span>
        <ChevronDown className={cn('h-3.5 w-3.5 text-tertiary transition-transform', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 left-0 w-96 glass-lg rounded-xl overflow-hidden z-[999] border border-glass-border"
          >
            <div className="px-3 py-2 border-b border-glass-border">
              <p className="text-[11px] uppercase tracking-wider text-tertiary">Abrir pasta</p>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={newPath}
                  onChange={(e) => {
                    setNewPath(e.target.value);
                    setError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') void submitPath();
                    if (e.key === 'Escape') setOpen(false);
                  }}
                  placeholder="/caminho/do/projeto ou ~/proj"
                  className="flex-1 h-8 px-2 text-xs bg-white/5 border border-glass-border rounded text-primary placeholder:text-tertiary focus:outline-none focus:border-[#D1FF00]/50"
                  autoFocus
                  disabled={busy}
                />
                <button
                  onClick={() => void submitPath()}
                  disabled={busy || !newPath.trim()}
                  className="h-8 px-3 text-xs rounded bg-[#D1FF00] text-[#0a0a0a] font-medium disabled:opacity-40 hover:brightness-110"
                >
                  Abrir
                </button>
              </div>
              {error && <p className="text-[11px] text-red-400 mt-1">{error}</p>}
            </div>

            <div className="max-h-80 overflow-y-auto">
              <div className="px-3 py-2">
                <p className="text-[11px] uppercase tracking-wider text-tertiary">Recentes</p>
              </div>
              {projects.length === 0 && (
                <p className="px-3 pb-3 text-xs text-tertiary">Nenhum projeto ainda.</p>
              )}
              {projects.map((p) => (
                <RecentRow
                  key={p.id}
                  project={p}
                  isActive={p.id === activeProjectId}
                  onActivate={() => {
                    setActiveProject(p.id);
                    setOpen(false);
                  }}
                  onRemove={() => void removeProject(p.id)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RecentRow({
  project,
  isActive,
  onActivate,
  onRemove,
}: {
  project: Project;
  isActive: boolean;
  onActivate: () => void;
  onRemove: () => void;
}) {
  return (
    <div
      className={cn(
        'group flex items-center gap-2 px-3 py-2 text-xs transition-colors cursor-pointer',
        isActive ? 'bg-white/10' : 'hover:bg-white/5'
      )}
      onClick={onActivate}
    >
      {isActive ? (
        <Check className="h-3.5 w-3.5 text-[#D1FF00]" />
      ) : project.hasAiosCore ? (
        <Folder className="h-3.5 w-3.5 text-tertiary" />
      ) : (
        <FolderOpen className="h-3.5 w-3.5 text-tertiary" />
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-primary truncate">{project.name}</p>
        <p className="text-[10px] text-tertiary truncate">{project.path}</p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        aria-label={`Remover ${project.name} dos recentes`}
        className="opacity-0 group-hover:opacity-100 h-5 w-5 flex items-center justify-center rounded hover:bg-white/10 text-tertiary hover:text-primary"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
