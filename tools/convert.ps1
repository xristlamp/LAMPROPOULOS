# Μετατρέπει τις παρουσιάσεις (.pptx) σε PDF μέσα στον φάκελο files\ του site.
# Χρήση: powershell -ExecutionPolicy Bypass -File tools\convert.ps1
# Για νέο μάθημα: πρόσθεσε μια γραμμή στη λίστα $map και ξανατρέξε το script.

$desk = [Environment]::GetFolderPath('Desktop')
$site = Split-Path -Parent $PSScriptRoot

$map = @(
  @("ΣΑΕΚ ΜΑΡΚΟΠΟΥΛΟΥ\ΣΛΣ_Εργαστήριο01_Τι_είναι_το_ΛΣ.pptx",            "markopoulo\sls-01-theoria"),
  @("ΣΑΕΚ ΜΑΡΚΟΠΟΥΛΟΥ\ΣΛΣ_Εργαστήριο01_ΠΡΑΚΤΙΚΟ.pptx",                  "markopoulo\sls-01-praktiko"),
  @("ΣΑΕΚ ΜΑΡΚΟΠΟΥΛΟΥ\ΣΛΣ_Εργαστήριο02_Κατηγορίες_ΛΣ_και_Διεργασίες.pptx", "markopoulo\sls-02-theoria"),
  @("ΣΑΕΚ ΜΑΡΚΟΠΟΥΛΟΥ\ΣΛΣ_Εργαστήριο02_ΠΡΑΚΤΙΚΟ.pptx",                  "markopoulo\sls-02-praktiko"),
  @("ΣΑΕΚ_GLYFADA\Μάθημα01_Γνωριμία_με_την_Python_v2.pptx",              "glyfada\python-01-gnorimia"),
  @("ΣΑΕΚ_GLYFADA\Μάθημα02_if_while_for.pptx",                           "glyfada\python-02-if-while-for"),
  @("ΣΑΕΚ_GLYFADA\Μάθημα03_Λίστες_και_πλειάδες.pptx",                    "glyfada\python-03-listes")
)

$pp = New-Object -ComObject PowerPoint.Application
foreach ($m in $map) {
  $src = Join-Path $desk $m[0]
  $out = Join-Path $site ("files\" + $m[1])
  New-Item -ItemType Directory -Force (Split-Path $out) | Out-Null
  Copy-Item $src "$out.pptx" -Force
  $p = $pp.Presentations.Open($src, $true, $false, $false)   # ReadOnly, χωρίς παράθυρο
  $p.SaveAs("$out.pdf", 32)                                   # 32 = ppSaveAsPDF
  $p.Close()
  Write-Output ("OK  " + $m[1])
}
$pp.Quit()
