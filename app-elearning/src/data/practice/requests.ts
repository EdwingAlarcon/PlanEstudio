export interface PracticeRequest {
  requestid: string;
  title: string;
  amount: number | null;
  requesterEmail?: string;
  status: "new" | "approved" | "requires_approval" | "rejected";
}

export const PRACTICE_REQUESTS: PracticeRequest[] = [
  { requestid: "req-001", title: "Compra menor", amount: 5000000, requesterEmail: "solicitante1@example.test", status: "new" },
  { requestid: "req-002", title: "Compra mayor", amount: 15000000, requesterEmail: "solicitante2@example.test", status: "new" },
  { requestid: "req-003", title: "Solicitud incompleta", amount: null, status: "new" },
  { requestid: "req-004", title: "Caso limite", amount: 10000000, requesterEmail: "solicitante4@example.test", status: "new" },
];
