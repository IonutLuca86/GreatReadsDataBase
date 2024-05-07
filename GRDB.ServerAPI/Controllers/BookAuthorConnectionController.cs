
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
    public class BookAuthorConnectionController : ControllerBase
    {
        private readonly IDbService _db;
        public BookAuthorConnectionController(IDbService dbService)
        {
            _db = dbService;
        }
        ///summary
        ///set a book author connection <summary>
        /// summary
        /// </summary>
        /// <param name="connection"></param>
        /// <returns></returns>
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> SetBookAuthorConnection([FromBody] BookAuthorConnectionDTO connection)
        {
            try
            {
                var newConnection = await _db.AddConnectionAsync<BookAuthorConnection, BookAuthorConnectionDTO>(connection);
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
        ///delete a book author connection <summary>
        [Authorize]
        [HttpDelete]
        public async Task<IActionResult> DeleteBookAuthorConnection([FromBody] BookAuthorConnectionDTO connection)
        {
            try
            {
                var deletedConnection = await _db.DeleteAsync<BookAuthorConnection, BookAuthorConnectionDTO>(connection);
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
