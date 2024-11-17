from django import template

register = template.Library()

@register.filter
def time_format(value):
    """Converts seconds into hours, minutes, and seconds."""
    total_seconds = int(value)
    hours = total_seconds // 3600
    minutes = (total_seconds % 3600) // 60
    seconds = total_seconds % 60
    return f"{hours}h {minutes}m {seconds}s"