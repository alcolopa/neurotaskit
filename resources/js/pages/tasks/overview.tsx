import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { closestCorners, DndContext, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Head } from "@inertiajs/react";
import { useState } from "react";

interface TaskColumn {
  title: string;
  tasks: string[];
}

interface Columns {
  [key: string]: TaskColumn;
}

const initialColumns: Columns = {
  "todo": { title: "To Do", tasks: ["Task 1", "Task 2"] },
  "in-progress": { title: "In Progress", tasks: ["Task 3"] },
  "done": { title: "Done", tasks: ["Task 4"] }
};

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Tasks",
    href: "/tasks",
  },
];

function SortableItem({ task }: { task: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card ref={setNodeRef} style={style} {...attributes} {...listeners} className="p-2 bg-gray-100 dark:bg-black shadow-sm cursor-pointer">
      <CardContent>{task}</CardContent>
    </Card>
  );
}

export default function Board(): JSX.Element {
  const [columns, setColumns] = useState<Columns>(initialColumns);

  const onDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const sourceColumnKey = Object.keys(columns).find((key) => columns[key].tasks.includes(active.id as string));
    const destinationColumnKey = Object.keys(columns).find((key) => columns[key].tasks.includes(over.id as string));

    if (!sourceColumnKey || !destinationColumnKey) return;

    setColumns((prev) => {
      const newColumns = { ...prev };
      const sourceTasks = [...newColumns[sourceColumnKey].tasks];
      const destinationTasks = [...newColumns[destinationColumnKey].tasks];

      const oldIndex = sourceTasks.indexOf(active.id as string);
      const newIndex = destinationTasks.indexOf(over.id as string);

      if (sourceColumnKey === destinationColumnKey) {
        newColumns[sourceColumnKey].tasks = arrayMove(sourceTasks, oldIndex, newIndex);
      } else {
        sourceTasks.splice(oldIndex, 1);
        destinationTasks.splice(newIndex, 0, active.id as string);
        newColumns[sourceColumnKey].tasks = sourceTasks;
        newColumns[destinationColumnKey].tasks = destinationTasks;
      }

      return newColumns;
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tasks" />
      <DndContext collisionDetection={closestCorners} onDragEnd={onDragEnd}>
        <div className="flex gap-4 p-4">
          {Object.entries(columns).map(([id, column]) => (
            <SortableContext key={id} items={column.tasks}>
              <Card className="w-64">
                <CardContent className="p-4">
                  <h2 className="text-lg font-bold mb-2 px-2">{column.title}</h2>
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    {column.tasks.map((task) => (
                      <SortableItem key={task} task={task} />
                    ))}
                  </div>
                  <Button className="mt-4 w-full">Add Task</Button>
                </CardContent>
              </Card>
            </SortableContext>
          ))}
        </div>
      </DndContext>
    </AppLayout>
  );
}
