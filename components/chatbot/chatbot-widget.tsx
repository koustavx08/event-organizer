"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, X, Send, Calendar, ChevronRight } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

interface QuickReply {
  id: string
  text: string
  action: () => void
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([])

  // Initialize chatbot with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: "welcome",
        text: "👋 Hi there! I'm EventBot, your EventHub assistant. How can I help you today?",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
      setQuickReplies([
        {
          id: "create-event",
          text: "How do I create an event?",
          action: () => handleQuickReply("How do I create an event?"),
        },
        {
          id: "rsvp",
          text: "How do RSVPs work?",
          action: () => handleQuickReply("How do RSVPs work?"),
        },
        {
          id: "account",
          text: "Account questions",
          action: () => handleQuickReply("I have questions about my account"),
        },
      ])
    }
  }, [messages.length])

  const toggleChatbot = () => {
    setIsOpen(!isOpen)
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Generate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue)
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: botResponse.text,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
      setQuickReplies(botResponse.quickReplies || [])
    }, 1000)
  }

  const handleQuickReply = (text: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Generate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(text)
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: botResponse.text,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
      setQuickReplies(botResponse.quickReplies || [])
    }, 1000)
  }

  const generateBotResponse = (userInput: string): { text: string; quickReplies?: QuickReply[] } => {
    const input = userInput.toLowerCase()

    if (input.includes("create") && input.includes("event")) {
      return {
        text: "Creating an event is easy! Here's how:\n\n1. Click 'Create Event' in your dashboard\n2. Fill in event details (name, date, location, description)\n3. Choose a category\n4. Add an image (optional)\n5. Click 'Create Event'\n\nYour event will be live immediately!",
        quickReplies: [
          {
            id: "rsvp-next",
            text: "How do RSVPs work?",
            action: () => handleQuickReply("How do RSVPs work?"),
          },
          {
            id: "edit-event",
            text: "Can I edit my event?",
            action: () => handleQuickReply("Can I edit my event?"),
          },
        ],
      }
    }

    if (input.includes("rsvp")) {
      return {
        text: "RSVPs help you track attendees! Here's what you need to know:\n\n• Attendees can RSVP to your events\n• They get a QR code ticket\n• You can scan QR codes for check-in\n• View RSVP counts in your dashboard\n• Attendees can cancel their RSVP anytime",
        quickReplies: [
          {
            id: "qr-code",
            text: "How do QR codes work?",
            action: () => handleQuickReply("How do QR codes work?"),
          },
          {
            id: "manage-attendees",
            text: "Managing attendees",
            action: () => handleQuickReply("How do I manage attendees?"),
          },
        ],
      }
    }

    if (input.includes("qr") || input.includes("check")) {
      return {
        text: "QR codes make check-in super easy!\n\n• Each RSVP gets a unique QR code\n• Attendees show their QR code at the event\n• Use the QR scanner in your dashboard\n• Instant check-in tracking\n• Works offline too!",
        quickReplies: [
          {
            id: "scanner",
            text: "Where is the QR scanner?",
            action: () => handleQuickReply("Where is the QR scanner?"),
          },
        ],
      }
    }

    if (input.includes("account") || input.includes("profile")) {
      return {
        text: "Account management options:\n\n• Update your profile in Settings\n• Change your password\n• View your event history\n• Manage notifications\n• Delete account (if needed)",
        quickReplies: [
          {
            id: "password",
            text: "Reset password",
            action: () => handleQuickReply("How do I reset my password?"),
          },
          {
            id: "notifications",
            text: "Notification settings",
            action: () => handleQuickReply("How do I manage notifications?"),
          },
        ],
      }
    }

    if (input.includes("edit") && input.includes("event")) {
      return {
        text: "Yes! You can edit your events:\n\n• Go to your Dashboard\n• Find your event\n• Click the edit (pencil) icon\n• Update any details\n• Save changes\n\nNote: Major changes might affect existing RSVPs.",
      }
    }

    if (input.includes("delete") || input.includes("cancel")) {
      return {
        text: "To delete/cancel an event:\n\n• Go to your Dashboard\n• Find your event\n• Click the delete (trash) icon\n• Confirm deletion\n\n⚠️ This will cancel all RSVPs and cannot be undone!",
      }
    }

    if (input.includes("scanner") || input.includes("where")) {
      return {
        text: "Find the QR scanner here:\n\n• Go to your Dashboard\n• Find your event\n• Click the QR code icon\n• Use your camera to scan attendee tickets\n\nYou can also upload QR code images!",
      }
    }

    if (input.includes("password") || input.includes("reset")) {
      return {
        text: "To reset your password:\n\n• Go to the login page\n• Click 'Forgot Password'\n• Enter your email\n• Check your email for reset link\n• Follow the instructions\n\nIf you don't receive an email, check your spam folder!",
      }
    }

    if (input.includes("notification")) {
      return {
        text: "Notification settings:\n\n• RSVP confirmations\n• Event reminders\n• Check-in notifications\n• Event updates\n\nYou can manage these in your account settings.",
      }
    }

    if (input.includes("help") || input.includes("support")) {
      return {
        text: "Need more help? Here are your options:\n\n• Browse our FAQ section\n• Contact support via email\n• Join our community forum\n• Check out video tutorials\n\nWhat specific issue are you facing?",
        quickReplies: [
          {
            id: "technical",
            text: "Technical issue",
            action: () => handleQuickReply("I have a technical issue"),
          },
          {
            id: "billing",
            text: "Billing question",
            action: () => handleQuickReply("I have a billing question"),
          },
        ],
      }
    }

    // Default response
    return {
      text: "I'm not sure about that specific question, but I'm here to help! Try asking about:\n\n• Creating events\n• Managing RSVPs\n• QR code check-ins\n• Account settings\n• General support\n\nWhat would you like to know?",
      quickReplies: [
        {
          id: "create-event-default",
          text: "Creating events",
          action: () => handleQuickReply("How do I create an event?"),
        },
        {
          id: "rsvp-default",
          text: "RSVP management",
          action: () => handleQuickReply("How do RSVPs work?"),
        },
        {
          id: "support-default",
          text: "Get support",
          action: () => handleQuickReply("I need help"),
        },
      ],
    }
  }

  return (
    <>
      {/* Chat Widget Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={toggleChatbot}
          className="h-14 w-14 rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-lg"
          size="icon"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="shadow-2xl border-0 bg-white">
              <CardHeader className="bg-indigo-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center text-lg">
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarImage src="/bot-avatar.png" />
                    <AvatarFallback className="bg-indigo-500 text-white">
                      <Calendar className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  EventBot
                  <span className="ml-auto text-xs opacity-75">Online</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="h-80 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.sender === "user" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {/* Quick Replies */}
                {quickReplies.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="space-y-2"
                  >
                    {quickReplies.map((reply) => (
                      <Button
                        key={reply.id}
                        variant="outline"
                        size="sm"
                        onClick={reply.action}
                        className="w-full justify-between text-left h-auto p-2"
                      >
                        <span className="text-xs">{reply.text}</span>
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                    ))}
                  </motion.div>
                )}
              </CardContent>

              <CardFooter className="p-4 border-t">
                <div className="flex w-full gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} size="icon" disabled={!inputValue.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
