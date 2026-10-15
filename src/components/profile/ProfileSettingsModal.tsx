import React, { useState } from 'react';
import { PlayerState } from '../../types/game';
import { resetGameProgress } from '../../services/storage';
import { soundManager } from '../../services/sound';
import { Volume2, VolumeX, RotateCcw, Shield, User, FileText, Check, Sparkles } from 'lucide-react';

interface Props {
  player: PlayerState;
  onUpdatePlayer: (updated: PlayerState) => void;
  onClose: () => void;
}

export const ProfileSettingsModal: React.FC<Props> = ({
  player,
  onUpdatePlayer,
  onClose,
}) => {
  const [name, setName] = useState(player.name);
  const [soundEnabled, setSoundEnabled] = useState(player.soundEnabled);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleToggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    soundManager.setEnabled(nextVal);
    const updated = { ...player, soundEnabled: nextVal };
    onUpdatePlayer(updated);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();
    const updated = { ...player, name: name.trim() || 'Adventurer' };
    onUpdatePlayer(updated);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleConfirmReset = () => {
    soundManager.playClick();
    const freshState = resetGameProgress();
    onUpdatePlayer(freshState);
    setShowResetConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 p-5 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-amber-300 uppercase block">
              Preferences & Info
            </span>
            <h3 className="text-xl font-bold font-display">Explorer Profile</h3>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-blue-200 hover:text-white px-2.5 py-1 rounded-lg bg-blue-900/60"
          >
            Done
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          {/* Edit Name Form */}
          <form onSubmit={handleSaveProfile} className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" /> Explorer Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={25}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-600 font-medium"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-900 text-white font-bold text-xs hover:bg-blue-800 shrink-0"
              >
                Save
              </button>
            </div>
            {savedNotice && (
              <span className="text-[11px] text-emerald-600 font-medium block">
                ✓ Name updated successfully!
              </span>
            )}
          </form>

          {/* Audio Controls */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center">
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </div>
              <div>
                <strong className="text-slate-800 block">Game Audio & SFX</strong>
                <span className="text-[11px] text-slate-500">
                  {soundEnabled ? 'Synthesized chimes & engine sounds active' : 'Audio muted'}
                </span>
              </div>
            </div>
            <button
              onClick={handleToggleSound}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                soundEnabled
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              }`}
            >
              {soundEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Past Enquiries Log */}
          {player.enquiries.length > 0 && (
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" /> Your Submitted Holiday Requests ({player.enquiries.length})
              </label>
              <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                {player.enquiries.map((enq) => (
                  <div
                    key={enq.id}
                    className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-[11px]"
                  >
                    <div>
                      <span className="font-bold text-slate-800 uppercase">{enq.destination}</span>
                      <span className="text-slate-500 block text-[10px]">Ref: {enq.id}</span>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                      {enq.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Privacy & Posch Info */}
          <div className="p-3 bg-blue-50/50 rounded-2xl border border-blue-100 text-[11px] text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5 text-blue-900 font-bold">
              <Shield className="w-3.5 h-3.5 text-blue-700" />
              <span>Privacy & Brand Credentials</span>
            </div>
            <p className="leading-relaxed">
              Posch Holidays & Resorts designs handcrafted luxury itineraries worldwide. Travel inquiries submitted through POSCH HOLIDAY QUEST are encrypted and handled exclusively by certified travel concierges.
            </p>
          </div>

          {/* Reset Progress Section */}
          <div className="pt-2 border-t border-slate-100">
            {showResetConfirm ? (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 text-center space-y-2">
                <p className="text-xs text-rose-900 font-semibold">
                  Reset all stamps, unlocked levels, and points back to starter state?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleConfirmReset}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-rose-600 text-white font-bold text-xs hover:bg-rose-700"
                  >
                    Yes, Reset Game
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-slate-200 text-slate-700 font-semibold text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Game Progress</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
