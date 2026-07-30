/**
 * Dados de demonstração da agência A CASA DE AVENTURA.
 * Estruturados como se viessem de uma API — facilita plugar um backend depois.
 */
import canoagem from "@/assets/e-canoagem.jpg";
import escalada from "@/assets/e-escalada.jpg";
import chapada from "@/assets/e-chapada.jpg";
import rafting from "@/assets/e-rafting.jpg";
import lencois from "@/assets/e-lencois.jpg";
import amazonia from "@/assets/e-amazonia.jpg";

export type Activity = {
  id: string;
  name: string;
  description: string;
};

export type Departure = {
  /** ISO date (YYYY-MM-DD) */
  date: string;
  spots: number;
};

export type Trip = {
  id: string;
  name: string;
  destination: string;
  state: string;
  activityId: string;
  /** Preço por pessoa */
  price: number;
  oldPrice?: number;
  days: number;
  level: "Iniciante" | "Intermediário" | "Avançado";
  image: string;
  description: string;
  highlights: string[];
  includes: string[];
  rating: number;
  featured?: boolean;
  departures: Departure[];
};

export const activities: Activity[] = [
  { id: "canoagem", name: "Canoagem", description: "Rios calmos, mar e travessias de caiaque" },
  { id: "escalada", name: "Escalada", description: "Montanhas e paredes com guias certificados" },
  { id: "trekking", name: "Trekking", description: "Travessias e trilhas de longa distância" },
  { id: "rafting", name: "Rafting", description: "Descidas de corredeiras em grupo" },
  { id: "expedicao", name: "Expedições", description: "Roteiros longos por biomas brasileiros" },
];

export const trips: Trip[] = [
  {
    id: "canoagem-bonito",
    name: "Canoagem nas Águas Claras de Bonito",
    destination: "Bonito",
    state: "MS",
    activityId: "canoagem",
    price: 1890,
    oldPrice: 2290,
    days: 3,
    level: "Iniciante",
    image: canoagem,
    rating: 4.9,
    featured: true,
    description:
      "Três dias remando pelos rios de água cristalina de Bonito, com flutuação entre cardumes, trilhas curtas até cachoeiras e noites em pousada de charme. Roteiro perfeito para quem está começando na canoagem.",
    highlights: ["Rio da Prata", "Flutuação com cardumes", "Cachoeira Boca da Onça"],
    includes: ["Guia credenciado", "Equipamento de remo", "Hospedagem 2 noites", "Café e almoços"],
    departures: [
      { date: "2026-08-14", spots: 6 },
      { date: "2026-09-11", spots: 10 },
      { date: "2026-10-09", spots: 12 },
    ],
  },
  {
    id: "escalada-pedra-azul",
    name: "Escalada na Pedra Azul",
    destination: "Domingos Martins",
    state: "ES",
    activityId: "escalada",
    price: 1450,
    days: 2,
    level: "Intermediário",
    image: escalada,
    rating: 4.8,
    featured: true,
    description:
      "Fim de semana de escalada em granito com vias de diferentes graus, técnica de segurança, rapel guiado e vista para o vale ao amanhecer. Acompanhamento de guias com certificação em condução de montanha.",
    highlights: ["Vias esportivas", "Rapel de 40 m", "Nascer do sol no mirante"],
    includes: ["Equipamento completo", "Guia de montanha", "Hospedagem 1 noite", "Seguro aventura"],
    departures: [
      { date: "2026-08-22", spots: 4 },
      { date: "2026-09-19", spots: 8 },
    ],
  },
  {
    id: "trekking-chapada",
    name: "Travessia do Vale do Pati",
    destination: "Chapada Diamantina",
    state: "BA",
    activityId: "trekking",
    price: 2790,
    oldPrice: 3150,
    days: 5,
    level: "Avançado",
    image: chapada,
    rating: 5,
    featured: true,
    description:
      "A travessia mais famosa do Brasil: cinco dias caminhando entre morros, cachoeiras e casas de nativos no Vale do Pati, com apoio de guias locais e pernoites em casas de família.",
    highlights: ["Morro do Castelo", "Cachoeirão", "Pernoite em casa de nativos"],
    includes: ["Guia local", "Pensão completa", "Transfer Lençóis", "Carregador de mochila opcional"],
    departures: [
      { date: "2026-09-05", spots: 3 },
      { date: "2026-10-17", spots: 9 },
      { date: "2026-11-07", spots: 12 },
    ],
  },
  {
    id: "rafting-jacare-pepira",
    name: "Rafting no Rio Jacaré-Pepira",
    destination: "Brotas",
    state: "SP",
    activityId: "rafting",
    price: 690,
    days: 2,
    level: "Iniciante",
    image: rafting,
    rating: 4.7,
    description:
      "Descida de corredeiras classe III em botes de seis pessoas, com briefing de segurança, tirolesa e cachoeirismo no segundo dia. Ideal para grupos de amigos e empresas.",
    highlights: ["Corredeiras classe III", "Tirolesa sobre o rio", "Cachoeirismo"],
    includes: ["Condutor por bote", "Colete e capacete", "Almoço nos dois dias"],
    departures: [
      { date: "2026-08-08", spots: 14 },
      { date: "2026-08-29", spots: 16 },
      { date: "2026-09-26", spots: 16 },
    ],
  },
  {
    id: "lencois-maranhenses",
    name: "Expedição Lençóis Maranhenses",
    destination: "Barreirinhas",
    state: "MA",
    activityId: "expedicao",
    price: 3390,
    days: 6,
    level: "Intermediário",
    image: lencois,
    rating: 4.9,
    featured: true,
    description:
      "Seis dias atravessando dunas e lagoas de água doce entre Barreirinhas e Atins, com caminhadas ao amanhecer, travessia de barco pelo Rio Preguiças e pôr do sol na Lagoa Bonita.",
    highlights: ["Lagoa Azul e Lagoa Bonita", "Travessia até Atins", "Rio Preguiças de barco"],
    includes: ["Guia da expedição", "Hospedagem 5 noites", "Transfers 4x4", "Café da manhã"],
    departures: [
      { date: "2026-09-12", spots: 8 },
      { date: "2026-10-24", spots: 10 },
    ],
  },
  {
    id: "amazonia-rio-negro",
    name: "Expedição Amazônia — Rio Negro",
    destination: "Manaus",
    state: "AM",
    activityId: "expedicao",
    price: 4290,
    days: 7,
    level: "Intermediário",
    image: amazonia,
    rating: 4.8,
    description:
      "Uma semana navegando o Rio Negro em barco regional, com trilhas na floresta, focagem de jacarés, visita a comunidades ribeirinhas e noites em rede sob o céu amazônico.",
    highlights: ["Encontro das Águas", "Trilha noturna na floresta", "Comunidade ribeirinha"],
    includes: ["Barco regional", "Guia biólogo", "Pensão completa", "Rede e mosquiteiro"],
    departures: [
      { date: "2026-10-03", spots: 6 },
      { date: "2026-11-14", spots: 12 },
    ],
  },
];

export const quickStats = [
  { label: "Roteiros pelo Brasil", value: "42" },
  { label: "Aventureiros guiados", value: "9.300" },
  { label: "Avaliação média", value: "4.9/5" },
  { label: "Estados atendidos", value: "17" },
];

export const formatPrice = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
