using System.ComponentModel.DataAnnotations;

namespace GameAuth.API.Models
{
    public class LoginRequest
    {
        [Required]
        public string Nickname { get; set; } = string.Empty;
        
        [Required]
        public string Password { get; set; } = string.Empty;
    }
}
