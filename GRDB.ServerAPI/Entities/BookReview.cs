using GRDB.ServerAPI.Interfaces;

namespace GRDB.ServerAPI.Entities
{
    public class BookReview : IEntity
    {
        public int Id { get; set; }
        public int BookId { get; set; }
        public Book Book { get; set; }
        public int UserId { get; set; }
        public GrdbUser User { get; set; }
        public string ReviewContent { get; set; }
        public int Likes { get; set; }
        public int Dislikes { get; set; }
    }
}
