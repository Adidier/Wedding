#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Script para generar enlaces de invitación para wedding RSVP

.DESCRIPTION
    Genera URLs personalizadas para cada invitado basadas en su ID

.PARAMETER Domain
    Dominio de tu aplicación (ej: https://miconco.vercel.app)

.EXAMPLE
    .\scripts\generate-links.ps1 -Domain "https://miconco.vercel.app"
#>

param(
    [string]$Domain = "http://localhost:3000",
    [int]$StartId = 1,
    [int]$EndId = 10
)

Write-Host "=== Wedding RSVP Invitation Links ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Domain: $Domain" -ForegroundColor Yellow
Write-Host ""

# Generate links
$links = @()
for ($i = $StartId; $i -le $EndId; $i++) {
    $guestId = "guest-$('{0:D3}' -f $i)"
    $url = "$Domain/rsvp?guest=$guestId"
    Write-Host "$guestId : $url"
    $links += @{ id = $guestId; url = $url }
}

Write-Host ""

# Generate CSV
Write-Host "CSV format (paste into Google Sheets):" -ForegroundColor Green
Write-Host ""
$links | ForEach-Object { Write-Host "$($_.id),$($_.url)" }
Write-Host ""

# Save to file
$outputFile = Join-Path $PSScriptRoot "..\invitation-links.txt"
$links | ForEach-Object { "$($_.id): $($_.url)" } | Set-Content $outputFile
Write-Host "✅ Links saved to: $outputFile" -ForegroundColor Green
Write-Host ""
