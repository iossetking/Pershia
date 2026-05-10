'use client';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { XMarkIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon, SparklesIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useGarments } from '@/features/garments/hooks/useGarments';
import { useCreateOutfit } from '@/features/outfits/hooks/useOutfits';
import { API_BASE_URL, type Garment } from '@/features/garments/api/garments';
import { type OutfitGarmentPosition } from '@/features/outfits/api/outfits';
import { useAuth } from '@/app/context/AuthContext';

const MAX_GARMENTS = 8;

interface OutfitOption {
  title: string;
  description: string;
  garment_ids: number[];
}

// Category-aware vertical layout so tops end up above bottoms above shoes
function categoryRank(category: string): number {
  const c = category.toLowerCase();
  if (/jacket|coat|blazer|cardigan|hoodie|sweater/.test(c)) return 0;
  if (/top|shirt|blouse|tee|tank/.test(c)) return 1;
  if (/dress|jumpsuit/.test(c)) return 2;
  if (/pant|jean|trouser|legging/.test(c)) return 3;
  if (/skirt|short/.test(c)) return 4;
  if (/shoe|boot|sneaker|heel|sandal/.test(c)) return 5;
  return 3;
}

function autoLayout(garmentIds: number[], allGarments: Garment[]): OutfitGarmentPosition[] {
  const sorted = [...garmentIds].sort((a, b) => {
    const ga = allGarments.find(g => g.garment_id === a);
    const gb = allGarments.find(g => g.garment_id === b);
    return categoryRank(ga?.category ?? '') - categoryRank(gb?.category ?? '');
  });
  const n = sorted.length;
  return sorted.map((gid, i) => ({
    garment_id: gid,
    pos_top: n === 1 ? 25 : 5 + i * (70 / (n - 1)),
    pos_left: 25,
    pos_scale: 50,
    pos_z_index: i + 1,
  }));
}

// ── Step 1: Compose ───────────────────────────────────────────────────────────

function ComposeStep({
  message, setMessage,
  selectedIds, toggleGarment,
  garments,
  onRecommend, onClose,
  isLoading,
}: {
  message: string;
  setMessage: (v: string) => void;
  selectedIds: Set<number>;
  toggleGarment: (id: number) => void;
  garments: Garment[];
  onRecommend: () => void;
  onClose: () => void;
  isLoading: boolean;
}) {
  const canRecommend = message.trim().length > 0 && selectedIds.size > 0 && !isLoading;

  return (
    <div className="flex flex-col overflow-hidden min-h-0">
      <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100 shrink-0">
        <h2 className="text-lg font-bold text-gray-900">Outfit Recommendation</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="px-5 pt-4 pb-2 shrink-0">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">
          Your request <span className="text-red-400">*</span>
        </label>
        <textarea
          autoFocus
          rows={3}
          placeholder="e.g. I need a casual look for a Sunday brunch, leaning warm tones..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition resize-none"
        />
      </div>

      <div className="px-5 pb-2 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Attach garments
          </span>
          <span className="text-xs text-gray-400">
            {selectedIds.size}/{MAX_GARMENTS} selected
          </span>
        </div>

        {garments.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No garments in your wardrobe yet.</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {garments.map(g => {
              const selected = selectedIds.has(g.garment_id);
              const disabled = !selected && selectedIds.size >= MAX_GARMENTS;
              return (
                <button
                  key={g.garment_id}
                  onClick={() => !disabled && toggleGarment(g.garment_id)}
                  disabled={disabled}
                  className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all bg-gray-100
                    ${selected ? 'border-gray-800 shadow-md' : 'border-transparent'}
                    ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <img
                    src={`${API_BASE_URL}/${g.s3_url}`}
                    alt={g.category}
                    className="w-full h-full object-contain p-1"
                  />
                  {selected && (
                    <div className="absolute top-1.5 right-1.5 bg-gray-800 rounded-full p-0.5">
                      <CheckIcon className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="px-5 py-4 border-t border-gray-100 flex gap-3 shrink-0">
        <button
          onClick={onClose}
          className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onRecommend}
          disabled={!canRecommend}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gray-800 hover:bg-gray-900 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold text-sm transition-colors"
        >
          <SparklesIcon className="w-4 h-4" />
          Recommend
        </button>
      </div>
    </div>
  );
}

// ── Step 2: Loading ───────────────────────────────────────────────────────────

function LoadingStep() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 gap-5">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
        <div className="absolute inset-0 rounded-full border-4 border-t-gray-800 animate-spin" />
        <SparklesIcon className="absolute inset-0 m-auto w-6 h-6 text-gray-400" />
      </div>
      <div className="text-center">
        <p className="text-base font-semibold text-gray-800">Analyzing your wardrobe…</p>
        <p className="text-sm text-gray-400 mt-1">This takes 10–30 seconds</p>
      </div>
    </div>
  );
}

// ── Step 3: Carousel ──────────────────────────────────────────────────────────

function CarouselStep({
  options, allGarments, onClose, onStartOver,
}: {
  options: OutfitOption[];
  allGarments: Garment[];
  onClose: () => void;
  onStartOver: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const [savedIdx, setSavedIdx] = useState<number | null>(null);
  const createOutfit = useCreateOutfit();

  const option = options[idx];

  const handleSave = async () => {
    const garments = autoLayout(option.garment_ids, allGarments);
    await createOutfit.mutateAsync({
      title: option.title,
      description: option.description,
      garments,
    });
    setSavedIdx(idx);
  };

  const isSaved = savedIdx === idx;

  return (
    <>
      <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">Your recommendations</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Slide counter */}
      <div className="flex items-center justify-center gap-2 pt-3 pb-1">
        {options.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === idx ? 'bg-gray-800 w-5' : 'bg-gray-200'}`}
          />
        ))}
      </div>

      {/* Carousel viewport */}
      <div className="flex-1 overflow-hidden">
        <div
          className="flex h-full transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${idx * 100}%)` }}
        >
          {options.map((opt, i) => {
            const optGarments = opt.garment_ids
              .map(id => allGarments.find(g => g.garment_id === id))
              .filter(Boolean) as Garment[];

            return (
              <div key={i} className="min-w-full flex flex-col overflow-y-auto px-5 py-4 gap-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{opt.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">{opt.description}</p>
                </div>

                {/* Garment thumbnails */}
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-2">
                    Garments in this look
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {optGarments.map(g => (
                      <div key={g.garment_id} className="flex flex-col items-center gap-1">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                          <img
                            src={`${API_BASE_URL}/${g.s3_url}`}
                            alt={g.category}
                            className="w-full h-full object-contain p-1"
                          />
                        </div>
                        <span className="text-[10px] text-gray-400 capitalize max-w-[64px] text-center truncate">
                          {g.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation + actions */}
      <div className="px-5 py-4 border-t border-gray-100 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIdx(i => Math.max(0, i - 1))}
            disabled={idx === 0}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-30 transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
          </button>
          <span className="text-sm text-gray-400 font-medium">
            {idx + 1} of {options.length}
          </span>
          <button
            onClick={() => setIdx(i => Math.min(options.length - 1, i + 1))}
            disabled={idx === options.length - 1}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-30 transition-colors"
          >
            <ChevronRightIcon className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onStartOver}
            className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            Try again
          </button>
          <button
            onClick={handleSave}
            disabled={createOutfit.isPending || isSaved}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-colors
              ${isSaved
                ? 'bg-green-600 text-white'
                : 'bg-gray-800 hover:bg-gray-900 disabled:bg-gray-200 disabled:text-gray-400 text-white'
              }`}
          >
            {createOutfit.isPending ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isSaved ? (
              <><CheckIcon className="w-4 h-4" /> Saved!</>
            ) : (
              <><SparklesIcon className="w-4 h-4" /> Save this outfit</>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

// ── Root Modal ────────────────────────────────────────────────────────────────

type Step = 'compose' | 'loading' | 'results';

export default function RecommendModal({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const { data: garments = [] } = useGarments();

  const [step, setStep] = useState<Step>('compose');
  const [message, setMessage] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [options, setOptions] = useState<OutfitOption[]>([]);
  const [error, setError] = useState('');

  const toggleGarment = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleRecommend = async () => {
    setError('');
    setStep('loading');
    try {
      const { data } = await axios.post('http://localhost:8000/api/recommendations/', {
        message: message.trim(),
        garment_ids: Array.from(selectedIds),
        user_id: user?.user_id ?? 1,
      });
      if (!data.options?.length) throw new Error('No options returned');
      setOptions(data.options);
      setStep('results');
    } catch (e: unknown) {
      const msg = axios.isAxiosError(e)
        ? e.response?.data?.detail ?? e.message
        : 'Something went wrong. Please try again.';
      setError(msg);
      setStep('compose');
    }
  };

  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4"
      onClick={step === 'loading' ? undefined : onClose}
    >
      <div
        className="bg-white w-full md:max-w-2xl rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        style={{ maxHeight: '92dvh' }}
        onClick={e => e.stopPropagation()}
      >
        {step === 'compose' && (
          <>
            <ComposeStep
              message={message}
              setMessage={setMessage}
              selectedIds={selectedIds}
              toggleGarment={toggleGarment}
              garments={garments}
              onRecommend={handleRecommend}
              onClose={onClose}
              isLoading={false}
            />
            {error && (
              <p className="text-xs text-red-500 px-5 pb-3">{error}</p>
            )}
          </>
        )}

        {step === 'loading' && <LoadingStep />}

        {step === 'results' && (
          <CarouselStep
            options={options}
            allGarments={garments}
            onClose={onClose}
            onStartOver={() => { setStep('compose'); setOptions([]); setError(''); }}
          />
        )}
      </div>
    </div>,
    document.body
  );
}
