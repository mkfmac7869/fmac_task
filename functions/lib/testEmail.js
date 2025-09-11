"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.testEmailNotification = void 0;
const functions = __importStar(require("firebase-functions/v1"));
const resend_1 = require("resend");
// Initialize Resend
const resend = new resend_1.Resend(((_a = functions.config().resend) === null || _a === void 0 ? void 0 : _a.api_key) || process.env.RESEND_API_KEY || "re_cvqjHHqD_JBwRaMzooy3Abwq2graP49Wk");
// Test function to send a manual email
exports.testEmailNotification = functions.https.onCall(async (data, context) => {
    var _a;
    try {
        const { recipientEmail, recipientName, taskTitle, taskId } = data;
        if (!recipientEmail || !recipientName || !taskTitle) {
            throw new functions.https.HttpsError('invalid-argument', 'Missing required parameters');
        }
        console.log('Sending test email to:', recipientEmail);
        const emailSubject = `Test Email: ${taskTitle}`;
        const emailContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h1 style="color: #ea384c; margin-top: 0;">Test Email Notification</h1>
        <p>Hello ${recipientName},</p>
        <p>This is a test email to verify that the email notification system is working correctly.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0; color: #333;">${taskTitle}</h2>
          <p style="color: #555;">This is a test task to verify email notifications.</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 8px 0; color: #777;">Status:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #666;">Test</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #777;">Priority:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #e9a030;">Medium</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #777;">Due Date:</td>
              <td style="padding: 8px 0;">No due date</td>
            </tr>
          </table>
        </div>
        
        <p>If you received this email, the notification system is working correctly!</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://fmac-tasks.vercel.app/tasks/${taskId || 'test'}" 
             style="background-color: #ea384c; color: white; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-weight: bold;">
            View Task Details
          </a>
        </div>
        <p style="color: #999; font-size: 0.9em; text-align: center; margin-top: 40px;">
          This is a test message from FMAC Task Manager. Please do not reply to this email.
        </p>
      </div>
    `;
        const emailResponse = await resend.emails.send({
            from: "FMAC Task Manager <noreply@fmacajyal.com>",
            to: [recipientEmail],
            subject: emailSubject,
            html: emailContent,
        });
        console.log('Test email sent successfully:', emailResponse);
        return {
            success: true,
            messageId: (_a = emailResponse.data) === null || _a === void 0 ? void 0 : _a.id,
            message: 'Test email sent successfully'
        };
    }
    catch (error) {
        console.error('Error sending test email:', error);
        throw new functions.https.HttpsError('internal', 'Failed to send test email', error);
    }
});
//# sourceMappingURL=testEmail.js.map