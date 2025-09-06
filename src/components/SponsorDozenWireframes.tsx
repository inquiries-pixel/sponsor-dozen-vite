import React, { useMemo, useState, useEffect } from 'react';
import { api } from '../lib/api';

type Tab = 'recipient' | 'sponsor' | 'dashboard';
type Dietary = 'Chocolate Chip';

type Recipient = {
  id: string;
  firstName: string;
  lastInitial: string;
  email: string;
  address: string;
  dietary: 'Classic' | 'Nut-Free'; // recipients: no Gluten-Free
  deploymentEnd?: string;
};

type Sponsorship = {
  id: string;
  name: string;
  email: string;
  state?: string;
  note?: string;
  flavor: Dietary; // sponsors can choose any
};

type Reservation = {
  id: string;
  recipient: Recipient;
  sponsorship: Sponsorship;
};

type Shipment = {
  id: string;
  recipient: Recipient;
  sponsorship: Sponsorship;
  shippedAt: string;
};

const uid = () => Math.random().toString(36).slice(2, 9);

export default function SponsorDozenWireframes({ active }: { active: Tab }) {
  // ---------- STATE ----------
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);

  useEffect(() => {
    api.getRecipients().then(setRecipients).catch(console.error);
    api.getSponsorships().then(setSponsorships).catch(console.error);
  }, []);

  // ---------- RECIPIENT FORM ----------
  const [rFirst, setRFirst] = useState('');
  const [rLast, setRLast] = useState('');
  const [rEmail, setREmail] = useState('');
  const [rAddr, setRAddr] = useState('');
  const [rDiet, setRDiet] = useState<'Classic' | 'Nut-Free'>('Classic');
  const [rEnd, setREnd] = useState('');

  function addRecipient() {
    if (!rFirst || !rLast || !rEmail || !rAddr) {
      alert('Please fill out First, Last Initial, Email, and Address.');
      return;
    }
    const rec: Recipient = {
      id: uid(),
      firstName: rFirst.trim(),
      lastInitial: rLast.trim().slice(0, 1).toUpperCase(),
      email: rEmail.trim(),
      address: rAddr.trim(),
      dietary: rDiet,
      deploymentEnd: rEnd || undefined,
    };
    setRecipients((prev) => [...prev, rec]);
    setRFirst('');
    setRLast('');
    setREmail('');
    setRAddr('');
    setRDiet('Classic');
    setREnd('');
    alert('Recipient added (mock).');
  }

  // ---------- SPONSOR FORM ----------
  const [sName, setSName] = useState('');
  const [sEmail, setSEmail] = useState('');
  const [sState, setSState] = useState('');
  const [sNote, setSNote] = useState('');
  const [sFlavor, setSFlavor] = useState<Dietary>('Chocolate Chip');

  function addSponsorship() {
    if (!sName || !sEmail) {
      alert('Please enter your name and email.');
      return;
    }
    const sp: Sponsorship = {
      id: uid(),
      name: sName.trim(),
      email: sEmail.trim(),
      state: sState || undefined,
      note: sNote || undefined,
      flavor: sFlavor,
    };
    setSponsorships((prev) => [...prev, sp]);
    setSName('');
    setSEmail('');
    setSState('');
    setSNote('');
    setSFlavor('Classic');
    alert('Sponsorship created (mock).');
  }

  // ---------- MATCHING + SHIPPING ----------
  function runMatching() {
    const newRecipients = [...recipients];
    const newSponsorships = [...sponsorships];
    const newReservations: Reservation[] = [...reservations];

    let i = 0;
    while (i < newSponsorships.length) {
      const sp = newSponsorships[i];
      const ridx = newRecipients.findIndex(
        (r) => sp.flavor === r.dietary || sp.flavor === 'Chocolate Chip'
      );
      if (ridx === -1) {
        i++;
        continue;
      }
      const r = newRecipients[ridx];
      newReservations.push({ id: uid(), recipient: r, sponsorship: sp });
      newRecipients.splice(ridx, 1);
      newSponsorships.splice(i, 1);
    }

    setRecipients(newRecipients);
    setSponsorships(newSponsorships);
    setReservations(newReservations);
    alert('Matching complete (mock).');
  }

  function batchShip() {
    if (reservations.length === 0) {
      alert('No reservations to ship.');
      return;
    }
    const now = new Date().toISOString();
    const newShipments: Shipment[] = reservations.map((res) => ({
      id: uid(),
      recipient: res.recipient,
      sponsorship: res.sponsorship,
      shippedAt: now,
    }));
    setShipments((prev) => [...prev, ...newShipments]);
    setReservations([]);
    alert('Batch shipped (mock).');
  }

  function resetDemo() {
    setRecipients([]);
    setSponsorships([]);
    setReservations([]);
    setShipments([]);
    alert('Demo reset.');
  }

  // ---------- DERIVED ----------
  const queue = useMemo(() => recipients, [recipients]);
  const paid = useMemo(() => sponsorships, [sponsorships]);

  // ---------- UI ----------
  return (
    <div className="grid gap-6">
      {/* Recipient form */}
      {active === 'recipient' && (
        <section className="rounded-2xl border bg-white shadow-sm p-6">
          <h3 className="text-xl font-semibold text-red-700 mb-4">Recipient Signup</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <input
              className="border rounded-lg px-3 py-2"
              placeholder="First Name"
              value={rFirst}
              onChange={(e) => setRFirst(e.target.value)}
            />
            <input
              className="border rounded-lg px-3 py-2"
              placeholder="Last Initial"
              value={rLast}
              onChange={(e) => setRLast(e.target.value)}
            />
            <input
              className="border rounded-lg px-3 py-2 md:col-span-2"
              placeholder=".mil or personal Email"
              value={rEmail}
              onChange={(e) => setREmail(e.target.value)}
            />
            <input
              className="border rounded-lg px-3 py-2 md:col-span-2"
              placeholder="APO/FPO/DPO Address"
              value={rAddr}
              onChange={(e) => setRAddr(e.target.value)}
            />
            <select
              className="border rounded-lg px-3 py-2"
              value={rDiet}
              onChange={(e) => setRDiet(e.target.value as 'Classic' | 'Nut-Free')}
            >
              <option value="Classic">Classic</option>
              <option value="Nut-Free">Nut-Free</option>
            </select>
            <button
              onClick={addRecipient}
              className="rounded-xl px-4 py-2 bg-red-600 text-white hover:bg-red-700 md:col-span-2"
            >
              Join the List
            </button>
          </div>
        </section>
      )}

      {/* Sponsor form */}
      {active === 'sponsor' && (
        <section className="rounded-2xl border bg-white shadow-sm p-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-4">Sponsor Purchase</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <input
              className="border rounded-lg px-3 py-2"
              placeholder="Your Name"
              value={sName}
              onChange={(e) => setSName(e.target.value)}
            />
            <input
              className="border rounded-lg px-3 py-2"
              placeholder="Your Email"
              value={sEmail}
              onChange={(e) => setSEmail(e.target.value)}
            />
            <input
              className="border rounded-lg px-3 py-2"
              placeholder="Your State (optional)"
              value={sState}
              onChange={(e) => setSState(e.target.value)}
            />
            <select
              className="border rounded-lg px-3 py-2"
              value={sFlavor}
              onChange={(e) => setSFlavor(e.target.value as Dietary)}
            >
              <option value="Chocolate Chip">Chocolate Chip — $29.99</option>
            </select>
            <textarea
              className="border rounded-lg px-3 py-2 md:col-span-2"
              placeholder="Message (optional)"
              value={sNote}
              onChange={(e) => setSNote(e.target.value)}
            />
            <div className="md:col-span-2 flex gap-3">
              <button
                onClick={addSponsorship}
                className="rounded-xl px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
              >
                Sponsor Now
              </button>
              <button
                onClick={runMatching}
                className="rounded-xl px-4 py-2 border hover:bg-gray-50"
              >
                Run Matching
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Dashboard */}
      {active === 'dashboard' && (
        <section className="rounded-2xl border bg-white shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-semibold text-gray-900">Admin Dashboard (Mock)</h3>
            <div className="flex gap-3">
              <button
                onClick={runMatching}
                className="rounded-xl px-4 py-2 border hover:bg-gray-50"
              >
                Run Matching
              </button>
              <button
                onClick={batchShip}
                className="rounded-xl px-4 py-2 border hover:bg-gray-50"
              >
                Batch Ship
              </button>
              <button
                onClick={resetDemo}
                className="rounded-xl px-3 py-2 border text-red-700 hover:bg-red-50"
              >
                Reset Demo
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Queue */}
            <div className="rounded-xl border p-4">
              <h4 className="font-semibold mb-2">Queue ({queue.length})</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                {queue.map((r) => (
                  <li key={r.id} className="border rounded p-2">
                    {r.firstName} {r.lastInitial}. — {r.dietary}
                    <div className="text-xs text-gray-500">{r.email}</div>
                  </li>
                ))}
                {queue.length === 0 && (
                  <p className="text-gray-500 text-sm">No recipients yet.</p>
                )}
              </ul>
            </div>

            {/* Reservations */}
            <div className="rounded-xl border p-4">
              <h4 className="font-semibold mb-2">
                Reservations (Matched) ({reservations.length})
              </h4>
              <ul className="text-sm text-gray-700 space-y-2">
                {reservations.map((res) => (
                  <li key={res.id} className="border rounded p-2">
                    {res.recipient.firstName} {res.recipient.lastInitial}. ←{' '}
                    {res.sponsorship.name} ({res.sponsorship.flavor})
                  </li>
                ))}
                {reservations.length === 0 && (
                  <p className="text-gray-500 text-sm">No reservations yet.</p>
                )}
              </ul>
            </div>

            {/* Shipments */}
            <div className="rounded-xl border p-4">
              <h4 className="font-semibold mb-2">Shipments ({shipments.length})</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                {shipments.map((sh, idx) => (
                  <li key={sh.id || idx} className="border rounded p-2">
                    Shipped to {sh.recipient.firstName} {sh.recipient.lastInitial}. •{' '}
                    {new Date(sh.shippedAt).toLocaleString()}
                    <div className="text-xs text-gray-500">
                      Sponsor: {sh.sponsorship.name}
                    </div>
                  </li>
                ))}
                {shipments.length === 0 && (
                  <p className="text-gray-500 text-sm">No shipments yet.</p>
                )}
              </ul>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
