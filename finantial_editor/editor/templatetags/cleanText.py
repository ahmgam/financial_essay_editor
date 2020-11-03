from django import template

register = template.Library()

@register.filter(name='cleanText')
def cleanText(text):
    return str(text).replace('&quot;','"')
