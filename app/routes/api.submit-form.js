import { json } from "@remix-run/node";
import prisma from "../db.server";
import { cors } from "remix-utils/cors";

const handleError = (request, message, status, details = null) => {
  return cors(request, json({ error: message, details }, { status }));
};

const validateFields = ({ name, email, phoneNumber }) => {
  if (!name || !email || !phoneNumber) {
    return {
      error: "Missing required fields",
      details: {
        name: !name ? "Name is required" : null,
        email: !email ? "Email is required" : null,
        phoneNumber: !phoneNumber ? "Phone number is required" : null
      }
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return { error: "Invalid email format" };

  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  if (!phoneRegex.test(phoneNumber)) return { error: "Invalid phone number format" };

  return null;
};

export const action = async ({ request }) => {
  if (request.method !== "POST") {
    return handleError(request, "Method not allowed", 405);
  }

  try {
    const { name, email, phoneNumber } = await request.json();

    const validationError = validateFields({ name, email, phoneNumber });
    if (validationError) return handleError(request, validationError.error, 400, validationError.details);

    const submission = await prisma.formSubmission.create({
      data: { name, email, phoneNumber },
    });

    return cors(request, json({ success: true, message: "Form submission successful", submissionId: submission.id }));

  } catch (error) {
    console.error("Form submission error:", error);
    return handleError(request, "An error occurred while processing your submission", 500, error.message);
  }
};

export const loader = async ({ request }) => {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" }
    });
  }
  return json({ error: "Method not allowed" }, { status: 405 });
};

export const headers = () => ({
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
});
