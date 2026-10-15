import React, { useState } from 'react';
import { Destination, SuitcaseItem } from '../../types/game';
import { soundManager } from '../../services/sound';
import { CheckCircle2, AlertCircle, RotateCcw, Luggage, Sparkles, Plus, Check } from 'lucide-react';

interface Props {
  destination: Destination;
  onFinish: (scoreEarned: number, allCorrect: boolean) => void;
  onBack: () => void;
  onPlanHoliday: (destinationId: string) => void;
}

export const PackSuitcaseGame: React.FC<Props> = ({
  destination,
  onFinish,
  onBack,
  onPlanHoliday,
}) => {
  const theme = destination.suitcaseTheme;
  const [packedItemIds, setPackedItemIds] = useState<string[]>([]);
  const [evaluated, setEvaluated] = useState(false);
  const [score, setScore] = useState(0);

  const toggleItem = (itemId: string) => {
    if (evaluated) return;
    soundManager.playClick();
    if (packedItemIds.includes(itemId)) {
      setPackedItemIds((prev) => prev.filter((id) => id !== itemId));
    } else {
      if (packedItemIds.length >= theme.targetCount) {
        // Suitcase is full! Prompt user to swap
        soundManager.playError();
        return;
      }
      setPackedItemIds((prev) => [...prev, itemId]);
    }
  };

  const handleEvaluate = () => {
    soundManager.playClick();
    setEvaluated(true);

    const packedItems = theme.items.filter((item) => packedItemIds.includes(item.id));
    let earned = 0;
    let correctPicks = 0;

    packedItems.forEach((item) => {
      if (item.isCorrect) {
        earned += 40;
        correctPicks += 1;
      } else {
        earned = Math.max(0, earned - 20); // Penalty for distractors
      }
    });

    const isFlawless = correctPicks === theme.targetCount && packedItems.every((i) => i.isCorrect);
    if (isFlawless) {
      earned += 50; // Perfect pack bonus
      soundManager.playVictory();
    } else if (earned > 0) {
      soundManager.playSuccessChime();
    } else {
      soundManager.playError();
    }

    setScore(earned);
    onFinish(earned, isFlawless);
  };

  const handleRestart = () => {
    soundManager.playClick();
    setPackedItemIds([]);
    setEvaluated(false);
    setScore(0);
  };

  const packedItems = theme.items.filter((item) => packedItemIds.includes(item.id));
  const isFull = packedItemIds.length === theme.targetCount;

  return (
    <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden my-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 p-4 text-white">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-semibold text-amber-400">Game B · Pack My Suitcase</span>
          <button
            onClick={onBack}
            className="text-xs text-blue-200 hover:text-white px-2 py-0.5 rounded bg-blue-800/60"
          >
            Exit
          </button>
        </div>
        <h3 className="text-lg font-bold">{destination.name}: {theme.themeName}</h3>
        <p className="text-xs text-blue-200 mt-1">{theme.description}</p>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-blue-300">
            Suitcase Capacity: <strong className="text-white">{packedItemIds.length}/{theme.targetCount} items</strong>
          </span>
          <span className="text-amber-300 font-semibold tabular-nums">Target: 4 Essentials</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Virtual Suitcase Container */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border-2 border-dashed border-amber-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <Luggage className="w-4 h-4 text-amber-600" /> Posch Checked Luggage
            </span>
            <span className="text-[11px] text-amber-700">
              {isFull ? 'Suitcase is Ready to Check-In' : `Select ${theme.targetCount - packedItemIds.length} more item(s)`}
            </span>
          </div>

          {/* Suitcase Slots */}
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: theme.targetCount }).map((_, slotIdx) => {
              const item = packedItems[slotIdx];
              return (
                <div
                  key={slotIdx}
                  className={`h-20 rounded-xl flex flex-col items-center justify-center p-2 text-center transition ${
                    item
                      ? evaluated
                        ? item.isCorrect
                          ? 'bg-emerald-100 border border-emerald-400 text-emerald-950'
                          : 'bg-rose-100 border border-rose-400 text-rose-950'
                        : 'bg-white border border-amber-300 text-slate-800 shadow-sm'
                      : 'border-2 border-dashed border-amber-200 bg-amber-100/40 text-amber-500'
                  }`}
                  onClick={() => item && toggleItem(item.id)}
                >
                  {item ? (
                    <>
                      <span className="text-2xl mb-0.5">{item.icon}</span>
                      <span className="text-[11px] font-semibold leading-tight line-clamp-1">{item.name}</span>
                      <span className="text-[9px] text-slate-500 mt-0.5">
                        {evaluated ? (item.isCorrect ? '✓ Valid' : '✗ Distractor') : 'Tap to remove'}
                      </span>
                    </>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Plus className="w-5 h-5 text-amber-400 mb-0.5" />
                      <span className="text-[10px] text-amber-600">Empty Slot</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Item Selection Roster */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 mb-2">
            Available Holiday Gear (Select {theme.targetCount}):
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {theme.items.map((item) => {
              const isSelected = packedItemIds.includes(item.id);
              let cardStyle = isSelected
                ? 'border-blue-600 bg-blue-50/90 text-blue-900 shadow-sm'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300';

              if (evaluated) {
                if (item.isCorrect && isSelected) {
                  cardStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950';
                } else if (!item.isCorrect && isSelected) {
                  cardStyle = 'border-rose-400 bg-rose-50 text-rose-900';
                }
              }

              return (
                <button
                  key={item.id}
                  disabled={evaluated}
                  onClick={() => toggleItem(item.id)}
                  className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition active:scale-[0.98] ${cardStyle}`}
                >
                  <span className="text-2xl shrink-0">{item.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold leading-tight line-clamp-1">{item.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                    </div>
                    <span className="text-[10px] text-slate-500 capitalize">{item.category}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Evaluation Summary */}
        {evaluated && (
          <div className="space-y-3 animate-in fade-in">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800">Packing Assessment</span>
                <span className="text-sm font-bold text-amber-600 tabular-nums">+{score} PTS</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {packedItems.map((item) => (
                  <li key={item.id} className="flex items-start gap-1.5">
                    {item.isCorrect ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    )}
                    <span>
                      <strong>{item.name}:</strong> {item.reason}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => onPlanHoliday(destination.id)}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-md hover:brightness-105 transition flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              Plan Your Holiday to {destination.name}
            </button>

            <div className="flex gap-2">
              <button
                onClick={handleRestart}
                className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Pack Another Bag
              </button>
              <button
                onClick={onBack}
                className="flex-1 py-2.5 px-3 rounded-xl bg-blue-900 text-white text-xs font-semibold hover:bg-blue-800"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Primary Packing CTA Button */}
        {!evaluated && (
          <button
            disabled={packedItemIds.length !== theme.targetCount}
            onClick={handleEvaluate}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition ${
              packedItemIds.length === theme.targetCount
                ? 'bg-blue-900 text-white hover:bg-blue-800 active:scale-[0.98]'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Luggage className="w-4 h-4" />
            {packedItemIds.length === theme.targetCount
              ? 'Zip Suitcase & Verify Packing'
              : `Select ${theme.targetCount - packedItemIds.length} More Item to Zip`}
          </button>
        )}
      </div>
    </div>
  );
};
