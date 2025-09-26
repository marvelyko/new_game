import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';
import signalRService from '../services/signalRService';

const Dashboard = ({ user, onLogout }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await dashboardAPI.getDashboard();
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    const initializeSignalR = async () => {
      if (user?.nickname) {
        const connected = await signalRService.startConnection(user.nickname);
        if (connected) {
          // Set up event listeners
          signalRService.onReceiveMessage((content, senderNickname, timestamp) => {
            // Only show messages from the current user
            if (senderNickname === user.nickname) {
              const newMessage = {
                content,
                senderNickname,
                timestamp: new Date(timestamp),
                isMatch: false
              };
              setMessages(prev => [newMessage, ...prev]);
            }
          });

          signalRService.onReceiveMatch((matchMessage, senderNickname, content, timestamp) => {
            // Show match notifications for all users (both users involved in the match)
            const matchNotification = {
              content: matchMessage,
              senderNickname,
              timestamp: new Date(timestamp),
              isMatch: true
            };
            setMessages(prev => [matchNotification, ...prev]);
          });

        }
      }
    };

    fetchDashboardData();
    initializeSignalR();

    // Cleanup on unmount
    return () => {
      signalRService.stopConnection();
    };
  }, [user]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() && user?.nickname) {
      await signalRService.sendMessage(message.trim(), user.nickname);
      setMessage('');
    }
  };

  return (
    <div className="container">
      <div className="dashboard">
        <h1>Welcome, {user?.nickname}!</h1>
        <p>You have successfully logged in to the game authentication system.</p>
        
        {loading ? (
          <p>Loading dashboard...</p>
        ) : (
          <div>
            <p>{dashboardData?.message}</p>
            <p>Your phone number: {user?.phoneNumber}</p>
            <p>Account created: {new Date(user?.createdAt).toLocaleDateString()}</p>
          </div>
        )}


        {/* Message Input */}
        <div className="message-section">
          <h3>Send a Message</h3>
          <p>Type the same message as another user to get a match!</p>
          <form onSubmit={handleSendMessage} className="message-form">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="message-input"
              required
            />
            <button type="submit" className="send-button">
              Send
            </button>
          </form>
        </div>

        {/* Messages Display */}
        <div className="messages-section">
          <h3>Your Messages & Matches</h3>
          <p>Here are your sent messages and any successful matches!</p>
          <div className="messages-container">
            {messages.length === 0 ? (
              <p className="no-messages">No messages yet. Send a message to get started!</p>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className={`message ${msg.isMatch ? 'match-message' : 'regular-message'}`}>
                  <div className="message-header">
                    <span className="sender">You</span>
                    <span className="timestamp">{msg.timestamp.toLocaleString()}</span>
                  </div>
                  <div className="message-content">{msg.content}</div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <button onClick={onLogout} className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
