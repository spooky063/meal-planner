import MealInput from './MealInput.tsx';

interface DaySectionProps {
  roomName: string;
  day: string;
  midi: string;
  soir: string;
}

export default function DaySection({ roomName, day, midi, soir }: DaySectionProps) {
  return (
    <div class="day-section">
      <h2 class="day-title">{day}</h2>
      <div class="meal-inputs">
        <MealInput
          roomName={roomName}
          day={day}
          mealType="midi"
          initialValue={midi}
          label="Midi"
          icon="🌞"
        />
        <MealInput
          roomName={roomName}
          day={day}
          mealType="soir"
          initialValue={soir}
          label="Soir"
          icon="🌙"
        />
      </div>
    </div>
  );
}