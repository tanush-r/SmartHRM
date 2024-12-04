import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
import { MatDialogRef } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ChatbotService } from './Chat service';// Ensure the correct service path
import { marked } from 'marked'; // Import marked
import { SkeletonModule } from 'primeng/skeleton';

interface Message {
  sender: string;
  text: string;
  editable: boolean;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    FormsModule, 
    CommonModule, 
    MatFormFieldModule, 
    MatMenuModule, 
    MatCardModule, 
    MatButtonModule, 
    MatSelectModule, 
    MatIconModule, 
    MatToolbarModule,
    SkeletonModule
  ],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {
  messages: Message[] = [
    {
      sender: 'bot',
      text: 'Hello! I am AI Assistant, your assistant. How can I help you today?',
      editable: false
    }
  ];
  
  userInputForm = new FormControl('');  
  isLoading: boolean = false; // Loading state

  constructor(
    private dialogRef: MatDialogRef<ChatbotComponent>,
    private chatbotService: ChatbotService  
  ) {}

  ngOnInit() {}

  sendMessage() {
    const userText = this.userInputForm.value?.trim();
    
    // Ensure the user input is not empty
    if (!userText) {
      return; 
    }

    // Add the user's message to the chat
    this.addMessage('user', userText);

    // Set loading state to true
    this.isLoading = true;

    // Call the chatbot service to get the bot's response
    this.chatbotService.getBotResponse(userText).subscribe(
      (response: { human_response: string }) => {
        // Ensure the response is treated as a string
        const botResponseText = marked(response.human_response) as string; // Convert Markdown to HTML
        this.addMessage('bot', botResponseText);
      },
      error => {
        console.error('Error fetching bot response', error);
        this.addMessage('bot', 'Sorry, I could not process your request.'); 
      }
    );

    // Clear the input field after sending the message
    this.userInputForm.setValue('');
  }

  private addMessage(sender: string, text: string) {
    const message: Message = {
      sender,
      text,
      editable: false
    };
    this.messages.push(message);
    // Reset loading state if it's the bot's response
    if (sender === 'bot') {
      this.isLoading = false; // Reset loading state
    }
  }

  closeChatbot() {
    this.dialogRef.close();
  }
}
