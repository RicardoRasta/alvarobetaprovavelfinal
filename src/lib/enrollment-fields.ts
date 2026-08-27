/** Campos da ficha de inscrição — usados no formulário público e na impressão em PDF. */
export type FieldKind = "text" | "email" | "date" | "textarea" | "bool" | "select";

export type FieldDef = {
  key: string;
  label: string;
  kind: FieldKind;
  options?: string[];
  required?: boolean;
  half?: boolean;
};

export type FieldGroup = { title: string; fields: FieldDef[] };

export const enrollmentGroups: FieldGroup[] = [
  {
    title: "Dados pessoais",
    fields: [
      { key: "full_name", label: "Nome completo", kind: "text", required: true },
      { key: "email", label: "E-mail", kind: "email", half: true },
      { key: "phone", label: "Telefone", kind: "text", half: true },
      { key: "cpf", label: "CPF", kind: "text", half: true },
      { key: "birth_date", label: "Data de nascimento", kind: "date", half: true },
      { key: "passport", label: "Passaporte", kind: "text", half: true },
      { key: "profession", label: "Profissão", kind: "text", half: true },
    ],
  },
  {
    title: "Endereço",
    fields: [
      { key: "zip_code", label: "CEP", kind: "text", half: true },
      { key: "country", label: "País", kind: "text", half: true },
      { key: "state", label: "Estado", kind: "text", half: true },
      { key: "city", label: "Cidade", kind: "text", half: true },
      { key: "district", label: "Bairro", kind: "text", half: true },
      { key: "street", label: "Rua", kind: "text", half: true },
      { key: "number", label: "Número", kind: "text", half: true },
    ],
  },
  {
    title: "Dados físicos",
    fields: [
      { key: "height", label: "Altura", kind: "text", half: true },
      { key: "weight", label: "Peso", kind: "text", half: true },
      { key: "shirt_size", label: "Tamanho da camiseta", kind: "text", half: true },
      { key: "shoe_size", label: "Tamanho do calçado", kind: "text", half: true },
      { key: "blood_type", label: "Tipo sanguíneo", kind: "text", half: true },
    ],
  },
  {
    title: "Saúde",
    fields: [
      { key: "heart_condition", label: "Possui alguma disfunção cardíaca?", kind: "bool" },
      { key: "heart_condition_detail", label: "Se sim, qual?", kind: "text" },
      { key: "allergy", label: "Apresenta algum tipo de alergia ou restrição a medicamentos?", kind: "bool" },
      { key: "allergy_detail", label: "Se sim, qual?", kind: "text" },
      { key: "food_restriction", label: "Possui restrição a algum alimento? Qual?", kind: "text" },
      { key: "health_plan", label: "Possui plano de saúde? Qual?", kind: "text" },
      {
        key: "health_notes",
        label: "Alguma observação a ser esclarecida previamente a respeito da sua saúde?",
        kind: "textarea",
      },
    ],
  },
  {
    title: "Vacinas",
    fields: [
      { key: "vaccine_rabies", label: "Vacina contra raiva", kind: "bool" },
      { key: "vaccine_yellow_fever", label: "Vacina contra febre amarela", kind: "bool" },
      { key: "vaccine_covid", label: "Vacina SARS-CoV-2 (COVID)", kind: "bool" },
    ],
  },
  {
    title: "Emergência e experiência",
    fields: [
      { key: "emergency_contact", label: "Contato de emergência (nome e telefone)", kind: "text" },
      {
        key: "outdoor_practitioner",
        label: "Você já é praticante de alguma modalidade de atividade ao ar livre?",
        kind: "text",
      },
      {
        key: "routine_activity",
        label: "Qual sua atividade ou esporte de rotina e qual a frequência?",
        kind: "text",
      },
      { key: "previous_events", label: "Já participou de algum evento igual a este?", kind: "text" },
      { key: "expectations", label: "O que espera do evento?", kind: "textarea" },
      { key: "how_found_us", label: "Como e onde nos encontrou?", kind: "text" },
    ],
  },
  {
    title: "Pagamento",
    fields: [
      {
        key: "payment_method",
        label: "Forma de pagamento",
        kind: "select",
        options: ["PIX", "Cartão de crédito", "Transferência bancária", "Dinheiro", "Parcelado"],
      },
    ],
  },
];

export const RISK_TERMS =
  "Declaro estar ciente de que atividades de aventura envolvem riscos inerentes (terreno irregular, condições climáticas, fauna, esforço físico e deslocamentos). Declaro que as informações prestadas nesta ficha são verdadeiras, que possuo condições de saúde compatíveis com a atividade e que seguirei as orientações da equipe de condução da A Casa de Aventura durante todo o evento.";

export const allFields = enrollmentGroups.flatMap((g) => g.fields);
