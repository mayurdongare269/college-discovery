'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCompare } from '@/lib/compare-context';
import toast from 'react-hot-toast';

interface ClientActionsProps {
  collegeId: number;
  collegeName: string;
  initialSaved?: boolean;
}

export default function ClientActions({ collegeId, collegeName, initialSaved = false }: ClientActionsProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  const inCompare = isInCompare(collegeId);

  const handleSave = async () => {
    if (!session) {
      toast.error('Please login to save colleges');
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      const method = saved ? 'DELETE' : 'POST';
      const response = await fetch('/api/saved', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collegeId }),
      });

      const data = await response.json();

      if (data.success) {
        setSaved(!saved);
        toast.success(saved ? 'Removed from saved colleges' : 'College saved successfully!');
      } else {
        toast.error(data.error || 'Failed to update saved status');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = () => {
    if (inCompare) {
      removeFromCompare(collegeId);
      toast.success('Removed from compare list');
    } else {
      const added = addToCompare(collegeId);
      if (added) {
        toast.success('Added to compare list');
      } else {
        toast.error('Maximum 3 colleges can be compared');
      }
    }
  };

  return (
    <div className="mt-6 flex flex-wrap gap-4">
      <button
        onClick={handleSave}
        disabled={loading}
        className={`px-6 py-3 font-semibold rounded-lg transition-colors ${
          saved
            ? 'bg-red-100 text-red-700 hover:bg-red-200'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        } disabled:opacity-50`}
      >
        {saved ? '💔 Unsave College' : '❤️ Save College'}
      </button>
      <button
        onClick={handleCompare}
        className={`px-6 py-3 font-semibold rounded-lg transition-colors ${
          inCompare
            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
            : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50'
        }`}
      >
        {inCompare ? '✓ In Compare List' : '⚖️ Add to Compare'}
      </button>
    </div>
  );
}
