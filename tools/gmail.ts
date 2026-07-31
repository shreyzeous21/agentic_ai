import { tool } from "@langchain/core/tools";
import { z } from "zod";
import nodemailer from "nodemailer";
import { ENV } from "../utils/env";

let transport: nodemailer.Transporter | null = null;

function getTransport() {
  if (!transport) {
    transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      auth: {
        user: ENV.GMAIL_USER,
        pass: ENV.GMAIL_APP_PASSWORD,
      },
    });
  }
  return transport;
}

async function sendMail(params: {
  to: string;
  subject: string;
  body: string;
  cc?: string;
}) {
  try {
    const transporter = getTransport();
    await transporter.verify();
    const info = await transporter.sendMail({
      from: ENV.GMAIL_USER,
      to: params.to,
      cc: params.cc,
      subject: params.subject,
      text: params.body,
    });

    return JSON.stringify({
      success: true,
      messageId: info.messageId,
      accepted: info.accepted,
    });
  } catch (err: any) {
    return JSON.stringify({
      success: false,
      error: err?.message ?? "Failed to send email.",
    });
  }
}

export const gmailTool = tool(sendMail, {
  name: "gmail",
  description:
    "Send an email via Gmail SMTP. Requires GMAIL_USER and GMAIL_APP_PASSWORD in .env (use a Google App Password).",
  schema: z.object({
    to: z.string().describe("Recipient email address"),
    subject: z.string().describe("Email subject line"),
    body: z.string().describe("Plain text email body"),
    cc: z.string().optional().describe("CC recipient email address"),
  }),
});
