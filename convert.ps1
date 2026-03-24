Add-Type -AssemblyName System.Drawing

$sourcePath = "c:\Users\batma\Desktop\utcc\UTCC-TP\src\main\resources\static\utcc-logo.png"
$targetPathSrc = "c:\Users\batma\Desktop\utcc\UTCC-TP\src\main\resources\static\utcc-logo-white.png"
$targetPathClasses = "c:\Users\batma\Desktop\utcc\UTCC-TP\target\classes\static\utcc-logo-white.png"

$img = [System.Drawing.Bitmap]::FromFile($sourcePath)
# Make white pixels transparent
$img.MakeTransparent([System.Drawing.Color]::White)

$img.Save($targetPathSrc, [System.Drawing.Imaging.ImageFormat]::Png)
try {
    $img.Save($targetPathClasses, [System.Drawing.Imaging.ImageFormat]::Png)
} catch {
}

$img.Dispose()
