import { Separator } from "@/components/ui/separator";
import { useDroppable } from "@dnd-kit/core";
import { SortableItem } from "./sortableItem";

export function Column({ id, title, tasks }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg w-64">
      <h2 className="text-lg font-bold mb-2">{title}</h2>
      <Separator className="my-4" />
      <div className="space-y-2">
        {tasks.map((task) => (
          <SortableItem key={task} id={task} />
        ))}
      </div>
    </div>
  );
}
