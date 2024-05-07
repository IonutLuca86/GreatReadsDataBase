
using GRDB.ServerAPI.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace GRDB.ServerAPI.Context
{
    public class GrdbContext : IdentityDbContext<GrdbUser, IdentityRole<int>, int>
    {
        public GrdbContext(DbContextOptions<GrdbContext> options) : base(options) { }

        public DbSet<GrdbUser> GrdbUser { get; set; }
        public DbSet<Book> Book { get; set; }
        public DbSet<BookReview> BookReview { get; set; }
        public DbSet<BookAuthor> BookAuthor { get; set; }
        public DbSet<BookGenre> BookGenre { get; set; }
        public DbSet<BookGenreConnection> BookGenreConnection { get; set; }
        public DbSet<BookAuthorConnection> BookAuthorConnection { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            foreach (var relationship in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            {
                relationship.DeleteBehavior = DeleteBehavior.Restrict;
            }

            modelBuilder.Entity<BookGenreConnection>().HasKey(bg => new { bg.BookId, bg.GenreId });
            modelBuilder.Entity<BookAuthorConnection>().HasKey(ba => new { ba.BookId, ba.AuthorId });

         
            modelBuilder.Entity<Book>()
                .HasMany(a => a.Authors)
                .WithMany(b => b.Books)
                .UsingEntity<BookAuthorConnection>().ToTable("BookAuthorConnection");

            modelBuilder.Entity<Book>()
                .HasMany(g => g.BookGenres)
                .WithMany(b => b.Books)
                .UsingEntity<BookGenreConnection>().ToTable("BookGenreConnection");


            modelBuilder.Entity<Book>()
                .HasMany(r => r.BookReviews)
                .WithOne(br => br.Book)
                .HasForeignKey(br => br.BookId);

            modelBuilder.Entity<BookReview>()
                .HasOne(r => r.User)
                .WithMany(u => u.Reviews)
                .HasForeignKey(r => r.UserId);

            modelBuilder.Entity<Book>()
                .HasOne(b => b.User)
                .WithMany(u => u.Books)
                .HasForeignKey(b => b.UserId);

            modelBuilder.Entity<IdentityUserRole<int>>()
                .HasKey(ur => new { ur.UserId, ur.RoleId });

            modelBuilder.Entity<IdentityUserRole<int>>()
                .HasOne<GrdbUser>() // Specify the type of the user entity
                .WithMany()
                .HasForeignKey(ur => ur.UserId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<IdentityUserRole<int>>()
                .HasOne<IdentityRole<int>>() // Specify the type of the role entity
                .WithMany()
                .HasForeignKey(ur => ur.RoleId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);
        }
      
    }
}
