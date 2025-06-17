import { createContext, useContext, useState, type ReactNode } from "react";

enum ResourceTypeEnums {
    pasta = "pasta",
    arquivo = "arquivo",
    usuário = "usuário",
    projeto = "projeto",
    compromisso = "compromisso",
    fase = "fase",
    relatorio = "relatório"
}

type DeleteConfirmPromptContextType = {
    state: {
        message: string;
        extraMessage?: string;
        cb: () => Promise<void>;
        resourceType: keyof typeof ResourceTypeEnums;
    } | null;
    open: ({
        message,
        cb,
        extraMessage,
        resourceType,
    }: {
        message: string;
        extraMessage?: string;
        cb: () => Promise<void>;
        resourceType: keyof typeof ResourceTypeEnums;
    }) => void;
    close: () => void;
};

const DeleteConfirmPromptContext = createContext({} as DeleteConfirmPromptContextType);

export default function DeleteConfirmPromptContextProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<{
        message: string;
        extraMessage?: string;
        cb: () => Promise<void>;
        resourceType: keyof typeof ResourceTypeEnums;
    } | null>(null);

    function open({
        message,
        cb,
        extraMessage,
        resourceType,
    }: {
        message: string;
        cb: () => Promise<void>;
        extraMessage?: string;
        resourceType: keyof typeof ResourceTypeEnums;
    }) {
        setState({
            message,
            extraMessage,
            cb,
            resourceType,
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
