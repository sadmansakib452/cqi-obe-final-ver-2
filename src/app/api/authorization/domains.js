// File: /src/pages/api/authorization/domains.js

/**
 * @fileoverview API route for managing authorized domains.
 * Supports GET, POST, and DELETE methods.
 */

import db from "../../../prisma";

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const domains = await db.authorizedDomain.findMany({
          select: { domain: true },
        });
        res.status(200).json({ domains: domains.map((d) => d.domain) });
      } catch (error) {
        console.error("Error fetching authorized domains:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
      break;

    case "POST":
      try {
        const { domain } = req.body;
        if (!domain || typeof domain !== "string") {
          return res.status(400).json({ error: "Invalid domain" });
        }

        // Validate domain format
        const domainRegex = /^@([A-Za-z0-9-]+\.)+[A-Za-z]{2,}$/;
        if (!domainRegex.test(domain)) {
          return res.status(400).json({ error: "Invalid domain format" });
        }

        // Create authorized domain
        await db.authorizedDomain.create({
          data: { domain: domain.toLowerCase() },
        });

        res
          .status(201)
          .json({ message: "Authorized domain added successfully" });
      } catch (error) {
        console.error("Error adding authorized domain:", error);
        if (error.code === "P2002") {
          // Unique constraint failed
          res.status(409).json({ error: "Domain already authorized" });
        } else {
          res.status(500).json({ error: "Internal Server Error" });
        }
      }
      break;

    case "DELETE":
      try {
        const { domain } = req.body;
        if (!domain || typeof domain !== "string") {
          return res.status(400).json({ error: "Invalid domain" });
        }

        // Delete authorized domain
        const deleted = await db.authorizedDomain.deleteMany({
          where: { domain: domain.toLowerCase() },
        });

        if (deleted.count === 0) {
          return res.status(404).json({ error: "Domain not found" });
        }

        res
          .status(200)
          .json({ message: "Authorized domain removed successfully" });
      } catch (error) {
        console.error("Error removing authorized domain:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
