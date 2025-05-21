export type ProjetoType = {
    _id: string;
    nome: string;
    contatos: any;
    fases: FaseType[];
    clientes: any;
    colaboradores: any;
    slug: string;
    proximosEventos: EventoType[];
};

export type FaseType = {
    _id: string;
    nome: string;
    descricao: string;
    banner: string;
    documentos: any;
    financeiro: any;
    atualizacoes: any;
    agenda: ItemAgendaType[];
    valorProjetado: number;
    valorOrcado: number;
    valorReal: number;
    projeto: string;
};

export type ItemAgendaType = {
    _id: string;
    titulo: string;
    descricao: string;
    data: string;
    fase: string;
    projeto: string;
};

export type AtualizacaoType = {
    _id: string;
    descricao: string;
    data: string;
};

export type PastaType = {
    _id: string;
    nome: string;
    slug: string;
    descricao: string;
    fase: string;
    projeto: string;
    secao: "documentos" | "financeiro";
};

export type ColaboradorType = {
    _id: string;
    nome: string;
    sobrenome: string;
    email: string;
    telefone: string;
    imagem: string;
    projetos: ProjetoType[];
    atividades: string[];
    administrador: boolean;
    descricao: string;
};

export type ClienteType = {
    _id: string;
    nome: string;
    sobrenome: string;
    email: string;
    telefone: string;
    imagem: string;
    projetos: ProjetoType[];
    atividades: string[];
    descricao: string;
};

export type EventoType = {
    _id: string;
    titulo: string;
    data: string;
};

export type ArquivoType = {
    _id: string;
    nome: string;
    mimetype: string;
    extensao: string;
    visivel: boolean;
    pasta: string;
    projeto: string;
};
