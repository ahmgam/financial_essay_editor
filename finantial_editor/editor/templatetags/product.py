from django import template

register = template.Library()
@register.filter(name='product')
def product(val1,val2):
    return int(val1)*int(val2)

