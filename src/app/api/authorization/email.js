// File: /src/pages/api/authorization/emails.js

/**
 * @fileoverview API route for managing authorized emails.
 * Supports GET, POST, and DELETE methods.
 */

import db from "../../../prisma";

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const emails = await db.authorizedEmail.findMany({
          select: { email: true },
        });
        res.status(200).json({ emails: emails.map((e) => e.email) });
      } catch (error) {
        console.error("Error fetching authorized emails:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
      break;

    case "POST":
      try {
        const { email } = req.body;
        if (!email || typeof email !== "string") {
          return res.status(400).json({ error: "Invalid email" });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({ error: "Invalid email format" });
        }

        // Create authorized email
        await db.authorizedEmail.create({
          data: { email: email.toLowerCase() },
        });

        res
          .status(201)
          .json({ message: "Authorized email added successfully" });
      } catch (error) {
        console.error("Error adding authorized email:", error);
        if (error.code === "P2002") {
          // Unique constraint failed
          res.status(409).json({ error: "Email already authorized" });
        } else {
          res.status(500).json({ error: "Internal Server Error" });
        }
      }
      break;

    case "DELETE":
      try {
        const { email } = req.body;
        if (!email || typeof email !== "string") {
          return res.status(400).json({ error: "Invalid email" });
        }

        // Delete authorized email
        const deleted = await db.authorizedEmail.deleteMany({
          where: { email: email.toLowerCase() },
        });

        if (deleted.count === 0) {
          return res.status(404).json({ error: "Email not found" });
        }

        res
          .status(200)
          .json({ message: "Authorized email removed successfully" });
      } catch (error) {
        console.error("Error removing authorized email:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
