import React, { useState } from 'react';
import { DESTINATIONS_DATA } from '../../data/destinations';
import { submitEnquiry } from '../../services/storage';
import { PlayerState, EnquirySubmission } from '../../types/game';
import { soundManager } from '../../services/sound';
import { X, Send, ShieldCheck, CheckCircle2, Sparkles, Copy, Phone, User, Mail, Calendar, Users } from 'lucide-react';

interface Props {
  initialDestinationId?: string;
  player: PlayerState;
  onClose: () => void;
  onEnquirySubmitted: (updatedPlayer: PlayerState, submission: EnquirySubmission) => void;
}

export const HolidayEnquiryModal: React.FC<Props> = ({
  initialDestinationId,
  player,
  onClose,
  onEnquirySubmitted,
}) => {
  const [name, setName] = useState(player.name !== 'Adventurer' ? player.name : '');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [destination, setDestination] = useState(initialDestinationId || 'singapore');
  const [travelMonth, setTravelMonth] = useState('Next 3 Months');
  const [guests, setGuests] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<EnquirySubmission | null>(null);
  const [copied, setCopied] = useState(false);

  const months = [
    'Immediate (Next 30 Days)',
    'Next 3 Months',
    'Upcoming Holiday Season (Nov-Jan)',
    'Summer Holiday (Apr-Jun)',
    'Flexible / Exploring Dates',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentAgreed) return;

    soundManager.playClick();
    setSubmitting(true);

    setTimeout(() => {
      const { enquiry, updatedState } = submitEnquiry(
        {
          name: name.trim() || 'Valued Guest',
          phone: phone.trim(),
          email: email.trim(),
          destination,
          travelMonth,
          guests,
          specialRequests: specialRequests.trim(),
          consentAgreed,
        },
        player
      );

      soundManager.playSuccessChime();
      setSubmitting(false);
      setSubmissionResult(enquiry);
      onEnquirySubmitted(updatedState, enquiry);
    }, 400);
  };

  const handleCopyReference = () => {
    if (!submissionResult) return;
    navigator.clipboard.writeText(submissionResult.id).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedDest = DESTINATIONS_DATA.find((d) => d.id === destination);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-blue-200 hover:text-white p-1 rounded-lg bg-blue-900/60"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-amber-300 mb-1">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Posch Holidays Concierge</span>
          </div>
          <h3 className="text-xl font-bold font-display">Plan Your Next Holiday</h3>
          <p className="text-xs text-blue-200 mt-0.5">
            Connect directly with verified luxury travel specialists for customized itineraries.
          </p>
        </div>

        {/* Content */}
        {submissionResult ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-slate-900">Enquiry Confirmed!</h4>
              <p className="text-xs text-slate-500 mt-1">
                Thank you, <strong>{submissionResult.name}</strong>. Your holiday request has been assigned to a Posch luxury travel specialist.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Reference ID:</span>
                <div className="flex items-center gap-1 font-mono font-bold text-blue-900">
                  <span>{submissionResult.id}</span>
                  <button
                    onClick={handleCopyReference}
                    className="p-1 hover:text-blue-700 text-slate-400"
                    title="Copy reference"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {copied && <p className="text-[10px] text-emerald-600 text-right">Copied to clipboard!</p>}

              <div className="flex justify-between">
                <span className="text-slate-500">Destination:</span>
                <span className="font-semibold text-slate-800 capitalize">
                  {submissionResult.destination}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Travel Window:</span>
                <span className="font-semibold text-slate-800">{submissionResult.travelMonth}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Reward:</span>
                <span className="font-bold text-amber-600">+100 Quest Points Credited!</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Our concierge team will reach out via phone/email with your verified package options within 24 business hours.
            </p>

            <button
              onClick={onClose}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-900 text-white font-bold text-xs shadow-md hover:bg-blue-800 active:scale-[0.98] transition"
            >
              Back to Game
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
            {/* Preferred Destination */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Preferred Destination *
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600 bg-white"
                required
              >
                {DESTINATIONS_DATA.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.country}) — {d.holidayPackage.duration}
                  </option>
                ))}
              </select>
            </div>

            {/* Travel Month & Guests in 2 columns */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" /> Travel Window
                </label>
                <select
                  value={travelMonth}
                  onChange={(e) => setTravelMonth(e.target.value)}
                  className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-600"
                >
                  {months.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                  <Users className="w-3 h-3 text-slate-400" /> Travelers
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-600"
                >
                  <option value={1}>1 Solo Explorer</option>
                  <option value={2}>2 Adults (Couple)</option>
                  <option value={3}>3 Adults / Family</option>
                  <option value={4}>4 Guests (Family Suite)</option>
                  <option value={6}>5+ Group Travel</option>
                </select>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                <User className="w-3 h-3 text-slate-400" /> Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                required
              />
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" /> Mobile / WhatsApp *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 / +65..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" /> Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                  required
                />
              </div>
            </div>

            {/* Special Preferences */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Special Requests (Optional)
              </label>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                rows={2}
                placeholder="e.g. Overwater villa, vegetarian meal plan, anniversary celebration..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Mandatory Consent & Transparency Box */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentAgreed}
                  onChange={(e) => setConsentAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-blue-900 border-slate-300 focus:ring-blue-600"
                  required
                />
                <span className="text-[11px] text-slate-600 leading-tight">
                  I agree to share my contact information with <strong>Posch Holidays & Resorts</strong> for receiving verified travel itineraries, price quotations, and concierge assistance.
                </span>
              </label>
              <p className="text-[10px] text-slate-400 leading-tight pl-6">
                Your data is stored securely and never shared with third-party advertisers.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || !consentAgreed || !phone || !email || !name}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-md hover:brightness-105 active:scale-[0.98] transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting Request...' : 'Send Holiday Enquiry (+100 PTS)'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
