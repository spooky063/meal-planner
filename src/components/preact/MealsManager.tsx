import { useState, useEffect } from 'preact/hooks';
import DaySection from './DaySection.tsx';

interface MealsManagerProps {
  roomName: string;
}

export default function MealsManager({ roomName }: MealsManagerProps) {
  const [mealsData, setMealsData] = useState<Record<string, { midi: string; soir: string }>>({});
  const [isLoading, setIsLoading] = useState(true);

  const days = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

  useEffect(() => {
    // Charger les données depuis l'API
    fetch(`/api/meals/get?roomName=${encodeURIComponent(roomName)}`)
      .then(res => res.json())
      .then(data => {
        setMealsData(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Erreur lors du chargement:', err);
        setIsLoading(false);
      });
  }, [roomName]);

  if (isLoading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</div>;
  }

  return (
    <div class="meals-grid">
      {days.map(day => {
        const dayMeals = mealsData[day] || { midi: '', soir: '' };
        return (
          <DaySection
            key={day}
            roomName={roomName}
            day={day}
            midi={dayMeals.midi}
            soir={dayMeals.soir}
          />
        );
      })}
    </div>
  );
}