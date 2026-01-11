import type { APIRoute } from 'astro';
import { db, Room, Meal, eq, and } from 'astro:db';

export const POST: APIRoute = async ({ request }) => {
  const { roomName, day, mealType, value } = await request.json();

  if (!roomName || !day || !mealType) {
    return new Response('Paramètres manquants', { status: 400 });
  }

  try {
    // Trouver la room
    const room = await db.select().from(Room).where(eq(Room.name, roomName)).get();

    if (!room) {
      return new Response('Room non trouvée', { status: 404 });
    }

    // Trouver le meal pour ce jour
    const meal = await db.select().from(Meal)
      .where(and(
        eq(Meal.roomId, room.id),
        eq(Meal.day, day)
      ))
      .get();

    if (meal) {
      // Mettre à jour le meal existant
      const content = JSON.parse(meal.content || '{"midi": "", "soir": ""}');
      content[mealType] = value;

      await db.update(Meal)
        .set({
          content: JSON.stringify(content),
          updatedAt: new Date()
        })
        .where(eq(Meal.id, meal.id));
    } else {
      // Créer un nouveau meal si inexistant
      const content = { midi: '', soir: '' };
      content[mealType] = value;

      await db.insert(Meal).values({
        id: crypto.randomUUID(),
        roomId: room.id,
        day,
        content: JSON.stringify(content),
        updatedAt: new Date()
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    return new Response('Erreur serveur', { status: 500 });
  }
};