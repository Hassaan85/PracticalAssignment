using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class TasksController(AppDbContext context) : BaseApiController
{
    [HttpGet("{userId}")]
    public async Task<ActionResult<IEnumerable<UserTaskDto>>> GetUserTasks(string userId)
    {
        var tasks = await context.Tasks
            .Where(t => t.AppUserId == userId)
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

    [HttpPost("{userId}")]
    public async Task<ActionResult<UserTaskDto>> CreateTask(string userId, CreateTaskDto taskDto)
    {
        var user = await context.Users.FindAsync(userId);
        if (user == null) return NotFound("User not found");

        var task = new UserTask
        {
            Title = taskDto.Title,
            Description = taskDto.Description,
            AppUserId = userId
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
        var task = await context.Tasks.FindAsync(id);
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
        var task = await context.Tasks.FindAsync(id);
        if (task == null) return NotFound("Task not found");

        context.Tasks.Remove(task);
        await context.SaveChangesAsync();

        return NoContent();
    }
}
