import { createContext, useContext, useEffect, useState, type Dispatch, type ReactNode } from "react";
import type { FaseType, ProjetoType } from "types";

type ProjetoContextType = {
    projeto: ProjetoType | null;
    faseSelecionada: FaseType | null;
    setFaseSelecionada: Dispatch<any>;
    handleSetFaseSelecionada: (_id: string | null) => void;
};

const ProjetoContext = createContext({} as ProjetoContextType);

export default function ProjectContextProvider({ children, projeto }: { children: ReactNode; projeto: ProjetoType }) {
    const [faseSelecionada, setFaseSelecionada] = useState<null | FaseType>(null);

    useEffect(() => {
        if (projeto && projeto.fases.length > 0) {
            setFaseSelecionada(projeto.fases[0]);
        } else {
            setFaseSelecionada(null);
        }
    }, [projeto]);

    function handleSetFaseSelecionada(_id: string | null) {
        if (_id === null) {
            setFaseSelecionada(null);
            return;
        }
        setFaseSelecionada(projeto!.fases.find((fase: FaseType) => fase._id === _id) ?? null);
    }

    return (
        <ProjetoContext.Provider value={{ projeto, faseSelecionada, setFaseSelecionada, handleSetFaseSelecionada }}>
            {children}
        </ProjetoContext.Provider>
    );
}

export function useProjetoContext() {
    return useContext(ProjetoContext);
}
