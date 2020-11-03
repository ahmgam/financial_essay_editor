from django import template

register = template.Library()

@register.filter(name='arrayReturn')
def arrayReturn(array,index):
    return array[int(index)]