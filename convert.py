from PIL import Image

# Read the blue wordmark we copied earlier
img_path = r'c:\Users\batma\Desktop\utcc\UTCC-TP\src\main\resources\static\utcc-logo.png'
img = Image.open(img_path).convert("RGBA")
datas = img.getdata()

newData = []
for item in datas:
    if item[3] == 0:
        # Already transparent
        newData.append((255, 255, 255, 0)) # Force it to be white transparent
    else:
        # Calculate brightness (0 = black, 255 = white)
        brightness = (item[0] + item[1] + item[2]) / 3
        
        # If brightness > 230, it's the white background, so make it completely transparent
        if brightness > 230:
            newData.append((255, 255, 255, 0))
        else:
            # The blue pixels should become pure white, but keep some alpha for anti-aliasing
            # For dark blue text, brightness is low (e.g. 50). So 255 - 50 = 205 alpha.
            # This makes the dark blue become a solid white pixel with proper edges!
            alpha = int(255 - brightness)
            newData.append((255, 255, 255, alpha))

img.putdata(newData)

# Save the pure white transparent logo for dark backgrounds
out_src = r'c:\Users\batma\Desktop\utcc\UTCC-TP\src\main\resources\static\utcc-logo-white.png'
out_target = r'c:\Users\batma\Desktop\utcc\UTCC-TP\target\classes\static\utcc-logo-white.png'

img.save(out_src, "PNG")
try:
    img.save(out_target, "PNG")
except Exception as e:
    print(f"Failed to copy to target: {e}")
