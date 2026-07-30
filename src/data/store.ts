/**
 * Dados de demonstração da loja CASA DE AVENTURA.
 * Estruturados como se viessem de uma API — facilita plugar um backend depois.
 */
import barraca from "@/assets/p-barraca.jpg";
import mochila from "@/assets/p-mochila.jpg";
import bota from "@/assets/p-bota.jpg";
import saco from "@/assets/p-saco.jpg";
import escalada from "@/assets/p-escalada.jpg";
import jaqueta from "@/assets/p-jaqueta.jpg";

export type Category = {
  id: string;
  name: string;
  description: string;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  categoryId: string;
  price: number;
  oldPrice?: number;
  stock: number;
  image: string;
  description: string;
  rating: number;
  featured?: boolean;
};

export const categories: Category[] = [
  { id: "camping", name: "Camping", description: "Barracas, lanternas e conforto no acampamento" },
  { id: "mochilas", name: "Mochilas", description: "Cargueiras, attack packs e hidratação" },
  { id: "calcados", name: "Calçados", description: "Botas e tênis de trilha com aderência" },
  { id: "escalada", name: "Escalada", description: "Cordas, mosquetões e cadeirinhas" },
  { id: "vestuario", name: "Vestuário", description: "Camadas técnicas para todo clima" },
];

export const products: Product[] = [
  {
    id: "barraca-cume-3",
    name: "Barraca Cume 3 Pessoas",
    brand: "Serra Alta",
    categoryId: "camping",
    price: 1299.9,
    oldPrice: 1599.9,
    stock: 12,
    image: barraca,
    rating: 4.8,
    featured: true,
    description:
      "Barraca cúpula para 3 pessoas com coluna d'água de 3000 mm, montagem rápida em 2 minutos, sobreteto full coverage e piso reforçado. Ideal para travessias de vários dias em condições de vento moderado.",
  },
  {
    id: "mochila-cargueira-65",
    name: "Mochila Cargueira 65L",
    brand: "Trilha Viva",
    categoryId: "mochilas",
    price: 899.0,
    stock: 8,
    image: mochila,
    rating: 4.7,
    featured: true,
    description:
      "Cargueira de 65 litros com sistema de ventilação nas costas, cinto pélvico acolchoado, compartimento inferior independente e capa de chuva inclusa. Distribuição de carga pensada para longas jornadas.",
  },
  {
    id: "bota-trekking-pro",
    name: "Bota Trekking Pro Impermeável",
    brand: "Pedra Firme",
    categoryId: "calcados",
    price: 749.9,
    oldPrice: 899.9,
    stock: 0,
    image: bota,
    rating: 4.9,
    featured: true,
    description:
      "Bota cano médio em couro hidrofugado com membrana impermeável e respirável, solado de borracha de alta aderência e entressola em EVA de dupla densidade para absorção de impacto.",
  },
  {
    id: "saco-dormir-neve",
    name: "Saco de Dormir Neve -5°C",
    brand: "Serra Alta",
    categoryId: "camping",
    price: 549.0,
    stock: 23,
    image: saco,
    rating: 4.6,
    description:
      "Saco de dormir tipo múmia com enchimento em fibra siliconada, conforto até -5°C, capuz ajustável e saco de compressão. Acompanha lanterna de acampamento recarregável.",
  },
  {
    id: "kit-escalada-basico",
    name: "Kit Escalada Iniciante",
    brand: "Vertical",
    categoryId: "escalada",
    price: 1189.0,
    oldPrice: 1390.0,
    stock: 5,
    image: escalada,
    rating: 4.5,
    description:
      "Kit completo com cadeirinha ajustável, corda dinâmica de 40 m, três mosquetões com trava e freio. Todos os componentes certificados para uso em escalada esportiva.",
  },
  {
    id: "jaqueta-corta-vento",
    name: "Jaqueta Corta-Vento Impermeável",
    brand: "Trilha Viva",
    categoryId: "vestuario",
    price: 469.9,
    stock: 31,
    image: jaqueta,
    rating: 4.4,
    featured: true,
    description:
      "Jaqueta shell leve com capuz ajustável, costuras seladas, zíperes de ventilação nas axilas e bolsos frontais. Compacta no próprio bolso para caber em qualquer mochila.",
  },
];

export const quickStats = [
  { label: "Produtos no catálogo", value: "1.240" },
  { label: "Aventureiros atendidos", value: "18.500" },
  { label: "Avaliação média", value: "4.8/5" },
  { label: "Envio para", value: "Todo o Brasil" },
];

export const formatPrice = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
