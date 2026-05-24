using System;

namespace API.Entities;

public class UserTask
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public string AppUserId { get; set; }
    public AppUser AppUser { get; set; }
}
