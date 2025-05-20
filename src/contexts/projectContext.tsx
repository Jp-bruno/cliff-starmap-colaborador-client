import axiosBase from "@/axios/axios";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState, type Dispatch, type ReactNode } from "react";
import type { FaseType, ProjetoType } from "types";

type ProjetoContextType = {
    isLoading: boolean;
    projeto: ProjetoType;
    faseSelecionada: FaseType | null;
    setFaseSelecionada: Dispatch<any>;
    handleSetFaseSelecionada: (_id: string | null) => void;
};

const ProjetoContext = createContext({} as ProjetoContextType);

export default function ProjectContextProvider({ children }: { children: ReactNode }) {
    const { data: projeto, isLoading } = useQuery({
        queryKey: ["projeto"],
        queryFn: async () => {
            //TODO: mudar objectID quando implementar outros projetos
            return await axiosBase("/projeto/681cdd037b34af96d3c01b04").then((res) => res.data);
        },
    });

    const [faseSelecionada, setFaseSelecionada] = useState<null | FaseType>(projeto?.fases[0]);

    useEffect(() => {
        if (!isLoading) {
            setFaseSelecionada(projeto.fases[0]);
        }

        if (!isLoading && projeto.fases.length === 0) {
            setFaseSelecionada(null);
        }

        if (!isLoading && projeto.fases.length === 1) {
            setFaseSelecionada(projeto.fases[0]);
        }
    }, [isLoading, projeto]);

    function handleSetFaseSelecionada(_id: string | null) {
        if (_id === null) {
            setFaseSelecionada(null);
            return;
        }
        setFaseSelecionada(projeto.fases.find((fase: FaseType) => fase._id === _id));
    }

    return (
        <ProjetoContext.Provider value={{ isLoading, projeto, faseSelecionada, setFaseSelecionada, handleSetFaseSelecionada }}>
            {!isLoading && children}
        </ProjetoContext.Provider>
    );
}

export function useProjetoContext() {
    return useContext(ProjetoContext);
}
