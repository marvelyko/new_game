using System.ComponentModel.DataAnnotations;

namespace GameAuth.API.Models
{
    public class MessageRequest
    {
        [Required]
        public string Content { get; set; } = string.Empty;
        public string SenderNickname { get; set; } = string.Empty;
    }
}
