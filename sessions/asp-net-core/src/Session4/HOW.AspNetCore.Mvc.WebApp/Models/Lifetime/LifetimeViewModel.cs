using HOW.AspNetCore.Services.Lifetime;

namespace HOW.AspNetCore.Mvc.WebApp.Models.Lifetime
{
    public class LifetimeViewModel
    {
        public OperationService OperationService { get; set; }
        public IOperationTransient TransientOperation { get; set; }
        public IOperationScoped ScopedOperation { get; set; }
        public IOperationSingleton SingletonOperation { get; set; }
        public IOperationSingletonInstance SingletonInstanceOperation { get; set; }
    }
}
