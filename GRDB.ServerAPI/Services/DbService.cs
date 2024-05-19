using AutoMapper;
using GRDB.ServerAPI.Context;
using GRDB.ServerAPI.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;


namespace GRDB.ServerAPI.Services
{
    public class DbService : IDbService
    {
        private readonly GrdbContext _dbContext;
        private readonly IMapper _mapper;

        public DbService(GrdbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }
        public void Include<TEntity>() where TEntity : class
        {
            var propertyNames = _dbContext.Model.FindEntityType(typeof(TEntity))?.GetNavigations().Select(e => e.Name);
            if (propertyNames != null)
            {
                foreach (var name in propertyNames)
                    _dbContext.Set<TEntity>().Include(name).Load();
            }
        }
        public async Task<bool> SaveChangesAsync() => await _dbContext.SaveChangesAsync() >= 0;
        public async Task<List<TDto>> GetAllAsync<TEntity, TDto>()
            where TEntity : class
            where TDto : class
        {
            var entities = await _dbContext.Set<TEntity>().ToListAsync();
            return _mapper.Map<List<TDto>>(entities);
        }
        public async Task<List<TDto>> GetAllAsyncbyId<TEntity, TDto>(Expression<Func<TEntity, bool>> expression)
            where TEntity : class
            where TDto : class
        {
            var entities = await _dbContext.Set<TEntity>().Where(expression).ToListAsync();
            return _mapper.Map<List<TDto>>(entities);
        }
        private async Task<TEntity?> GetAsync<TEntity>(Expression<Func<TEntity, bool>> expression) where TEntity : class => await _dbContext.Set<TEntity>().FirstOrDefaultAsync(expression);

        public async Task<TDto> GetAsync<TEntity, TDto>(Expression<Func<TEntity, bool>> expression) where TEntity : class where TDto : class
        {
            var entity = await _dbContext.Set<TEntity>().FirstOrDefaultAsync(expression);
            return _mapper.Map<TDto>(entity);
        }

        public async Task<bool> AnyAsync<TEntity>(Expression<Func<TEntity, bool>> expression) where TEntity : class => await _dbContext.Set<TEntity>().AnyAsync(expression);
        public async Task<List<TDto>> ConnectionGetAsync<TReferenceEntity, TDto>(Expression<Func<TReferenceEntity, bool>> expression) where TReferenceEntity : class, IReferenceEntity where TDto : class
        {
            var entities = await _dbContext.Set<TReferenceEntity>().Where(expression).ToListAsync();
            return _mapper.Map<List<TDto>>(entities);
        }

        public async Task<TEntity> AddAsync<TEntity, TDto>(TDto dto)
            where TEntity : class
            where TDto : class
        {
            var entity = _mapper.Map<TEntity>(dto);
            await _dbContext.Set<TEntity>().AddAsync(entity);
            return entity;
        }
        public async Task<TReferenceEntity> AddConnectionAsync<TReferenceEntity, TDto>(TDto dto)
         where TReferenceEntity : class
         where TDto : class
        {
            var entity = _mapper.Map<TReferenceEntity>(dto);
            await _dbContext.Set<TReferenceEntity>().AddAsync(entity);
            return entity;
        }

        public void UpdateAsync<TEntity, TDto>(int Id, TDto dto)
          where TEntity : class, IEntity
          where TDto : class
        {
            var entity = _mapper.Map<TEntity>(dto);
            entity.Id = Id;
            _dbContext.Set<TEntity>().Update(entity);
        }

        public void ConnectionUpdate<TReferenceEntity, TDto>(TDto dto) where TReferenceEntity : class, IEntity where TDto : class
        {
            var entity = _mapper.Map<TReferenceEntity>(dto);           
            _dbContext.Set<TReferenceEntity>().Update(entity);
        }

        public async Task<bool> DeleteAsync<TEntity>(int Id)
            where TEntity : class, IEntity
        {
            try
            {
                var entity = await GetAsync<TEntity>(e => e.Id.Equals(Id));
                if (entity != null)
                {
                    _dbContext.Remove(entity);
                    return true;
                }
                else
                    return false;
            }
            catch (Exception ex)
            {
                throw new Exception("Object not found", ex);
            }
        }
        public async Task<bool> DeleteAsync<TReferenceEntity, TDto>(TDto dto) where TReferenceEntity : class where TDto : class
        {
            try
            {
                var entity = _mapper.Map<TReferenceEntity>(dto);
                if (entity is null) return false;
                _dbContext.Remove(entity);
            }
            catch { throw; }

            return true;
        }
        

    }
}
