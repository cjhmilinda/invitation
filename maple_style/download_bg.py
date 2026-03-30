import urllib.request
import re
import urllib.parse
html = urllib.request.urlopen(urllib.request.Request('https://html.duckduckgo.com/html/?q=henesys+background+wallpaper+maplestory', headers={'User-Agent': 'Mozilla/5.0'})).read().decode('utf-8')
urls = re.findall(r'//external-content\.duckduckgo\.com/iu/\?u=(.*?)&amp;', html)
if urls:
    img_url = urllib.parse.unquote(urls[0])
    try:
        urllib.request.urlretrieve(img_url, r'c:\app\study\새 폴더\wedding_templates-main\maple_style\images\henesys_bg.jpg')
        print('Success: ' + img_url)
    except Exception as e:
        print('Error:', e)
else:
    print('Failed to find URL')
