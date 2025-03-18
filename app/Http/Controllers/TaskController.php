<?php

namespace App\Http\Controllers;

use App\Http\Requests\Tasks\CreateTaskRequest;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    /**
     * Create a task
     *
     * @param CreateTaskRequest $request
     * @return Task
     */
    public function store(CreateTaskRequest $request): Task
    {
        $user = Auth::user();

        $task = new Task();
        $task->title = $request->title;
        $task->body = $request->body;

        $task->owner()->associate($user);
        $task->asignee()->associate($user);

        $task->save();

        return $task;
    }
}
