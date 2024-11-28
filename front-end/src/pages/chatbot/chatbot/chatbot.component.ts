import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { CommonModule } from '@angular/common'; // Import CommonModule
import { MatDialogRef } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ChatbotService } from './Chat service';  // Import the ChatbotService


interface Message {
  sender: string;
  text: string;
  editable: boolean;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, MatFormFieldModule, MatMenuModule, MatCardModule, MatButtonModule, MatSelectModule, MatIconModule, MatToolbarModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {

  prompt: string = '';  // This will bind to the input field
  messages: Message[] = [
    {
      sender: 'bot',
      text: 'Hello! I am AI Assistant, your assistant. How can I help you today?',
      editable: false
    }
  ];
  userInputForm = new FormControl('');  // Input field form control
  editingIndex: number | null = null;   // Track which message is being edited

  constructor(
    private router: Router,
    private dialogRef: MatDialogRef<ChatbotComponent>,
    private chatbotService: ChatbotService  // Inject the ChatbotService
  ) {}

  ngOnInit() {}

  sendMessage() {
    const userText = this.userInputForm.value?.trim();
    if (!userText) {
      return; // Prevent adding empty messages
    }

    if (this.editingIndex !== null) {
      // If editing a message, update it
      this.messages[this.editingIndex].text = userText;
      this.editingIndex = null; // Reset editing index
    } else {
      // Add new user's message
      const userMessage: Message = {
        sender: 'user',
        text: userText,
        editable: true  // Allow editing of the message
      };
      this.messages.push(userMessage);

      // Call the service to get the bot's response
      this.chatbotService.getBotResponse(userText).subscribe((response: string) => {
        const botMessage: Message = {
          sender: 'bot',
          text: response,
          editable: false
        };
        this.messages.push(botMessage);  // Add bot response to the message list
      });
    }

    // Clear input field after sending
    this.userInputForm.setValue('');
  }

  editMessage(index: number) {
    // Set the input field value to the message text for editing
    this.userInputForm.setValue(this.messages[index].text);
    this.editingIndex = index;  // Mark the message as being edited
  }

  closeChatbot() {
    this.dialogRef.close();
  }
}