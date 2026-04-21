import { useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, X, FolderOpen } from 'lucide-react';
import { ContextMenu } from '../ui';
import { useProjectStore, type Project } from '../../stores/projectStore';
import { cn } from '../../lib/utils';

export function ProjectTabs() {
  const {
    projects,
    activeProjectId,
    loaded,
    loadRecents,
    setActiveProject,
    removeProject,
    reorderProjects,
    addProject,
  } = useProjectStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newPath, setNewPath] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loaded) void loadRecents();
  }, [loaded, loadRecents]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = projects.findIndex((p) => p.id === active.id);
    const newIndex = projects.findIndex((p) => p.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      reorderProjects(oldIndex, newIndex);
    }
  };

  const handleAddProject = async () => {
    const trimmed = newPath.trim();
    if (!trimmed || busy) return;
    setBusy(true);
    const result = await addProject(trimmed);
    setBusy(false);
    if (result) {
      setNewPath('');
      setIsAdding(false);
    } else {
      // keep input open so user can fix the path
    }
  };

  const handleAddKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      void handleAddProject();
    } else if (e.key === 'Escape') {
      setNewPath('');
      setIsAdding(false);
    }
  };

  return (
    <div
      className={cn(
        'h-9 flex items-center gap-0',
        'glass-subtle border-b border-glass-border',
        'overflow-x-auto scrollbar-hidden'
      )}
      role="toolbar"
      aria-label="Project tabs"
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={projects.map((p) => p.id)}
          strategy={horizontalListSortingStrategy}
        >
          {projects.map((project) => (
            <SortableTab
              key={project.id}
              project={project}
              isActive={project.id === activeProjectId}
              canClose
              onActivate={() => setActiveProject(project.id)}
              onClose={() => void removeProject(project.id)}
              totalTabs={projects.length}
            />
          ))}
        </SortableContext>
      </DndContext>

      {projects.length === 0 && loaded && !isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 px-3 h-9 text-xs text-tertiary hover:text-secondary"
        >
          <FolderOpen className="h-3.5 w-3.5" />
          <span>Abrir projeto…</span>
        </button>
      )}

      {/* Add project */}
      {isAdding ? (
        <div className="flex items-center px-1">
          <input
            type="text"
            value={newPath}
            onChange={(e) => setNewPath(e.target.value)}
            onKeyDown={handleAddKeyDown}
            onBlur={() => {
              if (!newPath.trim()) setIsAdding(false);
            }}
            autoFocus
            placeholder="/caminho/do/projeto"
            className="h-6 w-64 px-2 text-xs bg-white/5 border border-glass-border rounded text-primary placeholder:text-tertiary focus:outline-none focus:border-blue-500/50"
            aria-label="Caminho do projeto"
            disabled={busy}
          />
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="flex-shrink-0 h-9 w-8 flex items-center justify-center text-tertiary hover:text-secondary hover:bg-white/5 transition-colors"
          aria-label="Adicionar projeto"
          title="Adicionar projeto"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

interface SortableTabProps {
  project: Project;
  isActive: boolean;
  canClose: boolean;
  onActivate: () => void;
  onClose: () => void;
  totalTabs: number;
}

function SortableTab({
  project,
  isActive,
  canClose,
  onActivate,
  onClose,
  totalTabs,
}: SortableTabProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const contextMenuItems = [
    {
      label: 'Fechar',
      onClick: onClose,
      disabled: !canClose,
    },
    {
      label: 'Copiar caminho',
      onClick: () => {
        navigator.clipboard?.writeText(project.path).catch(() => {});
      },
      disabled: false,
    },
    {
      label: totalTabs > 1 ? 'Fechar outros' : 'Fechar outros',
      onClick: () => {},
      disabled: totalTabs <= 1,
      separator: false,
    },
  ];

  return (
    <ContextMenu items={contextMenuItems}>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        role="presentation"
        title={project.path}
        className={cn(
          'group relative flex items-center h-9 text-xs',
          'transition-colors duration-150 select-none flex-shrink-0',
          'border-r border-glass-border',
          isDragging && 'opacity-50 z-10',
          isActive
            ? 'text-primary bg-white/5'
            : 'text-tertiary hover:text-secondary hover:bg-white/3'
        )}
      >
        <span
          role="button"
          aria-pressed={isActive}
          tabIndex={0}
          onClick={onActivate}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onActivate();
            }
          }}
          className="flex items-center gap-1.5 px-3 h-full cursor-pointer max-w-[180px] truncate font-medium"
        >
          {project.hasAiosCore && (
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full bg-[#D1FF00]"
              title="Tem .aios-core/"
            />
          )}
          {project.name}
        </span>

        {canClose && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className={cn(
              'flex-shrink-0 h-4 w-4 flex items-center justify-center rounded-sm mr-1',
              'text-tertiary hover:text-primary hover:bg-white/10 transition-colors',
              'opacity-0 group-hover:opacity-100',
              isActive && 'opacity-60'
            )}
            aria-label={`Fechar ${project.name}`}
            tabIndex={-1}
          >
            <X className="h-3 w-3" />
          </button>
        )}

        {isActive && (
          <span
            className="absolute bottom-0 left-1 right-1 h-0.5 bg-[#D1FF00] rounded-full"
            aria-hidden="true"
          />
        )}
      </div>
    </ContextMenu>
  );
}
