using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;



namespace API.Controllers;

[Authorize]
public class TasksController(AppDbContext context) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserTaskDto>>> GetUserTasks()
    {
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var tasks = await context.Tasks
            .Where(t => t.AppUserId == currentUserId)
            .Select(t => new UserTaskDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                IsCompleted = t.IsCompleted,
                CreatedAt = t.CreatedAt
            })
            .ToListAsync();

        return Ok(tasks);
    }

    [HttpPost]
    public async Task<ActionResult<UserTaskDto>> CreateTask(CreateTaskDto taskDto)
    {
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (currentUserId == null) return Unauthorized("Unauthorized");

        var task = new UserTask
        {
            Title = taskDto.Title,
            Description = taskDto.Description,
            AppUserId = currentUserId
        };

        context.Tasks.Add(task);
        await context.SaveChangesAsync();

        return new UserTaskDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            IsCompleted = task.IsCompleted,
            CreatedAt = task.CreatedAt
        };
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateTask(int id, UpdateTaskDto taskDto)
    {
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (currentUserId == null)
            return Unauthorized();

        var task = await context.Tasks
        .FirstOrDefaultAsync(t =>
            t.Id == id &&
            t.AppUserId == currentUserId);

        if (task == null) return NotFound("Task not found");

        task.Title = taskDto.Title;
        task.Description = taskDto.Description;
        task.IsCompleted = taskDto.IsCompleted;

        await context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteTask(int id)

    {
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var task = await context.Tasks.FirstOrDefaultAsync(t =>
            t.Id == id &&
            t.AppUserId == currentUserId);
            
        if (task == null) return NotFound("Task not found");

        context.Tasks.Remove(task);
        await context.SaveChangesAsync();

        return NoContent();
    }

    // [HttpGet("error")]
    // public IActionResult GetError()
    // {
    //     throw new Exception("Test exception middleware");
    // }
}
