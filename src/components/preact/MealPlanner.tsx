import { useEffect, useState, useRef } from "preact/hooks";

interface DayMeal {
    label: string;
    text: string;
}

type Meals = Record<string, DayMeal[]>;

export default function MealPlanner() {
    const [meals, setMeals] = useState<Meals>({ monday: [{ label: "lunch", text: "" }, { label: "dinner", text: "" }] });
    const lunchRef = useRef<HTMLTextAreaElement | null>(null);
    const dinnerRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem("meals");
        if (stored) {
            try {
                const parsed = JSON.parse(stored) as Meals;
                // merge with defaults to ensure lunch/dinner exist
                setMeals(prev => ({
                    monday: [
                        { label: "lunch", text: parsed?.monday?.find(m => m.label === "lunch")?.text ?? prev.monday[0].text },
                        { label: "dinner", text: parsed?.monday?.find(m => m.label === "dinner")?.text ?? prev.monday[1].text },
                    ]
                }));
            } catch {
                // ignore parse errors
            }
        }
    }, []);

    const saveMeals = (next: Meals) => {
        setMeals(next);
        try {
            localStorage.setItem("meals", JSON.stringify(next));
        } catch {
            // ignore storage errors
        }
    };

    const setMealText = (day: string, label: string, text: string) => {
        setMeals(prev => {
            const dayArr = prev[day] ? prev[day].slice() : [];
            const idx = dayArr.findIndex(m => m.label === label);
            if (idx >= 0) dayArr[idx] = { ...dayArr[idx], text };
            else dayArr.push({ label, text });
            const updated = { ...prev, [day]: dayArr };
            try { localStorage.setItem("meals", JSON.stringify(updated)); } catch {}
            return updated;
        });
    };

    const adjustTextareaHeight = (e: Event) => {
        const ta = e.currentTarget as HTMLTextAreaElement;
        ta.style.height = "auto";
        ta.style.height = ta.scrollHeight + "px";
    };

    const handleInput =
        (day: string, label: string) =>
        (e: Event) => {
            const ta = e.currentTarget as HTMLTextAreaElement;
            const value = ta.value;
            adjustTextareaHeight(e);
            setMealText(day, label, value);
        };

    const monday = meals.monday ?? [{ label: "lunch", text: "" }, { label: "dinner", text: "" }];
    const lunchText = monday.find(m => m.label === "lunch")?.text ?? "";
    const dinnerText = monday.find(m => m.label === "dinner")?.text ?? "";

    return (
        <div class="meal-planner p-4 border rounded shadow-md max-w-md mx-auto">
            <h2 class="text-2xl font-bold mb-4">Monday</h2>

            <label class="block mb-2">
                <div class="font-medium mb-1">Lunch</div>
                <textarea
                    ref={lunchRef}
                    class="w-full p-2 h-content rounded resize-none"
                    placeholder="Enter your Monday lunch..."
                    onInput={handleInput("monday", "lunch")}
                    value={lunchText}
                />
            </label>

            <label class="block mt-4">
                <div class="font-medium mb-1">Dinner</div>
                <textarea
                    ref={dinnerRef}
                    class="w-full p-2 h-auto rounded resize-none"
                    placeholder="Enter your Monday dinner..."
                    onInput={handleInput("monday", "dinner")}
                    value={dinnerText}
                />
            </label>
        </div>
    );
}