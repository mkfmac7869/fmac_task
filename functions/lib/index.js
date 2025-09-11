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
exports.testEmailNotification = exports.sendTaskUpdateNotification = exports.sendTaskAssignmentNotification = exports.helloWorld = void 0;
const functions = __importStar(require("firebase-functions/v1"));
const admin = __importStar(require("firebase-admin"));
const resend_1 = require("resend");
const testEmail_1 = require("./testEmail");
Object.defineProperty(exports, "testEmailNotification", { enumerable: true, get: function () { return testEmail_1.testEmailNotification; } });
// Initialize Firebase Admin
admin.initializeApp();
// Initialize Resend
const resend = new resend_1.Resend(((_a = functions.config().resend) === null || _a === void 0 ? void 0 : _a.api_key) || process.env.RESEND_API_KEY || "re_cvqjHHqD_JBwRaMzooy3Abwq2graP49Wk");
// Simple test function
exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase Functions!");
});
// Cloud Function to send email notifications when a task is assigned
exports.sendTaskAssignmentNotification = functions
    .runWith({
    timeoutSeconds: 30,
    memory: '256MB'
})
    .firestore
    .document('tasks/{taskId}')
    .onCreate(async (snap, context) => {
    var _a, _b, _c;
    const taskData = snap.data();
    const taskId = context.params.taskId;
    console.log('New task created:', taskId, taskData);
    // Only send notification if task has an assignee
    if (!taskData.assigned_to) {
        console.log('No assignee found, skipping notification');
        return null;
    }
    try {
        // Parallel data fetching for better performance
        const [assigneeDoc, creatorDoc, projectDoc] = await Promise.all([
            admin.firestore().collection('profiles').doc(taskData.assigned_to).get(),
            admin.firestore().collection('profiles').doc(taskData.created_by).get(),
            taskData.project_id ? admin.firestore().collection('projects').doc(taskData.project_id).get() : Promise.resolve(null)
        ]);
        if (!assigneeDoc.exists) {
            console.log('Assignee profile not found:', taskData.assigned_to);
            return null;
        }
        const assigneeData = assigneeDoc.data();
        const creatorData = creatorDoc.exists ? creatorDoc.data() : {
            id: taskData.created_by,
            name: 'Unknown User',
            email: 'unknown@example.com'
        };
        // Get project name
        const projectName = (projectDoc === null || projectDoc === void 0 ? void 0 : projectDoc.exists) ?
            (((_a = projectDoc.data()) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown Project') : 'No Project';
        // Format due date
        const formattedDueDate = taskData.due_date ?
            new Date(taskData.due_date).toLocaleDateString() : 'No due date';
        // Format priority for display
        const priorityDisplay = taskData.priority ?
            (taskData.priority.charAt(0).toUpperCase() + taskData.priority.slice(1)) : '';
        // Create email content
        const emailSubject = `New Task Assigned: ${taskData.title}`;
        const emailContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h1 style="color: #ea384c; margin-top: 0;">New Task Assigned</h1>
          <p>Hello ${assigneeData.name},</p>
          <p>${creatorData.name} has assigned you a new task in FMAC Task Manager.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: #333;">${taskData.title}</h2>
            <p style="color: #555;">${taskData.description || 'No description provided'}</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <tr>
                <td style="padding: 8px 0; color: #777;">Project:</td>
                <td style="padding: 8px 0; font-weight: bold;">${projectName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #777;">Priority:</td>
                <td style="padding: 8px 0; font-weight: bold; color: ${taskData.priority === 'high' ? '#de4343' :
            taskData.priority === 'medium' ? '#e9a030' :
                '#35a167'};">${priorityDisplay}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #777;">Due Date:</td>
                <td style="padding: 8px 0;">${formattedDueDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #777;">Status:</td>
                <td style="padding: 8px 0; font-weight: bold; color: ${taskData.status === 'completed' ? '#35a167' :
            taskData.status === 'in_progress' ? '#e9a030' :
                '#666'};">${taskData.status.charAt(0).toUpperCase() + taskData.status.slice(1).replace('_', ' ')}</td>
              </tr>
            </table>
          </div>
          
          <p>Please log in to your account to view the complete task details and get started.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://fmac-tasks.vercel.app/tasks/${taskId}" 
               style="background-color: #ea384c; color: white; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-weight: bold;">
              View Task Details
            </a>
          </div>
          <p style="color: #999; font-size: 0.9em; text-align: center; margin-top: 40px;">
            This is an automated message from FMAC Task Manager. Please do not reply to this email.
          </p>
        </div>
      `;
        console.log('Sending email to:', assigneeData.email);
        // Send email using Resend (non-blocking)
        const emailResponse = await resend.emails.send({
            from: "FMAC Task Manager <noreply@fmacajyal.com>",
            to: [assigneeData.email],
            subject: emailSubject,
            html: emailContent,
        });
        console.log('Email notification sent successfully:', (_b = emailResponse.data) === null || _b === void 0 ? void 0 : _b.id);
        // Return immediately without waiting for full response
        return { success: true, messageId: (_c = emailResponse.data) === null || _c === void 0 ? void 0 : _c.id };
    }
    catch (error) {
        console.error('Error sending task assignment notification:', error);
        return null;
    }
});
// Cloud Function to send email notifications when a task is updated (reassigned)
exports.sendTaskUpdateNotification = functions
    .runWith({
    timeoutSeconds: 30,
    memory: '256MB'
})
    .firestore
    .document('tasks/{taskId}')
    .onUpdate(async (change, context) => {
    var _a, _b, _c;
    const beforeData = change.before.data();
    const afterData = change.after.data();
    const taskId = context.params.taskId;
    console.log('Task updated:', taskId);
    // Check if assignee changed
    if (beforeData.assigned_to === afterData.assigned_to) {
        console.log('Assignee unchanged, skipping notification');
        return null;
    }
    // Only send notification if task has a new assignee
    if (!afterData.assigned_to) {
        console.log('No new assignee found, skipping notification');
        return null;
    }
    try {
        // Parallel data fetching for better performance
        const [assigneeDoc, updaterDoc, projectDoc] = await Promise.all([
            admin.firestore().collection('profiles').doc(afterData.assigned_to).get(),
            admin.firestore().collection('profiles').doc(afterData.created_by).get(),
            afterData.project_id ? admin.firestore().collection('projects').doc(afterData.project_id).get() : Promise.resolve(null)
        ]);
        if (!assigneeDoc.exists) {
            console.log('New assignee profile not found:', afterData.assigned_to);
            return null;
        }
        const assigneeData = assigneeDoc.data();
        const updaterData = updaterDoc.exists ? updaterDoc.data() : {
            id: afterData.created_by,
            name: 'Unknown User',
            email: 'unknown@example.com'
        };
        // Get project name
        const projectName = (projectDoc === null || projectDoc === void 0 ? void 0 : projectDoc.exists) ?
            (((_a = projectDoc.data()) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown Project') : 'No Project';
        // Format due date
        const formattedDueDate = afterData.due_date ?
            new Date(afterData.due_date).toLocaleDateString() : 'No due date';
        // Format priority for display
        const priorityDisplay = afterData.priority ?
            (afterData.priority.charAt(0).toUpperCase() + afterData.priority.slice(1)) : '';
        // Create email content
        const emailSubject = `Task Reassigned: ${afterData.title}`;
        const emailContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h1 style="color: #ea384c; margin-top: 0;">Task Reassigned to You</h1>
          <p>Hello ${assigneeData.name},</p>
          <p>${updaterData.name} has reassigned a task to you in FMAC Task Manager.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: #333;">${afterData.title}</h2>
            <p style="color: #555;">${afterData.description || 'No description provided'}</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <tr>
                <td style="padding: 8px 0; color: #777;">Project:</td>
                <td style="padding: 8px 0; font-weight: bold;">${projectName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #777;">Priority:</td>
                <td style="padding: 8px 0; font-weight: bold; color: ${afterData.priority === 'high' ? '#de4343' :
            afterData.priority === 'medium' ? '#e9a030' :
                '#35a167'};">${priorityDisplay}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #777;">Due Date:</td>
                <td style="padding: 8px 0;">${formattedDueDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #777;">Status:</td>
                <td style="padding: 8px 0; font-weight: bold; color: ${afterData.status === 'completed' ? '#35a167' :
            afterData.status === 'in_progress' ? '#e9a030' :
                '#666'};">${afterData.status.charAt(0).toUpperCase() + afterData.status.slice(1).replace('_', ' ')}</td>
              </tr>
            </table>
          </div>
          
          <p>Please log in to your account to view the complete task details and get started.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://fmac-tasks.vercel.app/tasks/${taskId}" 
               style="background-color: #ea384c; color: white; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-weight: bold;">
              View Task Details
            </a>
          </div>
          <p style="color: #999; font-size: 0.9em; text-align: center; margin-top: 40px;">
            This is an automated message from FMAC Task Manager. Please do not reply to this email.
          </p>
        </div>
      `;
        console.log('Sending reassignment email to:', assigneeData.email);
        // Send email using Resend (non-blocking)
        const emailResponse = await resend.emails.send({
            from: "FMAC Task Manager <noreply@fmacajyal.com>",
            to: [assigneeData.email],
            subject: emailSubject,
            html: emailContent,
        });
        console.log('Reassignment email notification sent successfully:', (_b = emailResponse.data) === null || _b === void 0 ? void 0 : _b.id);
        // Return immediately without waiting for full response
        return { success: true, messageId: (_c = emailResponse.data) === null || _c === void 0 ? void 0 : _c.id };
    }
    catch (error) {
        console.error('Error sending task reassignment notification:', error);
        return null;
    }
});
//# sourceMappingURL=index.js.map