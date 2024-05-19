using GRDB.ServerAPI.Interfaces;
using System.ComponentModel.DataAnnotations;

namespace GRDB.ServerAPI.Entities
{
    public class Book : IEntity
    {
        public int Id { get; set; }
        public string? ISBN { get; set; }   
        public string Title { get; set; }
        public string? Publisher { get; set; }
        public string? PublishedDate { get; set; }
        public string? Language { get; set; }
        public string? CoverUrl { get; set; }
        public string? BookUrl { get; set; }

        public int UserId { get; set; }
        public GrdbUser User { get; set; }

        public virtual ICollection<BookGenre>? BookGenres { get; set; }
        public virtual ICollection<BookAuthor>? Authors { get; set; }
        public virtual ICollection<BookReview>? BookReviews { get; set; }
    }
}
