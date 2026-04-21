import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useProjectStore } from '../projectStore';

type FetchMock = ReturnType<typeof vi.fn>;

function mockJsonResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
    text: async () => JSON.stringify(body),
  } as Response;
}

const originalFetch = global.fetch;
const originalHistoryReplace = window.history.replaceState.bind(window.history);

function resetStore() {
  useProjectStore.setState({
    projects: [],
    activeProjectId: null,
    loaded: false,
    loading: false,
    error: null,
  });
}

describe('projectStore', () => {
  beforeEach(() => {
    resetStore();
    window.history.replaceState = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    window.history.replaceState = originalHistoryReplace;
  });

  it('loadRecents populates projects from /api/projects and sets first as active', async () => {
    const fetchMock: FetchMock = vi.fn().mockResolvedValue(
      mockJsonResponse({
        projects: [
          {
            id: 'p1',
            path: '/work/a',
            label: 'a',
            hasAiosCore: true,
            createdAt: '2025-01-01',
            lastOpenedAt: '2025-01-02',
          },
          {
            id: 'p2',
            path: '/work/b',
            label: 'b',
            hasAiosCore: false,
            createdAt: '2025-01-01',
            lastOpenedAt: '2025-01-01',
          },
        ],
      })
    );
    global.fetch = fetchMock as unknown as typeof fetch;

    await useProjectStore.getState().loadRecents();

    const state = useProjectStore.getState();
    expect(state.projects).toHaveLength(2);
    expect(state.projects[0].path).toBe('/work/a');
    expect(state.projects[0].hasAiosCore).toBe(true);
    expect(state.activeProjectId).toBe('p1');
    expect(state.loaded).toBe(true);
  });

  it('addProject posts to backend and prepends on success', async () => {
    global.fetch = vi.fn().mockResolvedValue(
      mockJsonResponse(
        {
          project: {
            id: 'p-new',
            path: '/new',
            label: 'new',
            hasAiosCore: false,
            createdAt: '2025-01-01',
            lastOpenedAt: '2025-01-01',
          },
        },
        201
      )
    ) as unknown as typeof fetch;

    const result = await useProjectStore.getState().addProject('/new');
    expect(result?.id).toBe('p-new');

    const state = useProjectStore.getState();
    expect(state.projects[0].id).toBe('p-new');
    expect(state.activeProjectId).toBe('p-new');
  });

  it('addProject returns null and leaves store untouched when backend rejects', async () => {
    global.fetch = vi.fn().mockResolvedValue(
      mockJsonResponse({ error: 'bad path' }, 400)
    ) as unknown as typeof fetch;

    const before = useProjectStore.getState().projects.length;
    const result = await useProjectStore.getState().addProject('/bad');
    expect(result).toBeNull();
    expect(useProjectStore.getState().projects.length).toBe(before);
  });

  it('setActiveProject updates id and fires touch request', () => {
    useProjectStore.setState({
      projects: [
        {
          id: 'p1',
          name: 'a',
          path: '/a',
          hasAiosCore: false,
          createdAt: '2025-01-01',
          lastOpenedAt: '2025-01-01',
        },
        {
          id: 'p2',
          name: 'b',
          path: '/b',
          hasAiosCore: false,
          createdAt: '2025-01-01',
          lastOpenedAt: '2025-01-01',
        },
      ],
      activeProjectId: 'p1',
      loaded: true,
    });

    const fetchMock = vi.fn().mockResolvedValue(mockJsonResponse({}, 200));
    global.fetch = fetchMock as unknown as typeof fetch;

    useProjectStore.getState().setActiveProject('p2');
    expect(useProjectStore.getState().activeProjectId).toBe('p2');
    expect(fetchMock).toHaveBeenCalledWith('/api/projects/p2/touch', expect.anything());
  });

  it('removeProject deletes from backend and selects next', async () => {
    useProjectStore.setState({
      projects: [
        {
          id: 'p1',
          name: 'a',
          path: '/a',
          hasAiosCore: false,
          createdAt: '2025-01-01',
          lastOpenedAt: '2025-01-01',
        },
        {
          id: 'p2',
          name: 'b',
          path: '/b',
          hasAiosCore: false,
          createdAt: '2025-01-01',
          lastOpenedAt: '2025-01-01',
        },
      ],
      activeProjectId: 'p1',
      loaded: true,
    });

    global.fetch = vi.fn().mockResolvedValue(mockJsonResponse({ ok: true })) as unknown as typeof fetch;

    await useProjectStore.getState().removeProject('p1');
    const state = useProjectStore.getState();
    expect(state.projects).toHaveLength(1);
    expect(state.activeProjectId).toBe('p2');
  });
});
