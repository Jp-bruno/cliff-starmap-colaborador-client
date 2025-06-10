import axiosBase from "@/axios/axios";
import { useQuery, type QueryObserverResult, type RefetchOptions } from "@tanstack/react-query";
import { createContext, useContext, useState, type Dispatch, type ReactNode } from "react";
import type { FaseType, ProjetoType } from "@/types";

type ProjetoContextType = {
    isLoading: boolean;
    projeto: ProjetoType | null;
    faseSelecionada: FaseType | null;
    setFaseSelecionada: Dispatch<any>;
    handleSetFaseSelecionada: (_id: string | null) => void;
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<any, Error>>;
};

const ProjetoContext = createContext({} as ProjetoContextType);

export default function ProjectContextProvider({ children, slug }: { children: ReactNode; slug: string }) {
    const [faseSelecionada, setFaseSelecionada] = useState<null | FaseType>(null);

    const {
        data: projeto,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["projeto"],
        queryFn: async () => {
            return await axiosBase(`/projeto/${slug}`).then((res) => {
                if (!faseSelecionada && res.data.fases.length > 0) {
                    setFaseSelecionada(res.data.fases[0]);

                    return res.data;
                }

                if (!faseSelecionada && res.data.fases.length === 0) {
                    setFaseSelecionada(null);

                    return res.data;
                }

                setFaseSelecionada(() => (res.data.fases.some((p_fase: FaseType) => p_fase._id === faseSelecionada?._id) ? faseSelecionada : null));
                return res.data;
            });
        },
        notifyOnChangeProps: "all",
    });

    function handleSetFaseSelecionada(_id: string | null) {
        setFaseSelecionada(() => {
            return projeto.fases.find((p_fase: FaseType) => p_fase._id === _id);
        });
    }

    return (
        <ProjetoContext.Provider value={{ refetch, isLoading, projeto, faseSelecionada, setFaseSelecionada, handleSetFaseSelecionada }}>
            {!isLoading && children}
        </ProjetoContext.Provider>
    );
}

export function useProjetoContext() {
    return useContext(ProjetoContext);
}
