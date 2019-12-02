using HOW.AspNetCore.Mvc.WebApp.Models.Lifetime;
using HOW.AspNetCore.Services.Lifetime;
using Microsoft.AspNetCore.Mvc;

namespace HOW.AspNetCore.Mvc.WebApp.Controllers
{
    public class LifetimeController : Controller
    {
        private readonly OperationService _operationService;
        private readonly IOperationTransient _transientOperation;
        private readonly IOperationScoped _scopedOperation;
        private readonly IOperationSingleton _singletonOperation;
        private readonly IOperationSingletonInstance _singletonInstanceOperation;

        public LifetimeController(
            OperationService operationService,
            IOperationTransient transientOperation,
            IOperationScoped scopedOperation,
            IOperationSingleton singletonOperation,
            IOperationSingletonInstance singletonInstanceOperation)
        {
            _operationService = operationService;
            _transientOperation = transientOperation;
            _scopedOperation = scopedOperation;
            _singletonOperation = singletonOperation;
            _singletonInstanceOperation = singletonInstanceOperation;
        }

        public IActionResult Index()
        {
            var vModel = new LifetimeViewModel
            {
                OperationService = _operationService,
                TransientOperation = _transientOperation,
                ScopedOperation = _scopedOperation,
                SingletonOperation = _singletonOperation,
                SingletonInstanceOperation = _singletonInstanceOperation
            };

            return View(vModel);
        }
    }
}