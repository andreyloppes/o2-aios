import { create } from 'zustand';

// ============================================================
// Project store — backend-synced recents + active project
// ============================================================
// The dashboard anchors all squad/workflow/terminal execution to
// whichever project is active. Recents come from the engine
// (SQLite-backed), selection is reflected in the ?project= URL
// param so deep-links and `o2-aios open <path>` work.

export interface Project {
  id: string;
  /** Display name (basename by default) */
  name: string;
  /** Absolute filesystem path */
  path: string;
  /** True when `.aios-core/` exists inside */
  hasAiosCore: boolean;
  createdAt: string;
  lastOpenedAt: string;
}

interface ProjectApiDto {
  id: string;
  path: string;
  label: string;
  hasAiosCore: boolean;
  createdAt: string | null;
  lastOpenedAt: string | null;
}

interface ProjectState {
  projects: Project[];
  activeProjectId: string | null;
  loaded: boolean;
  loading: boolean;
  error: string | null;

  loadRecents: () => Promise<void>;
  /** Register a folder (or touch existing). Returns the project or null on failure. */
  addProject: (path: string, label?: string) => Promise<Project | null>;
  /** Pick an existing recent as active. */
  setActiveProject: (id: string) => void;
  /** Remove from recents (engine DB). */
  removeProject: (id: string) => Promise<void>;
  /** Reorder locally (display-only; server order is by last_opened_at). */
  reorderProjects: (from: number, to: number) => void;
  /** Compatibility helper — resolves active Project (or null). */
  getActive: () => Project | null;
}

function dtoToProject(dto: ProjectApiDto): Project {
  const now = new Date().toISOString();
  return {
    id: dto.id,
    name: dto.label,
    path: dto.path,
    hasAiosCore: dto.hasAiosCore,
    createdAt: dto.createdAt ?? now,
    lastOpenedAt: dto.lastOpenedAt ?? now,
  };
}

function syncUrl(project: Project | null) {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  if (project) url.searchParams.set('project', project.path);
  else url.searchParams.delete('project');
  window.history.replaceState({}, '', url.toString());
}

export const useProjectStore = create<ProjectState>()((set, get) => ({
  projects: [],
  activeProjectId: null,
  loaded: false,
  loading: false,
  error: null,

  loadRecents: async () => {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error(`GET /api/projects -> ${res.status}`);
      const data = (await res.json()) as { projects: ProjectApiDto[] };
      const projects = data.projects.map(dtoToProject);

      // Resolve active: ?project= query param > first recent
      const urlParam = new URLSearchParams(window.location.search).get('project');
      let activeId = get().activeProjectId;
      if (urlParam) {
        const match = projects.find((p) => p.path === urlParam);
        if (match) {
          activeId = match.id;
        } else {
          // URL refers to unknown path — try registering it
          const registered = await registerProject(urlParam);
          if (registered) {
            projects.unshift(registered);
            activeId = registered.id;
          }
        }
      }
      if (!activeId && projects.length > 0) activeId = projects[0].id;

      set({ projects, activeProjectId: activeId, loaded: true, loading: false });
      const active = projects.find((p) => p.id === activeId) ?? null;
      syncUrl(active);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load projects';
      set({ loading: false, error: message });
    }
  },

  addProject: async (path, label) => {
    const project = await registerProject(path, label);
    if (!project) return null;
    set((state) => {
      const without = state.projects.filter((p) => p.id !== project.id);
      return {
        projects: [project, ...without],
        activeProjectId: project.id,
      };
    });
    syncUrl(project);
    return project;
  },

  setActiveProject: (id) => {
    const project = get().projects.find((p) => p.id === id) ?? null;
    set({ activeProjectId: id });
    if (project) {
      syncUrl(project);
      // fire-and-forget touch
      fetch(`/api/projects/${id}/touch`, { method: 'POST' }).catch(() => {});
    }
  },

  removeProject: async (id) => {
    await fetch(`/api/projects/${id}`, { method: 'DELETE' }).catch(() => {});
    set((state) => {
      const projects = state.projects.filter((p) => p.id !== id);
      const activeProjectId =
        state.activeProjectId === id
          ? projects[0]?.id ?? null
          : state.activeProjectId;
      const active = projects.find((p) => p.id === activeProjectId) ?? null;
      syncUrl(active);
      return { projects, activeProjectId };
    });
  },

  reorderProjects: (from, to) => {
    set((state) => {
      const updated = [...state.projects];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      return { projects: updated };
    });
  },

  getActive: () => {
    const { projects, activeProjectId } = get();
    return projects.find((p) => p.id === activeProjectId) ?? null;
  },
}));

async function registerProject(path: string, label?: string): Promise<Project | null> {
  try {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, label }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.warn('registerProject failed', res.status, body);
      return null;
    }
    const data = (await res.json()) as { project: ProjectApiDto };
    return dtoToProject(data.project);
  } catch (err) {
    console.warn('registerProject error', err);
    return null;
  }
}

/** Convenience selector hook — returns active Project or null. */
export function useActiveProject(): Project | null {
  return useProjectStore((s) =>
    s.projects.find((p) => p.id === s.activeProjectId) ?? null
  );
}
