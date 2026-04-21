package org.example.utcctp.api;

import org.example.utcctp.api.dto.FileResponse;
import org.example.utcctp.model.FileAsset;
import org.example.utcctp.storage.FileService;
import org.example.utcctp.user.CurrentUserService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/files")
public class FileController {
    private final FileService fileService;
    private final CurrentUserService currentUserService;

    public FileController(FileService fileService, CurrentUserService currentUserService) {
        this.fileService = fileService;
        this.currentUserService = currentUserService;
    }

    @PostMapping
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADVISOR') or hasRole('STAFF') or hasRole('ADMIN') or hasRole('COMPANY')")
    public FileResponse upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "docType", required = false) String docType) {
        FileAsset asset = fileService.store(file, currentUserService.requireUser(), category, docType);
        return new FileResponse(asset.getId(), asset.getOriginalName(), asset.getContentType(), asset.getSizeBytes(), asset.getPublicUrl());
    }

    @GetMapping
    public java.util.List<FileResponse> listFiles(@RequestParam(value = "category", required = false) String category) {
        java.util.List<FileAsset> assets = fileService.listUserFiles(currentUserService.requireUser().getId(), category);
        return assets.stream()
                .map(asset -> new FileResponse(asset.getId(), asset.getOriginalName(), asset.getContentType(), asset.getSizeBytes(), asset.getPublicUrl()))
                .collect(java.util.stream.Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resource> download(@PathVariable UUID id) {
        FileAsset asset = fileService.getAsset(id);
        if ("CLOUDINARY".equalsIgnoreCase(asset.getProvider()) && asset.getPublicUrl() != null) {
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(asset.getPublicUrl()))
                    .build();
        }
        Resource resource = fileService.load(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }
}
