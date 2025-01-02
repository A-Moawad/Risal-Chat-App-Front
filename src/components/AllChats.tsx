import React from "react";
import SingleChat from "./SingleChat";

function AllChats() {
  // Simulate chat data
  const chatData = [
    { id: 1, name: "Ahmed", message: "Hello!", time: "10:30 AM", unread: 3 },
    {
      id: 2,
      name: "Mohamed",
      message: "How are you?",
      time: "11:00 AM",
      unread: 0,
    },
    {
      id: 3,
      name: "Ali",
      message: "See you soon.",
      time: "12:15 PM",
      unread: 1,
    },
    { id: 4, name: "Hassan", message: "Thanks!", time: "1:45 PM", unread: 5 },
    { id: 5, name: "Hussein", message: "Goodbye!", time: "2:30 PM", unread: 0 },
    {
      id: 6,
      name: "Fatima",
      message: "Can I help you?",
      time: "3:00 PM",
      unread: 2,
    },
    {
      id: 7,
      name: "Sara",
      message: "Where are you?",
      time: "4:15 PM",
      unread: 0,
    },
    {
      id: 8,
      name: "Noora",
      message: "I need some time.",
      time: "5:30 PM",
      unread: 4,
    },
    {
      id: 9,
      name: "Mariam",
      message: "I can't believe it!",
      time: "6:45 PM",
      unread: 1,
    },
    {
      id: 10,
      name: "Aisha",
      message: "How was your day?",
      time: "7:30 PM",
      unread: 0,
    },
    {
      id: 11,
      name: "Yusuf",
      message: "Have a nice day.",
      time: "8:00 PM",
      unread: 3,
    },
    {
      id: 12,
      name: "Ibrahim",
      message: "Are you going to the party?",
      time: "9:00 PM",
      unread: 0,
    },
    {
      id: 13,
      name: "Omar",
      message: "Where have you been?",
      time: "10:15 PM",
      unread: 1,
    },
    {
      id: 14,
      name: "Fahd",
      message: "Why were you late?",
      time: "11:00 PM",
      unread: 5,
    },
    {
      id: 15,
      name: "Abdullah",
      message: "I need your help.",
      time: "11:30 PM",
      unread: 2,
    },
    {
      id: 16,
      name: "Noor",
      message: "Where are you?",
      time: "12:00 AM",
      unread: 0,
    },
    {
      id: 17,
      name: "Khadija",
      message: "I'm on my way.",
      time: "1:00 AM",
      unread: 4,
    },
    { id: 18, name: "Lina", message: "I'm done.", time: "2:00 AM", unread: 1 },
    {
      id: 19,
      name: "Razan",
      message: "I'll be there soon.",
      time: "3:00 AM",
      unread: 0,
    },
    {
      id: 20,
      name: "Hajar",
      message: "I need to talk to you.",
      time: "4:00 AM",
      unread: 2,
    },
    {
      id: 21,
      name: "Zaid",
      message: "Do you have time?",
      time: "5:00 AM",
      unread: 0,
    },
    {
      id: 22,
      name: "Sultan",
      message: "I'll be back soon.",
      time: "6:00 AM",
      unread: 5,
    },
    {
      id: 23,
      name: "Tariq",
      message: "I want to tell you something.",
      time: "7:00 AM",
      unread: 1,
    },
    {
      id: 24,
      name: "Amina",
      message: "Everything is fine.",
      time: "8:00 AM",
      unread: 0,
    },
    {
      id: 25,
      name: "Layla",
      message: "How can I assist you?",
      time: "9:00 AM",
      unread: 3,
    },
  ];

  return (
    <section className="flex flex-col gap-2">
      {chatData.map((chat) => (
        <SingleChat
          key={chat.id}
          name={chat.name}
          message={chat.message}
          time={chat.time}
          unread={chat.unread}
        />
      ))}
    </section>
  );
}

export default AllChats;
