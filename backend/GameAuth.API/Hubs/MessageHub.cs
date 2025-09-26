using Microsoft.AspNetCore.SignalR;
using GameAuth.API.Models;
using GameAuth.API.Data;
using Microsoft.EntityFrameworkCore;

namespace GameAuth.API.Hubs
{
    public class MessageHub : Hub
    {
        private readonly ApplicationDbContext _context;
        private static readonly Dictionary<string, string> _userConnections = new();

        public MessageHub(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task JoinGroup(string nickname)
        {
            _userConnections[Context.ConnectionId] = nickname;
            await Groups.AddToGroupAsync(Context.ConnectionId, "AllUsers");
            await Clients.All.SendAsync("UserJoined", nickname);
        }

        public async Task SendMessage(string content, string senderNickname)
        {
            var message = new Message
            {
                Content = content,
                SenderNickname = senderNickname,
                Timestamp = DateTime.UtcNow,
                IsMatch = false
            };

            // Save message to database
            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            // Check for matching messages
            var matchingMessages = await _context.Messages
                .Where(m => m.Content == content && m.SenderNickname != senderNickname)
                .ToListAsync();

            if (matchingMessages.Any())
            {
                // Mark all matching messages as matches
                foreach (var match in matchingMessages)
                {
                    match.IsMatch = true;
                }
                message.IsMatch = true;
                await _context.SaveChangesAsync();

                // Get all unique users involved in the match
                var allMatchedUsers = matchingMessages.Select(m => m.SenderNickname).Concat(new[] { senderNickname }).Distinct().ToList();
                var usersList = string.Join(" and ", allMatchedUsers);

                // Notify all users about the match
                var matchMessage = $"🎉 MATCH FOUND! Users {usersList} both sent: '{content}' at {message.Timestamp:yyyy-MM-dd HH:mm:ss}";
                await Clients.All.SendAsync("ReceiveMatch", matchMessage, senderNickname, content, message.Timestamp);
            }
            else
            {
                // Send regular message
                await Clients.All.SendAsync("ReceiveMessage", content, senderNickname, message.Timestamp);
            }
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            if (_userConnections.TryGetValue(Context.ConnectionId, out var nickname))
            {
                _userConnections.Remove(Context.ConnectionId);
                await Clients.All.SendAsync("UserLeft", nickname);
            }
            await base.OnDisconnectedAsync(exception);
        }
    }
}
