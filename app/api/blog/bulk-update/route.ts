import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface BlogUpdate {
  id: string;
  content?: string;
  generated_by_ai?: boolean;
  meta_description?: string;
  excerpt?: string;
}

interface BulkUpdateBody {
  updates: BlogUpdate[];
}

interface UpdateError {
  id: string;
  error: string;
}

const MAX_UPDATES_PER_REQUEST = 100;

function authenticate(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return false;

  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) return false;

  const token = match[1];
  const validToken =
    process.env.CRON_SECRET || process.env.BLOG_API_TOKEN || process.env.ADMIN_API_KEY || "";

  if (!validToken) return false;

  return token === validToken;
}

export async function POST(request: NextRequest) {
  // Authenticate
  if (!authenticate(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Parse body
  let body: BulkUpdateBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  if (!body.updates || !Array.isArray(body.updates)) {
    return NextResponse.json(
      { success: false, error: "Missing or invalid 'updates' array" },
      { status: 400 }
    );
  }

  if (body.updates.length === 0) {
    return NextResponse.json(
      { success: false, error: "No updates provided" },
      { status: 400 }
    );
  }

  if (body.updates.length > MAX_UPDATES_PER_REQUEST) {
    return NextResponse.json(
      {
        success: false,
        error: `Too many updates. Maximum ${MAX_UPDATES_PER_REQUEST} per request, got ${body.updates.length}`,
      },
      { status: 400 }
    );
  }

  // Validate each update has required fields
  const errors: UpdateError[] = [];
  const validUpdates: BlogUpdate[] = [];

  for (const update of body.updates) {
    if (!update.id || typeof update.id !== "string") {
      errors.push({ id: update.id || "unknown", error: "Missing or invalid id" });
      continue;
    }

    // Only include fields that are actually provided
    const fields = ["content", "generated_by_ai", "meta_description", "excerpt"] as const;
    const hasUpdateField = fields.some((field) => update[field] !== undefined);

    if (!hasUpdateField) {
      errors.push({ id: update.id, error: "No update fields provided" });
      continue;
    }

    validUpdates.push(update);
  }

  // Process updates - continue even if some fail
  let updatedCount = 0;

  for (const update of validUpdates) {
    try {
      // Build the data object with only provided fields
      const data: Record<string, unknown> = {};

      if (update.content !== undefined) {
        data.content = update.content;
      }
      if (update.generated_by_ai !== undefined) {
        data.generated_by_ai = update.generated_by_ai;
      }
      if (update.meta_description !== undefined) {
        data.meta_description = update.meta_description;
      }
      if (update.excerpt !== undefined) {
        data.excerpt = update.excerpt;
      }

      const result = await prisma.blogPost.update({
        where: { id: update.id },
        data,
      });

      if (result) {
        updatedCount++;
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unknown database error";
      errors.push({ id: update.id, error: message });
    }
  }

  return NextResponse.json({
    success: true,
    updatedCount,
    errors: errors.length > 0 ? errors : undefined,
  });
}
