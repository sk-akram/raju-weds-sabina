$ErrorActionPreference = "Stop"

$images = @(
    @{
        filename = "gallery1_couple_banquet.jpg"
        category = "pre-wedding"
        caption = "The Blessed Couple entering the Grand Banquet Hall"
    },
    @{
        filename = "gallery2_nikah_stage.jpg"
        category = "ceremony"
        caption = "Nikah Stage - Traditional Low Seating & Soft Drapes"
    },
    @{
        filename = "gallery3_walima_banquet.jpg"
        category = "reception"
        caption = "Walima Reception Banquet - Emerald and Gold Tableware"
    }
)

$baseUrl = "https://raju-weds-sabina.pages.dev"

foreach ($image in $images) {
    $filePath = "uploads/$($image.filename)"
    
    if (-not (Test-Path $filePath)) {
        Write-Host "❌ File not found: $filePath"
        continue
    }
    
    Write-Host "`nUploading $($image.filename)..."
    
    try {
        $boundary = [System.Guid]::NewGuid().ToString()
        $LF = "`r`n"
        
        $fileBytes = [System.IO.File]::ReadAllBytes($filePath)
        $fileContent = [System.Text.Encoding]::GetEncoding("iso-8859-1").GetString($fileBytes)
        
        $bodyLines = @(
            "--$boundary",
            "Content-Disposition: form-data; name=`"file`"; filename=`"$($image.filename)`"",
            "Content-Type: image/jpeg",
            "",
            $fileContent,
            "--$boundary",
            "Content-Disposition: form-data; name=`"category`"",
            "",
            $image.category,
            "--$boundary",
            "Content-Disposition: form-data; name=`"caption`"",
            "",
            $image.caption,
            "--$boundary--"
        )
        
        $body = $bodyLines -join $LF
        $bodyBytes = [System.Text.Encoding]::GetEncoding("iso-8859-1").GetBytes($body)
        
        $response = Invoke-WebRequest -Uri "$baseUrl/api/upload" `
            -Method Post `
            -ContentType "multipart/form-data; boundary=$boundary" `
            -Body $bodyBytes `
            -UseBasicParsing
        
        $result = $response.Content | ConvertFrom-Json
        
        if ($result.success) {
            Write-Host "✅ Uploaded $($image.filename) (ID: $($result.id))"
        } else {
            Write-Host "❌ Failed to upload $($image.filename): $($result.error)"
        }
    }
    catch {
        Write-Host "❌ Failed to upload $($image.filename): $($_.Exception.Message)"
    }
}

Write-Host "`n✨ Upload complete!"
