import { createContext, useContext, useState, type ReactNode } from "react";

type DeleteConfirmPromptContextType = {
    state: {
        message: string;
        extraMessage?: string;
        cb: () => Promise<void>;
    } | null;
    open: ({ message, cb, extraMessage }: { message: string; cb: () => Promise<void>; extraMessage?: string }) => void;
    close: () => void;
};

const DeleteConfirmPromptContext = createContext({} as DeleteConfirmPromptContextType);

export default function DeleteConfirmPromptContextProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<{
        message: string;
        extraMessage?: string;
        cb: () => Promise<void>;
    } | null>(null);

    function open({ message, cb, extraMessage }: { message: string; cb: () => Promise<void>; extraMessage?: string }) {
        setState({
            message,
            extraMessage,
            cb,
        });
    }

    function close() {
        setState(null);
    }

    return <DeleteConfirmPromptContext.Provider value={{ state, open, close }}>{children}</DeleteConfirmPromptContext.Provider>;
}

export function useDeleteConfirmPrompt() {
    return useContext(DeleteConfirmPromptContext);
}
