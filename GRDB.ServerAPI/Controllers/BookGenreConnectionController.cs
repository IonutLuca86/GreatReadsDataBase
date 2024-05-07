
using GRDB.Server.Common.DTOs;
using GRDB.ServerAPI.Entities;
using GRDB.ServerAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GRDB.ServerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookGenreConnectionController : ControllerBase
    {
        private readonly IDbService _db;
        public BookGenreConnectionController(IDbService dbService)
        {
            _db = dbService;
        }

        ///summary
        ///add book genre connection <summary>
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddBookGenreConnection([FromBody] BookGenreConnectionDTO connection)
        {
            try
            {
                var newConnection = await _db.AddConnectionAsync<BookGenreConnection, BookGenreConnectionDTO>(connection);
                var result = await _db.SaveChangesAsync();
                if (!result)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, "Failed to save the connection");
                }
                return Ok(newConnection);
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to save the connection");
            }
        }

        ///summary
        ///delete book genre connection <summary>
        [Authorize]
        [HttpDelete]
        public async Task<IActionResult> DeleteBookGenreConnection([FromBody] BookGenreConnectionDTO connection)
        {
            try
            {
                var deletedConnection = await _db.DeleteAsync<BookGenreConnection, BookGenreConnectionDTO>(connection);
                var result = await _db.SaveChangesAsync();
                if (!result)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, "Failed to delete the connection");
                }
                return Ok(deletedConnection);
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to delete the connection");
            }
        }
    }
}
