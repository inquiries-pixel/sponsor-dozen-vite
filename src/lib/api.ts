// Simple fetch helpers that talk to json-server in dev (via Vite proxy `/api`)
// and to your Render API in production (via VITE_API_BASE)

export type Recipient = {
  id?: string;
  firstName: string;
  lastInitial: string;
  email: string;
  address: string;
  dietary: 'Chocolate Chip';
  deploymentEnd?: string;
};

export type Sponsorship = {
  id?: string;
  name: string;
  email: string;
  state?: string;
  note?: string;
  flavor: 'Chocolate Chip';
};

export type Reservation = {
  id?: string;
  recipient: Recipient;
  sponsorship: Sponsorship;
};

export type Shipment = {
  id?: string;
  recipient: Recipient;
  sponsorship: Sponsorship;
  shippedAt: string;
};

const BASE =
  (import.meta as any).env?.VITE_API_BASE && (import.meta as any).env.VITE_API_BASE.trim() !== ''
    ? (import.meta as any).env.VITE_API_BASE
    : '/api';

const j = (r: Response) => {
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
};

export const api = {
  // --- Recipients ---
  getRecipients: (): Promise<Recipient[]> => fetch(`${BASE}/recipients`).then(j),
  addRecipient: (data: Recipient): Promise<Recipient> =>
    fetch(`${BASE}/recipients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(j),

  // --- Sponsorships ---
  getSponsorships: (): Promise<Sponsorship[]> => fetch(`${BASE}/sponsorships`).then(j),
  addSponsorship: (data: Sponsorship): Promise<Sponsorship> =>
    fetch(`${BASE}/sponsorships`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(j),

  // --- Reservations ---
  getReservations: (): Promise<Reservation[]> => fetch(`${BASE}/reservations`).then(j),
  addReservation: (data: Reservation): Promise<Reservation> =>
    fetch(`${BASE}/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(j),

  // --- Shipments ---
  getShipments: (): Promise<Shipment[]> => fetch(`${BASE}/shipments`).then(j),
  addShipment: (data: Shipment): Promise<Shipment> =>
    fetch(`${BASE}/shipments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(j),
};
