import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { closestCorners, DndContext, DragEndEvent, DragOverlay, useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@headlessui/react";
import { Head } from "@inertiajs/react";
import { Separator } from "@radix-ui/react-separator";
import { JSX, useState } from "react";


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
        isDragging
    } = useSortable({ id: task });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <Card ref={setNodeRef} style={style} {...attributes} {...listeners} className="p-2 bg-gray-100 dark:bg-black shadow-sm cursor-pointer">
            <CardContent>{task}</CardContent>
        </Card>
    );
}

export default function Board(): JSX.Element {
    const [columns, setColumns] = useState<Columns>(initialColumns);
    const [activeTask, setActiveTask] = useState<string | null>(null);
    const [activeColumn, setActiveColumn] = useState<string | null>(null);

    // Function to add a task to a column
    const addTask = (columnId: string) => {
        const newTask = `Task ${Date.now()}`; // Generate unique task name
        setColumns((prev) => ({
            ...prev,
            [columnId]: {
                ...prev[columnId],
                tasks: [...prev[columnId].tasks, newTask],
            },
        }));
    };

    const onDragStart = (event: DragEndEvent) => {
        setActiveTask(event.active.id as string);
    };

    const onDragOver = (event: DragEndEvent) => {
        const { over } = event;
        if (over) {
            setActiveColumn(over.id as string);
        }
    };

    const onDragEnd = (event: DragEndEvent): void => {
        setActiveTask(null);
        setActiveColumn(null);

        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const sourceColumnKey = Object.keys(columns).find((key) =>
            columns[key].tasks.includes(active.id as string)
        );

        let destinationColumnKey = over.id as string;
        if (!columns[destinationColumnKey]) {
            destinationColumnKey = Object.keys(columns).find((key) =>
                columns[key].tasks.includes(over.id as string)
            ) as string;
        }

        if (!sourceColumnKey || !destinationColumnKey) return;

        setColumns((prev) => {
            const newColumns = { ...prev };
            const sourceTasks = [...newColumns[sourceColumnKey].tasks];
            const destinationTasks = [...newColumns[destinationColumnKey].tasks];

            const oldIndex = sourceTasks.indexOf(active.id as string);
            sourceTasks.splice(oldIndex, 1);

            const newIndex = destinationTasks.indexOf(over.id as string);
            if (newIndex !== -1) {
                destinationTasks.splice(newIndex, 0, active.id as string);
            } else {
                destinationTasks.push(active.id as string);
            }

            newColumns[sourceColumnKey].tasks = sourceTasks;
            newColumns[destinationColumnKey].tasks = destinationTasks;

            return newColumns;
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tasks" />
            <Tabs defaultValue="board" className="w-full flex gap-4 p-4">
                <TabsList>
                    <TabsTrigger value="board">Board</TabsTrigger>
                    <TabsTrigger value="list">List</TabsTrigger>
                </TabsList>
                <TabsContent value="board">
                    <DndContext collisionDetection={closestCorners} onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd}>
                        <div className="flex gap-4 p-4">
                            {Object.entries(columns).map(([id, column]) => (
                                <Column key={id} id={id} title={column.title} tasks={column.tasks} isActive={id === activeColumn} addTask={addTask} />
                            ))}
                        </div>
                        <DragOverlay>
                            {activeTask ? <SortableItem task={activeTask} /> : null}
                        </DragOverlay>
                    </DndContext>
                </TabsContent>
                <TabsContent value="list">
                    <Table>
                        <TableCaption>A list of your recent invoices.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Title</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Object.entries(columns).map(([id, column]) => {
                                <TableRow>
                                    <TableCell className="font-medium">{id}</TableCell>
                                    <TableCell className="font-medium">{column}</TableCell>
                                </TableRow>
                            })}
                        </TableBody>
                    </Table>

                </TabsContent>
            </Tabs>


        </AppLayout>
    );
}
interface ColumnPropsInterface {
    id: string;
    title: string;
    tasks: string[];
    isActive: boolean;
}

interface ColumnPropsInterface {
    id: string;
    title: string;
    tasks: string[];
    isActive: boolean;
    addTask: (columnId: string) => void; // New prop for adding a task
}

function Column({ id, title, tasks, isActive, addTask }: ColumnPropsInterface) {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <SortableContext items={tasks}>
            <Card
                ref={setNodeRef} // Make the whole card a drop target
                className={`w-64 transition-all border-2 ${isOver || isActive ? "border-blue-500 bg-blue-100 dark:bg-blue-900" : "border-gray-300"
                    }`}
            >
                <CardContent className="p-4">
                    <h2 className="text-lg font-bold mb-2 px-2">{title}</h2>
                    <Separator className="my-4" />

                    <div className="min-h-[100px] space-y-2">
                        {tasks.length > 0 ? (
                            tasks.map((task) => (
                                <div key={task}>
                                    <SortableItem task={task} />
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">Drop here</p>
                        )}
                    </div>

                    {/* Button to add a task */}
                    <Button className="mt-4 w-full" onClick={() => addTask(id)}>
                        Add Task
                    </Button>
                </CardContent>
            </Card>
        </SortableContext>
    );
}
