import { useState, useEffect } from 'preact/hooks';

interface MealInputProps {
  roomName: string;
  day: string;
  mealType: 'midi' | 'soir';
  initialValue: string;
  label: string;
  icon: string;
}

export default function MealInput({
  roomName,
  day,
  mealType,
  initialValue,
  label,
  icon
}: MealInputProps) {
  const [value, setValue] = useState(initialValue);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [lastSavedValue, setLastSavedValue] = useState(initialValue);

  // Mettre à jour la valeur si initialValue change
  useEffect(() => {
    setValue(initialValue);
    setLastSavedValue(initialValue);
  }, [initialValue]);

  const handleBlur = async () => {
    // Ne sauvegarder que si la valeur a changé
    if (value === lastSavedValue) return;

    setIsSaving(true);
    setSaveStatus('idle');

    try {
      const response = await fetch('/api/meals/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomName,
          day,
          mealType,
          value
        })
      });

      if (response.ok) {
        setSaveStatus('saved');
        setLastSavedValue(value); // Mettre à jour la dernière valeur sauvegardée
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        setSaveStatus('error');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div class="meal-field">
      <label for={`${day}-${mealType}`}>
        {icon} {label}
        {isSaving && <span class="status-indicator saving"> Sauvegarde...</span>}
        {saveStatus === 'saved' && <span class="status-indicator saved"> ✓ Sauvegardé</span>}
        {saveStatus === 'error' && <span class="status-indicator error"> ✗ Erreur</span>}
      </label>
      <textarea
        id={`${day}-${mealType}`}
        value={value}
        onInput={(e) => setValue((e.target as HTMLTextAreaElement).value)}
        onBlur={handleBlur}
        placeholder={`Menu du ${mealType}...`}
      />
    </div>
  );
}