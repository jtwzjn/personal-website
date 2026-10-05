# 生成站点社交分享图 (Open Graph image) -> public/images/og.png
# 依赖：Windows 自带 System.Drawing，无需额外安装。
# 用法：pwsh -File scripts/generate-og-image.ps1
# 修改文案后重新运行即可覆盖 public/images/og.png。

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$avatarPath = Join-Path $root 'public\images\avatar.png'
$outPath = Join-Path $root 'public\images\og.png'

$W = 1200
$H = 630

# 与站点配色保持一致（globals.css 的 industrial / glass 体系）
$cBgFrom = [System.Drawing.Color]::FromArgb(255, 251, 252, 254)
$cBgTo = [System.Drawing.Color]::FromArgb(255, 232, 239, 249)
$cInk = [System.Drawing.Color]::FromArgb(255, 28, 35, 51)
$cMuted = [System.Drawing.Color]::FromArgb(255, 104, 115, 134)
$cAccent = [System.Drawing.Color]::FromArgb(255, 61, 74, 107)

$bmp = New-Object System.Drawing.Bitmap($W, $H)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

# --- 背景渐变 ---
$rect = New-Object System.Drawing.Rectangle(0, 0, $W, $H)
$bg = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $cBgFrom, $cBgTo, 35.0)
$g.FillRectangle($bg, $rect)

# --- 角落柔光 ---
foreach ($glow in @(
    @{ X = -140; Y = -160; R = 520; C = [System.Drawing.Color]::FromArgb(28, 120, 145, 220) },
    @{ X = 980; Y = 380; R = 460; C = [System.Drawing.Color]::FromArgb(24, 140, 120, 210) }
  )) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $path.AddEllipse($glow.X, $glow.Y, $glow.R, $glow.R)
  $brush = New-Object System.Drawing.Drawing2D.PathGradientBrush($path)
  $brush.CenterColor = $glow.C
  $brush.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 255, 255, 255))
  $g.FillPath($brush, $path)
  $brush.Dispose(); $path.Dispose()
}

function Get-Font([string[]]$names, [float]$size, [System.Drawing.FontStyle]$style) {
  foreach ($n in $names) {
    try {
      $f = New-Object System.Drawing.Font($n, $size, $style, [System.Drawing.GraphicsUnit]::Pixel)
      if ($f.Name -eq $n) { return $f }
      $f.Dispose()
    } catch { }
  }
  return New-Object System.Drawing.Font('Segoe UI', $size, $style, [System.Drawing.GraphicsUnit]::Pixel)
}

$fBrand = Get-Font @('Microsoft YaHei', 'SimHei') 74 ([System.Drawing.FontStyle]::Bold)
$fName = Get-Font @('Microsoft YaHei', 'SimHei') 34 ([System.Drawing.FontStyle]::Bold)
$fBody = Get-Font @('Microsoft YaHei', 'SimHei') 27 ([System.Drawing.FontStyle]::Regular)
$fMono = Get-Font @('Consolas', 'Courier New') 24 ([System.Drawing.FontStyle]::Regular)

# --- 顶部小标签 ---
$label = 'DATA  ·  VISUALIZATION  ·  FULL-STACK'
$g.DrawString($label, $fMono, (New-Object System.Drawing.SolidBrush($cAccent)), 78, 86)

# --- 主标题 ---
$g.DrawString('今天我在家呐', $fBrand, (New-Object System.Drawing.SolidBrush($cInk)), 74, 140)

# --- 副标题 ---
$sub = 'hcr  ·  数据科学与大数据技术  ·  中国海洋大学'
$g.DrawString($sub, $fName, (New-Object System.Drawing.SolidBrush($cAccent)), 78, 258)

# --- 分隔线 ---
$pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(70, 61, 74, 107), 2)
$g.DrawLine($pen, 80, 322, 700, 322)

# --- 描述 ---
$g.DrawString('用数据可视化与全栈开发，把复杂数据变成可落地的决策依据。', $fBody, (New-Object System.Drawing.SolidBrush($cMuted)), 78, 356)
$g.DrawString('项目实践  ·  技术复盘  ·  在线简历', $fBody, (New-Object System.Drawing.SolidBrush($cMuted)), 78, 400)

# --- 底部域名 ---
$g.DrawString('jtwzjn.icu', $fMono, (New-Object System.Drawing.SolidBrush($cAccent)), 78, 520)

# --- 右侧头像（圆角卡片） ---
if (Test-Path -LiteralPath $avatarPath) {
  $avatar = [System.Drawing.Image]::FromFile($avatarPath)
  $size = 250
  $ax = 880
  $ay = 190
  $radius = 28

  $card = New-Object System.Drawing.Drawing2D.GraphicsPath
  $d = $radius * 2
  $card.AddArc($ax, $ay, $d, $d, 180, 90)
  $card.AddArc($ax + $size - $d, $ay, $d, $d, 270, 90)
  $card.AddArc($ax + $size - $d, $ay + $size - $d, $d, $d, 0, 90)
  $card.AddArc($ax, $ay + $size - $d, $d, $d, 90, 90)
  $card.CloseFigure()

  $shadow = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(30, 30, 40, 70))
  $shadowPath = New-Object System.Drawing.Drawing2D.GraphicsPath
  $d2 = $radius * 2
  $shadowPath.AddArc($ax + 6, $ay + 10, $d2, $d2, 180, 90)
  $shadowPath.AddArc($ax + $size - $d2 + 6, $ay + 10, $d2, $d2, 270, 90)
  $shadowPath.AddArc($ax + $size - $d2 + 6, $ay + $size - $d2 + 10, $d2, $d2, 0, 90)
  $shadowPath.AddArc($ax + 6, $ay + $size - $d2 + 10, $d2, $d2, 90, 90)
  $shadowPath.CloseFigure()
  $g.FillPath($shadow, $shadowPath)

  $oldClip = $g.Clip
  $g.SetClip($card)
  $g.DrawImage($avatar, $ax, $ay, $size, $size)
  $g.Clip = $oldClip

  $ring = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(90, 255, 255, 255), 3)
  $g.DrawPath($ring, $card)

  $avatar.Dispose()
  $card.Dispose(); $shadowPath.Dispose()
  $shadow.Dispose(); $ring.Dispose()
} else {
  Write-Warning "未找到头像：$avatarPath"
}

# --- 保存 ---
$outDir = Split-Path -Parent $outPath
if (-not (Test-Path -LiteralPath $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }
$bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)

$g.Dispose(); $bmp.Dispose(); $bg.Dispose(); $pen.Dispose()
$fBrand.Dispose(); $fName.Dispose(); $fBody.Dispose(); $fMono.Dispose()

Write-Output "已生成：$outPath"
