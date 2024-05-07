
using GRDB.Server.Common.DTOs;
using GRDB.ServerAPI.Entities;
using GRDB.ServerAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GRDB.ServerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        public readonly IDbService _db;

        public ReviewsController(IDbService db)
        {
            _db = db;
        }

        /// <summary>
        /// List all reviews for a specific user
        //[HttpGet("user/{id}")]
        //public async Task<IResult> ListAllReviewsbyUser(int userId)
        //{
        //    try
        //    {
        //        var reviews = await _db.GetAllAsyncbyId<BookReview, BookReviewDTO>(r => r.UserId == userId);
        //        return Results.Ok(reviews);
        //    }
        //    catch { return Results.NotFound("No items were found!"); }
        //}

        /// <summary>
        /// List all reviews for a specific book
        [HttpGet("book/{id}")]
        public async Task<IResult> ListAllReviewsbyBook(int bookId)
        {
            try
            {
                var reviews = await _db.GetAllAsyncbyId<BookReview, BookReviewDTO>(r => r.BookId == bookId);
                return Results.Ok(reviews);
            }
            catch { return Results.NotFound("No items were found!"); }
        }

        ///summary
        /// add new review <summary>
        /// summary
        /// </summary>
        /// <param name="review"></param>
        /// <returns></returns>
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> InsertReview([FromBody] BookReviewCreateDTO review)
        {
            try
            {
                var newReview = await _db.AddAsync<BookReview, BookReviewCreateDTO>(review);
                var result = await _db.SaveChangesAsync();
                if (!result)
                    return BadRequest();
                else
                    return Created($"api/{typeof(BookReview).Name.ToLower()}s/{newReview.Id}", newReview);
            }
            catch { return BadRequest(); }
        }

        ///summary
        /// Update a review by id <summary>
        /// summary
        /// </summary>
        /// <param name="id"></param>
        /// <param name="dto"></param>
        /// <returns></returns>
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReview(int id, [FromBody] BookReviewUpdateDTO dto)
        {
            try
            {
                if (!await _db.AnyAsync<BookReview>(x => x.Id.Equals(id)))
                    return NotFound();

                _db.UpdateAsync<BookReview, BookReviewUpdateDTO>(id, dto);
                if (await _db.SaveChangesAsync())
                    return NoContent();
            }
            catch { return BadRequest("Update failed!"); }
            return BadRequest("Update failed!");
        }

        ///summary
        /// Delete review by id <summary>
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBookReview(int id)
        {
            try
            {
                if (!await _db.DeleteAsync<BookReview>(id))
                    return NotFound();
                if (await _db.SaveChangesAsync())
                    return NoContent();
            }
            catch { return BadRequest("Book Review not found!"); }
            return BadRequest("Book Review not found!");
        }
    }
}
