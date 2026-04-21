import { useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProjectTabs } from './ProjectTabs';
import { useProjectStore, type Project } from '../../stores/projectStore';

const ts = '2025-01-01T00:00:00Z';

function mk(id: string, name: string, path: string, hasAiosCore = false): Project {
  return { id, name, path, hasAiosCore, createdAt: ts, lastOpenedAt: ts };
}

const singleProject: Project[] = [mk('p-1', 'aios-core', '/aios-core', true)];

const multipleProjects: Project[] = [
  mk('p-1', 'aios-core', '/aios-core', true),
  mk('p-2', 'dashboard', '/dashboard'),
  mk('p-3', 'api-server', '/api-server'),
];

const manyProjects: Project[] = [
  ...multipleProjects,
  mk('p-4', 'mobile-app', '/mobile-app'),
  mk('p-5', 'design-system', '/design-system'),
  mk('p-6', 'docs', '/docs'),
  mk('p-7', 'infra', '/infra'),
];

function seed(projects: Project[], activeProjectId: string) {
  useProjectStore.setState({ projects, activeProjectId, loaded: true });
}

function ProjectTabsSingle() {
  useEffect(() => seed(singleProject, 'p-1'), []);
  return <ProjectTabs />;
}

function ProjectTabsMultiple() {
  useEffect(() => seed(multipleProjects, 'p-2'), []);
  return <ProjectTabs />;
}

function ProjectTabsMany() {
  useEffect(() => seed(manyProjects, 'p-3'), []);
  return <ProjectTabs />;
}

const meta: Meta<typeof ProjectTabs> = {
  title: 'Layout/ProjectTabs',
  component: ProjectTabs,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Backend-synced project tabs. Recents come from the engine; clicking switches active project (syncs to ?project= URL). The bright dot indicates a folder with `.aios-core/` detected.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: '800px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleProject: Story = { render: () => <ProjectTabsSingle /> };
export const MultipleProjects: Story = { render: () => <ProjectTabsMultiple /> };
export const ManyProjects: Story = { render: () => <ProjectTabsMany /> };
