import type { APIRoute } from 'astro';
import { db, eq, Room, Meal } from 'astro:db';

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const roomName = formData.get('roomName')?.toString().trim();

  if (!roomName) {
    return new Response('Nom de room requis', { status: 400 });
  }

  // Vérifier si la room existe déjà
  const existingRoom = await db.select().from(Room).where(eq(Room.name, roomName)).get();

  if (existingRoom) {
    return redirect(`/room/${roomName}`);
  }

  try {
    const roomId = crypto.randomUUID();

    // Créer la room
    await db.insert(Room).values({
      id: roomId,
      name: roomName,
      createdAt: new Date()
    });

    // Initialiser les 7 jours
    const days = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
    const meals = days.map(day => ({
      id: crypto.randomUUID(),
      roomId: roomId,
      day,
      content: JSON.stringify({ midi: '', soir: '' }),
      updatedAt: new Date()
    }));

    await db.insert(Meal).values(meals);

    // Rediriger vers la nouvelle room
    return redirect(`/room/${roomName}`);
  } catch (error) {
    console.error('Erreur lors de la création de la room:', error);
    return new Response('Erreur serveur', { status: 500 });
  }
};