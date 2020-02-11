using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using BookService.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

// used tutorial found here to build this Api: https://docs.microsoft.com/en-us/aspnet/core/tutorials/first-web-api

namespace BookService.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class BooksController : Controller
    {
        AngularWorkshopContext _context;

        public BooksController(AngularWorkshopContext context)
        {
            _context = context;
        }


        // GET books
        [HttpGet]
        public async Task<IEnumerable<Book>> GetAll()
        {
            return await _context.Book.ToListAsync();
        }

        // GET books/5
        [HttpGet("{id:int}")]
        public IActionResult Get(int id)
        {
            var book = _context.Book.FirstOrDefault(b => b.Id == id);
            if (book == null)
            {
                return NotFound();
            }
            return new ObjectResult(book);
        }

        // GET books/smith
        //[HttpGet("{name:alpha}")]
        //public IActionResult GetName(string name)
        //{
        //    var book = _context.Book.FirstOrDefault(b => b.Author == name);
        //    if (book == null)
        //    {
        //        return NotFound();
        //    }
        //    return new ObjectResult(book);
        //}

        // POST books
        [HttpPost]
        public IActionResult Post([FromBody]Book book)
        {
            if (book == null)
            {
                return BadRequest();
            }

            _context.Add(book);
            _context.SaveChanges();

            return CreatedAtAction("Get", new { id = book.Id }, book);
        }

        // PUT books
        [HttpPut]
        public IActionResult Put([FromBody]Book bookToLookup)
        {
            if (bookToLookup == null)
            {
                return BadRequest();
            }

            var book = _context.Book.FirstOrDefault(b => b.Id == bookToLookup.Id);
            if (book == null)
            {
                return NotFound();
            }

            book.Id = bookToLookup.Id;
            book.Title= bookToLookup.Title;
            book.Author = bookToLookup.Author;
            book.IsCheckedOut = bookToLookup.IsCheckedOut;
            book.Rating= bookToLookup.Rating;

            _context.Book.Update(book);
            _context.SaveChanges();
            return new NoContentResult();
        }

        // DELETE books/1
        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
        {
            var book = _context.Book.FirstOrDefault(b => b.Id == id);
            if (book== null)
            {
                return NotFound();
            }

            _context.Book.Remove(book);
            _context.SaveChanges();
            return new NoContentResult();
        }

        //// GET books/next
        //[HttpGet("next")]
        //public int GetNextId()
        //{
        //    return _context.Book.Count() == 0 ? 1 : _context.Book.OrderByDescending(b => b.Id).FirstOrDefault().Id + 1;
        //}

        // GET books/canActivate
        [HttpGet("canactivate/{id:int}")]
        public bool CanActivate(int id)
        {
            return _context.Book.FirstOrDefault(b => b.Id == id) != null ? true : false;
        }

    }
}
