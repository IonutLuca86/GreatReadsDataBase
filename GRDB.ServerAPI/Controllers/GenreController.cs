
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using GRDB.ServerAPI.Services;
using GRDB.Server.Common.DTOs;
using GRDB.ServerAPI.Entities;

namespace GRDB.ServerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GenreController : ControllerBase
    {
        private readonly IDbService _db;
        public GenreController(IDbService db)
        {
            _db = db;
        }

        /// <summary>
        /// List all genres
        /// 
        
        [HttpGet]
        public async Task<List<GenreDTO>> ListAllGenres()
        {
            try
            {
                var genres = await _db.GetAllAsync<BookGenre, GenreDTO>();
                return genres;
            }
            catch { throw; }
        }
        /// <summary>
        /// List single author info by author id
        [HttpGet("{id}")]
        public async Task<GenreDTO> GetGenre(int id)
        {
            try
            {
                var genre = await _db.GetAsync<BookGenre, GenreDTO>(x => x.Id == id);
                return genre;
            }
            catch { throw; }
        }
        ///summary
        /// Get all books with same genre
        [HttpGet("{id:int}/books")]
        public async Task<List<BookDTO>> GetBooksByGenre(int genreId)
        {
            try
            {
                var books = await _db.ConnectionGetAsync<BookGenreConnection, BookDTO>(x => x.GenreId == genreId);
                return books;
            }
            catch { throw; }

        }

        ///summary
        /// Add a new genre <summary>
        /// summary
        /// </summary>
        /// <param name="genre"></param>
        /// <returns></returns>
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> InsertGenre([FromBody] GenreCreateDTO genre)
        {
            try
            {
                var newGenre = await _db.AddAsync<BookGenre, GenreCreateDTO>(genre);
                var result = await _db.SaveChangesAsync();
                if (!result)
                    return BadRequest();
                else
                    return Created($"api/{typeof(BookGenre).Name.ToLower()}s/{newGenre.Id}", newGenre);
            }
            catch(Exception ex) {
                Console.WriteLine(ex); return BadRequest(); 
                 }
        }

        ///summary
        /// Update an author info by id <summary>
        /// summary
        /// </summary>
        /// <param name="id"></param>
        /// <param name="dto"></param>
        /// <returns></returns>
        [Authorize]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateAuthor(int id, [FromBody] GenreDTO dto)
        {
            try
            {
                if (!await _db.AnyAsync<BookGenre>(x => x.Id.Equals(id)))
                    return NotFound();

                _db.UpdateAsync<BookGenre, GenreDTO>(id, dto);
                if (await _db.SaveChangesAsync())
                    return NoContent();
            }
            catch { return BadRequest("Update failed!"); }
            return BadRequest("Update failed!");
        }

        ///summary
        /// Delete author by id <summary>
        /// summary
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [Authorize]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteGenre(int id)
        {
            try
            {
                if (!await _db.DeleteAsync<BookGenre>(id))
                    return NotFound();
                if (await _db.SaveChangesAsync())
                    return NoContent();
            }
            catch { return BadRequest("Genre not found!"); }
            return BadRequest("Genre not found!");
        }

    }
}
