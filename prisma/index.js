// @/prisma/index.js
const { PrismaClient } = require("@prisma/client");

// Create an instance of PrismaClient
const db = new PrismaClient();

// // Applying middleware for cascading deletes
// db.$use(async (params, next) => {
//   if (params.model === "User" && params.action === "delete") {
//     // Perform cascading delete for sessions associated with the user
//     await db.session.deleteMany({
//       where: {
//         userId: params.args.where.id,
//       },
//     });
//   }
//   return next(params);
// });

export default db
