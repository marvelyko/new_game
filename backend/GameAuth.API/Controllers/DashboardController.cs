using Microsoft.AspNetCore.Mvc;

namespace GameAuth.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetDashboard()
        {
            return Ok(new { message = "Welcome to the dashboard!" });
        }
    }
}
