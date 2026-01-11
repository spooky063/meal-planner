import { defineDb, defineTable, column } from 'astro:db';

const Room = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    name: column.text({ unique: true }),
    createdAt: column.date({ default: new Date() })
  }
});

const Meal = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    roomId: column.text({ references: () => Room.columns.id }),
    day: column.text(),
    content: column.text({ optional: true }),
    updatedAt: column.date({ default: new Date() })
  }
});

export default defineDb({
  tables: { Room, Meal }
});