import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Chat = ({ socket, username, room, setShowChat }) => {
  // State to hold the current message being typed by the user
  const [currentMessage, setCurrentMessage] = useState("");
  // State to hold the list of all messages in the chat
  const [messageList, setMessageList] = useState([]);

  // Utility function to format the time by adding leading zeros
  function padZeros(number) {
    return (number < 10 ? "0" : "") + number;
  }

  const leaveRoom = () => {
    console.log('inside leave room');
    setShowChat(false);
    toast.error(`${username} left the room`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
    // Emit an event to the server to leave the room
    socket.emit("leave_room", room);

    // Reset the UI to show the Join Room screen

  };
  // Function to send the current message
  const sendMessage = async () => {
    let now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    now = `${padZeros(hours)} : ${padZeros(minutes)} : ${padZeros(seconds)}`;

    // Ensure the message is not empty before sending
    if (currentMessage !== "") {
      const messageData = {
        room: room,  // Room to send the message to
        author: username,  // User sending the message
        message: currentMessage,  // The actual message content
        time: now,  // Time of sending
      };

      // Emit the message to the server
      await socket.emit("send_message", messageData);
      // Update the local message list with the new message
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");  // Clear the input after sending
    }
  };

  // useEffect to listen for incoming messages from the server
  useEffect(() => {
    socket.on("recieve_message", (data) => {
      setMessageList((list) => [...list, data]);  // Add the incoming message to the local message list
    });
  }, [socket]);

  return (
    <div className="flex flex-col h-full p-4 bg-white rounded-lg shadow-lg">
      <div className="bg-violet-800 text-white p-3 rounded-t-lg text-center font-semibold">
        <p>Live Chat Room: {room}</p>
      </div>

      {/* Chat message display area */}
      <div className="flex-grow overflow-y-auto p-4 bg-gray-100 rounded-b-lg space-y-4">
        {messageList.map((messageContent, index) => (
          <div key={index} className={`flex ${username === messageContent.author ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xs p-3 rounded-lg shadow-md ${username === messageContent.author ? "bg-green text-white" : "bg-blue-500 text-white"}`}>
              <p className="break-words">{messageContent.message}</p>
              <hr className="my-2 border-gray-300" />
              <div className="text-xs mt-1 flex justify-between">
                <span>{messageContent.time}</span>&nbsp;&nbsp;&nbsp;
                <span>{messageContent.author}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input area to type new messages */}
      <div className="flex mt-4">
        <input
          className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue"
          type="text"
          placeholder="Type a message..."
          value={currentMessage}
          onChange={(event) => setCurrentMessage(event.target.value)}  // Update currentMessage state
          onKeyDown={(e) => { e.key === 'Enter' ? sendMessage() : null }}  // Send the message when Enter is pressed
        />
        <button
          className="bg-blue text-white p-2 rounded-r-md hover:bg-blue-600 transition-colors"
          onClick={sendMessage}  // Send the message on button click
        >
          &#9658;
        </button>
      </div>
      <div className='flex justify-center'>
        <button
          className="bg-red font-semibold text-white p-2 rounded-xl hover:bg-red-600 transition-colors text-nowrap  w-28 ml-2 mt-[50px]"
          onClick={leaveRoom}>Leave Room</button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Chat;
