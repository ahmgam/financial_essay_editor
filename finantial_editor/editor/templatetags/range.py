from django import template

register = template.Library()

@register.filter(name='range')
def rangeInt(value):
    return range(0,int(value))
