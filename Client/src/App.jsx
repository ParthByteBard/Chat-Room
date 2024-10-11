import { useState } from 'react'
import io from 'socket.io-client'  // Import Socket.io client to establish communication with the server
import Chat from './Chat'  // Import the Chat component for displaying the chat interface
import { ToastContainer, toast } from 'react-toastify';  // Toast notifications to show feedback to the user
import 'react-toastify/dist/ReactToastify.css';  // Importing the styles for toast notifications


// Establish a connection to the Socket.io server running on localhost:3002
const socket = io.connect("http://localhost:3002");

function App() {
  // State to hold the username input by the user
  const [username, setUsername] = useState("");
  // State to hold the room ID input by the user
  const [room, setRoom] = useState("");
  // State to control whether the chat window is shown
  const [showChat, setShowChat] = useState(false);

  // Function to handle joining a room
  const joinRoom = () => {
    // Check if both username and room are provided
    if (username !== "" && room !== "") {
      // Emit the 'join_room' event to the server with the room ID as the payload
      socket.emit("join_room", room);
      // Display the chat window after joining the room
      setShowChat(true);
      // Use toast to notify the user that they have joined the room
      toast.success(`Welcome to room ${room}`, {
        position: "top-right",  // Position of the notification
        autoClose: 2000,  // The notification will disappear after 2 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",  // Custom theme for the notification
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[rgb(10,10,10)] font-roboto">
      {/* Conditionally render the join room interface or the chat component */}
      {/* If showchat is false !showChat is true so the home page will be rendered */}
      {!showChat ? (
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <p className="text-3xl font-semibold text-deep-purple mb-6">Join a Chat</p>

          {/* Input field for username */}
          <input
            className="border text-slate-800 border-gray-300 p-2 rounded-md w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue"
            type="text"
            placeholder="Enter your username"
            onChange={(e) => setUsername(e.target.value)}  // Update username state
          />

          {/* Input field for room ID */}
          <input
            className="border text-slate-800 border-gray-300 p-2 rounded-md w-full mb-6 focus:outline-none focus:ring-2 focus:ring-blue"
            type="text"
            placeholder="Enter Room ID"
            onChange={(e) => setRoom(e.target.value)}  // Update room state
            onKeyDown={(e) => { e.key === 'Enter' ? joinRoom() : null }}  // Allow joining room by pressing "Enter"
          />

          {/* Button to join the room */}
          <button
            className="w-full p-2 rounded-xl bg-blue text-white font-semibold hover:bg-blue-600 transition-colors"
            onClick={joinRoom}  // Call joinRoom when button is clicked
          >
            Join Room
          </button>
        </div>
      ) : (
        // Render the chat interface if the user has joined the room
        <div className="w-full max-w-4xl">
          <Chat socket={socket} username={username} room={room} setShowChat={setShowChat} />  {/* Passing socket, username, and room to Chat component */}
        </div>
      )}
      <ToastContainer />  {/* Container to show toast notifications */}
    </div>
  );
}

export default App;
