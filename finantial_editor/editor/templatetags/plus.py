from django import template
register = template.Library()
@register.filter(name='plus')
def plus (val1,val2):
    return int(val1)+int(val2)
