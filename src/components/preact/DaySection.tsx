import MealInput from './MealInput.tsx';

interface DaySectionProps {
  roomName: string;
  day: string;
  midi: string;
  soir: string;
}

export default function DaySection({ roomName, day, midi, soir }: DaySectionProps) {
  return (
    <>
      <div class="flex flex-col py-2">
        <p class="flex flex-col text-xl font-medium mb-2">
          {day.charAt(0).toUpperCase() + day.slice(1)}
        </p>
        <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
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
    </>
  );
}