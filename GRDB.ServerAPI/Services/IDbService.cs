using GRDB.ServerAPI.Interfaces;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace GRDB.ServerAPI.Services
{
    public interface IDbService
    {
        Task<bool> SaveChangesAsync();
        void Include<TEntity>() where TEntity : class;
        Task<TEntity> AddAsync<TEntity, TDto>(TDto dto)
            where TEntity : class
            where TDto : class;
        Task<TReferenceEntity> AddConnectionAsync<TReferenceEntity, TDto>(TDto dto)
         where TReferenceEntity : class
         where TDto : class;

        Task<TDto> GetAsync<TEntity, TDto>(Expression<Func<TEntity, bool>> expression)
        where TEntity : class
        where TDto : class;
        Task<List<TDto>> GetAllAsync<TEntity, TDto>()
          where TEntity : class
          where TDto : class;
        Task<List<TDto>> GetAllAsyncbyId<TEntity, TDto>(Expression<Func<TEntity, bool>> expression)
           where TEntity : class
           where TDto : class;

        Task<bool> AnyAsync<TEntity>(Expression<Func<TEntity, bool>> expression) where TEntity : class;

        Task<List<TDto>> ConnectionGetAsync<TReferenceEntity, TDto>(Expression<Func<TReferenceEntity, bool>> expression)
            where TReferenceEntity : class, IReferenceEntity
            where TDto : class;

        void UpdateAsync<TEntity, TDto>(int Id, TDto dto)
           where TEntity : class, IEntity
           where TDto : class;

        Task<bool> DeleteAsync<TEntity>(int Id)
          where TEntity : class, IEntity;

        Task<bool> DeleteAsync<TReferenceEntity, TDto>(TDto dto) where TReferenceEntity : class where TDto : class;
        void ConnectionUpdate<TReferenceEntity, TDto>(TDto dto) where TReferenceEntity : class, IEntity where TDto : class;
    }
}
