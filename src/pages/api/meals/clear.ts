import type { APIRoute } from 'astro';
import { db, Room, Meal, eq } from 'astro:db';

export const POST: APIRoute = async ({ request }) => {
  const { roomName } = await request.json();

  if (!roomName) {
    return new Response('Nom de room requis', { status: 400 });
  }

  try {
    // Trouver la room
    const room = await db.select().from(Room).where(eq(Room.name, roomName)).get();

    if (!room) {
      return new Response('Room non trouvée', { status: 404 });
    }

    // Récupérer tous les meals de cette room
    const meals = await db.select().from(Meal).where(eq(Meal.roomId, room.id));

    // Vider le contenu de chaque meal
    for (const meal of meals) {
      await db.update(Meal)
        .set({
          content: JSON.stringify({ midi: '', soir: '' }),
          updatedAt: new Date()
        })
        .where(eq(Meal.id, meal.id));
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Erreur lors du nettoyage:', error);
    return new Response('Erreur serveur', { status: 500 });
  }
};