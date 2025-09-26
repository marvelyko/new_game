using GameAuth.API.Models;
using GameAuth.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GameAuth.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessageController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MessageController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("history")]
        public async Task<ActionResult<IEnumerable<Message>>> GetMessageHistory()
        {
            var messages = await _context.Messages
                .OrderByDescending(m => m.Timestamp)
                .Take(50)
                .ToListAsync();

            return Ok(messages);
        }

        [HttpGet("matches")]
        public async Task<ActionResult<IEnumerable<Message>>> GetMatches()
        {
            var matches = await _context.Messages
                .Where(m => m.IsMatch)
                .OrderByDescending(m => m.Timestamp)
                .ToListAsync();

            return Ok(matches);
        }
    }
}
