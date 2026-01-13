
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TaskNotificationRequest {
  taskId: string;
  taskTitle: string;
  taskDescription: string;
  dueDate?: string | null;
  priority?: string;
  recipientEmail: string;
  recipientName: string;
  assignerName: string;
  commentNotification?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Task notification function invoked");
    
    const { 
      taskId, 
      taskTitle, 
      taskDescription, 
      dueDate, 
      priority, 
      recipientEmail, 
      recipientName,
      assignerName,
      commentNotification = false
    }: TaskNotificationRequest = await req.json();
    
    console.log("Notification data:", { 
      taskId, 
      taskTitle, 
      recipientEmail, 
      commentNotification 
    });

    // Format due date if provided
    const formattedDueDate = dueDate ? new Date(dueDate).toLocaleDateString() : 'No due date';

    // Format priority for display
    const priorityDisplay = priority ? (priority.charAt(0).toUpperCase() + priority.slice(1)) : '';

    let emailSubject;
    let emailContent;

    if (commentNotification) {
      console.log("Preparing comment notification email");
      emailSubject = `New Comment on Task: ${taskTitle}`;
      emailContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h1 style="color: #ea384c; margin-top: 0;">New Comment on Task</h1>
          <p>Hello ${recipientName},</p>
          <p>${assignerName} has commented on a task assigned to you in FMAC Task Manager.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: #333;">${taskTitle}</h2>
            <p style="color: #555; font-style: italic;">"${taskDescription}"</p>
          </div>
          
          <p>Please log in to your account to view the complete task details and respond.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://taskfmac.dev/tasks/${taskId}" 
               style="background-color: #ea384c; color: white; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-weight: bold;">
              View Task Details
            </a>
          </div>
          <p style="color: #999; font-size: 0.9em; text-align: center; margin-top: 40px;">
            This is an automated message from FMAC Task Manager. Please do not reply to this email.
          </p>
        </div>
      `;
    } else {
      // Original task assignment notification
      console.log("Preparing task assignment notification email");
      emailSubject = `New Task Assigned: ${taskTitle}`;
      emailContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h1 style="color: #ea384c; margin-top: 0;">New Task Assigned</h1>
          <p>Hello ${recipientName},</p>
          <p>${assignerName} has assigned you a new task in FMAC Task Manager.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: #333;">${taskTitle}</h2>
            <p style="color: #555;">${taskDescription}</p>
            ${priority ? `
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <tr>
                <td style="padding: 8px 0; color: #777;">Priority:</td>
                <td style="padding: 8px 0; font-weight: bold; color: ${
                  priority === 'high' ? '#de4343' : 
                  priority === 'medium' ? '#e9a030' : 
                  '#35a167'
                };">${priorityDisplay}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #777;">Due Date:</td>
                <td style="padding: 8px 0;">${formattedDueDate}</td>
              </tr>
            </table>
            ` : ''}
          </div>
          
          <p>Please log in to your account to view the complete task details and get started.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://taskfmac.dev/tasks/${taskId}" 
               style="background-color: #ea384c; color: white; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-weight: bold;">
              View Task Details
            </a>
          </div>
          <p style="color: #999; font-size: 0.9em; text-align: center; margin-top: 40px;">
            This is an automated message from FMAC Task Manager. Please do not reply to this email.
          </p>
        </div>
      `;
    }
    
    console.log("Sending email to:", recipientEmail);

    const emailResponse = await resend.emails.send({
      from: "FMAC Task Manager <onboarding@resend.dev>",
      to: [recipientEmail],
      subject: emailSubject,
      html: emailContent,
    });

    console.log("Email notification sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error sending task notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
