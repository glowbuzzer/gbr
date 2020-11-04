import * as React from "react";

type Task = {
    name: string,
    activities: []
}

export type TasksContext = {
    tasks: Task[]
}

export const tasksContext = React.createContext<TasksContext | null>(null);

export const useTasks: () => TasksContext = () => {
    const context = React.useContext(tasksContext);
    if (!context) {
        throw new Error("useTasks requires provider");
    }
    return context;
};
